import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// FIX: Import GoogleGenAI for AI features.
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
};

let db;
try {
  db = await mysql.createPool(dbConfig);
  console.log("Conectado ao banco de dados MySQL com sucesso.");
} catch (error) {
  console.error("Erro ao conectar com o banco de dados:", error);
  process.exit(1); // Encerra a aplicação se não conseguir conectar ao DB
}

// FIX: Initialize Gemini AI client.
if (!process.env.API_KEY) {
    console.warn("API_KEY for Gemini not found in .env file. AI features will not work.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// --- API Endpoints ---

// Rota de teste
app.get('/api', (req, res) => {
  res.json({ message: 'API CapiFit está no ar!' });
});

// FIX: Add AI suggestion endpoint.
const aiRouter = express.Router();
aiRouter.post('/suggestion', async (req, res) => {
    if (!process.env.API_KEY) {
        return res.status(500).json({ message: 'API Key for AI service is not configured on the server.' });
    }

    const { type, prompt } = req.body;

    if (!type || !prompt) {
        return res.status(400).json({ message: 'Type and prompt are required.' });
    }

    try {
        let systemInstruction = '';
        if (type === 'Workout') {
            systemInstruction = `You are a professional fitness coach. Create a detailed workout plan based on the user's request. The plan should be well-structured, easy to follow, and formatted in markdown. Include exercises, sets, reps, and rest periods. Provide a brief and encouraging title for the plan. Respond in Brazilian Portuguese.`;
        } else if (type === 'Diet') {
            systemInstruction = `You are a professional nutritionist. Create a detailed diet plan based on the user's request. The plan should be nutritionally balanced and include meal suggestions for breakfast, lunch, dinner, and snacks. Format the response in markdown. Provide a brief and encouraging title for the plan. Respond in Brazilian Portuguese.`;
        } else {
            return res.status(400).json({ message: 'Invalid type specified.' });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        res.json({ suggestion: response.text });

    } catch (error) {
        console.error('Error with Gemini API:', error);
        res.status(500).json({ message: 'Error generating AI suggestion.' });
    }
});
app.use('/api/ai', aiRouter);


// === Módulo de Autenticação e Cadastro ===
const authRouter = express.Router();

// [POST] /api/auth/register - Cadastro de novos usuários
authRouter.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body; // role pode ser 'trainer' ou 'student'

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Verifica se o usuário já existe
    const [existingUsers] = await db.execute('SELECT email FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Este e-mail já está em uso.' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insere o novo usuário no banco
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


// [POST] /api/auth/login - Login de usuários
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // Gera o token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token expira em 1 dia
        );

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


// --- Placeholder para outros módulos da API ---
// TODO: Implementar rotas para /api/users, /api/workouts, /api/diets, etc.
// Exemplo: app.use('/api/students', studentsRouter);


// --- Start Server ---
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});
