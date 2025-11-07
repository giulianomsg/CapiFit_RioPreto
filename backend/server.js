import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let db;
try {
  db = await mysql.createPool(dbConfig);
  console.log("Conectado ao banco de dados MySQL com sucesso.");
} catch (error) {
  console.error("Erro ao conectar com o banco de dados:", error);
  process.exit(1);
}

// --- Initialize Gemini AI client ---
if (!process.env.API_KEY) {
    console.warn("API_KEY for Gemini not found in .env file. AI features will not work.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// --- Authentication Middleware ---
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
};


// --- API Endpoints ---
app.get('/api', (req, res) => {
  res.json({ message: 'API CapiFit está no ar!' });
});

// --- AI Module ---
const aiRouter = express.Router();
aiRouter.post('/suggestion', async (req, res) => {
    if (!process.env.API_KEY) {
        return res.status(500).json({ message: 'API Key for AI service is not configured on the server.' });
    }
    const { type, prompt } = req.body;
    if (!type || !prompt) return res.status(400).json({ message: 'Type and prompt are required.' });

    try {
        const systemInstruction = type === 'Workout'
            ? `You are a professional fitness coach. Create a detailed workout plan based on the user's request. The plan should be well-structured, easy to follow, and formatted in markdown. Include exercises, sets, reps, and rest periods. Provide a brief and encouraging title for the plan. Respond in Brazilian Portuguese.`
            : `You are a professional nutritionist. Create a detailed diet plan based on the user's request. The plan should be nutritionally balanced and include meal suggestions for breakfast, lunch, dinner, and snacks. Format the response in markdown. Provide a brief and encouraging title for the plan. Respond in Brazilian Portuguese.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { systemInstruction }
        });
        res.json({ suggestion: response.text });
    } catch (error) {
        console.error('Error with Gemini API:', error);
        res.status(500).json({ message: 'Error generating AI suggestion.' });
    }
});
app.use('/api/ai', aiRouter);

// --- Auth Module ---
const authRouter = express.Router();
authRouter.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });

  try {
    const [existingUsers] = await db.execute('SELECT email FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    res.status(201).json({ message: 'Usuário cadastrado com sucesso!', userId: result.insertId });
  } catch (error) {
    console.error("Erro no cadastro:", error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email e senha são obrigatórios.' });

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];
        if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(401).json({ message: 'Credenciais inválidas.' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            message: 'Login bem-sucedido!',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});
app.use('/api/auth', authRouter);

// --- Students Module ---
const studentsRouter = express.Router();
studentsRouter.use(verifyToken); // Protege todas as rotas de alunos

studentsRouter.get('/', async (req, res) => {
    try {
        const trainerId = req.user.id;
        const [rows] = await db.execute(
            `SELECT 
                s.id,
                u.name,
                u.email,
                u.avatar_url AS avatarUrl,
                s.subscription_plan AS plan,
                s.status,
                s.last_active AS lastActive,
                s.workout_plan_id AS workoutPlanId,
                s.diet_plan_id AS dietPlanId
            FROM students s
            JOIN users u ON s.user_id = u.id
            WHERE s.trainer_id = ?`,
            [trainerId]
        );

        // Mock measurements for now, as we haven't implemented that part yet
        const studentsWithData = rows.map(student => ({
            ...student,
            progressPhotos: [],
            measurements: [
                { date: '2024-01-15', weight: 70 },
                { date: '2024-02-15', weight: 68.5 },
                { date: '2024-03-15', weight: 67 },
            ]
        }));
        
        res.json(studentsWithData);
    } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

studentsRouter.post('/', async (req, res) => {
    const { name, email, plan, status } = req.body;
    const trainerId = req.user.id;
    const connection = await db.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Create user account for the student
        const tempPassword = 'password_provisoria_123'; // Student should change this
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        const [userResult] = await connection.execute(
            'INSERT INTO users (name, email, password, role, avatar_url) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, 'student', `https://picsum.photos/seed/${name.replace(/\s+/g, '')}/200/200`]
        );
        const newUserId = userResult.insertId;

        // 2. Link student to trainer
        const [studentResult] = await connection.execute(
            'INSERT INTO students (user_id, trainer_id, subscription_plan, status) VALUES (?, ?, ?, ?)',
            [newUserId, trainerId, plan, status]
        );

        await connection.commit();
        res.status(201).json({ message: 'Aluno adicionado com sucesso!', studentId: studentResult.insertId, userId: newUserId });

    } catch (error) {
        await connection.rollback();
        console.error("Erro ao adicionar aluno:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Um usuário com este e-mail já existe.' });
        }
        res.status(500).json({ message: 'Erro interno do servidor.' });
    } finally {
        connection.release();
    }
});

// Assign Plans
studentsRouter.post('/:studentId/assign-workout', async (req, res) => {
    const { studentId } = req.params;
    const { planId } = req.body;
    const trainerId = req.user.id;
    try {
        await db.execute('UPDATE students SET workout_plan_id = ? WHERE id = ? AND trainer_id = ?', [planId, studentId, trainerId]);
        res.json({ message: 'Plano de treino atribuído com sucesso.' });
    } catch (error) {
        console.error("Erro ao atribuir plano de treino:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

studentsRouter.post('/:studentId/assign-diet', async (req, res) => {
    const { studentId } = req.params;
    const { planId } = req.body;
    const trainerId = req.user.id;
    try {
        await db.execute('UPDATE students SET diet_plan_id = ? WHERE id = ? AND trainer_id = ?', [planId, studentId, trainerId]);
        res.json({ message: 'Plano de dieta atribuído com sucesso.' });
    } catch (error) {
        console.error("Erro ao atribuir plano de dieta:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


app.use('/api/students', studentsRouter);


// --- Plans Module (Templates) ---
const createPlanRouter = (tableName) => {
    const router = express.Router();
    router.use(verifyToken);

    router.get('/', async (req, res) => {
        const creatorId = req.user.id;
        try {
            const [plans] = await db.execute(`SELECT id, name, details FROM ${tableName} WHERE creator_id = ?`, [creatorId]);
            res.json(plans);
        } catch (error) {
            res.status(500).json({ message: `Erro ao buscar planos de ${tableName}.`});
        }
    });

    router.post('/', async (req, res) => {
        const { name, details } = req.body;
        const creatorId = req.user.id;
        try {
            const [result] = await db.execute(`INSERT INTO ${tableName} (creator_id, name, details) VALUES (?, ?, ?)`, [creatorId, name, details]);
            res.status(201).json({ message: 'Plano criado com sucesso', id: result.insertId, name, details });
        } catch (error) {
            res.status(500).json({ message: `Erro ao criar plano de ${tableName}.` });
        }
    });

    return router;
};

app.use('/api/workout-plans', createPlanRouter('workout_plans'));
app.use('/api/diet-plans', createPlanRouter('diet_plans'));


// --- Start Server ---
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});