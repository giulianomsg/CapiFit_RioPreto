import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Database Connection (TODO) ---
// Ex: import pg from 'pg'; const { Pool } = pg;
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// Adicione aqui a lógica para conectar ao seu banco de dados PostgreSQL.
console.log("AVISO: Usando dados mock. Conecte a um banco de dados para persistência.");


// --- Gemini AI Setup ---
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.error("Chave da API Gemini não encontrada no .env. Os recursos de IA serão desativados.");
}
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;


// --- Mock Data (Substitua pela lógica do DB) ---
let mockStudents = [];
let mockWorkoutPlans = [];
let mockDietPlans = [];


// --- API Endpoints ---

// GET all data
app.get('/api/data', async (req, res) => {
    // TODO: Substituir por chamadas ao banco de dados
    try {
        res.json({
            students: mockStudents,
            workoutPlans: mockWorkoutPlans,
            dietPlans: mockDietPlans,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// POST a new student
app.post('/api/students', async (req, res) => {
    // TODO: Inserir no banco de dados
    const studentData = req.body;
    const newStudent = {
      ...studentData,
      id: `s_${Date.now()}`,
      progressPhotos: [],
      measurements: [{ date: new Date().toISOString().split('T')[0], weight: 0 }],
    };
    mockStudents.push(newStudent);
    res.status(201).json(newStudent);
});

// POST a new workout plan (template)
app.post('/api/workouts', async (req, res) => {
    // TODO: Inserir no banco de dados
    const planData = req.body;
     const newPlan = {
      id: `wp_${Date.now()}`,
      name: planData.name,
      details: planData.details,
    };
    mockWorkoutPlans.push(newPlan);
    res.status(201).json(newPlan);
});

// POST a new diet plan (template)
app.post('/api/diets', async (req, res) => {
    // TODO: Inserir no banco de dados
    const planData = req.body;
    const newPlan = {
      id: `dp_${Date.now()}`,
      name: planData.name,
      details: planData.details,
    };
    mockDietPlans.push(newPlan);
    res.status(201).json(newPlan);
});


// PUT - Assign workout plan to student
app.put('/api/students/:studentId/workout-plan', async (req, res) => {
    const { studentId } = req.params;
    const planData = req.body;
    
    // TODO: Lógica de banco de dados
    // 1. Criar o novo plano de treino na tabela de planos
    const newPlan = {
      id: `wp_${Date.now()}`,
      name: planData.name,
      details: planData.details,
    };
    mockWorkoutPlans.push(newPlan);

    // 2. Atualizar o aluno com o ID do novo plano
    mockStudents = mockStudents.map(s => s.id === studentId ? { ...s, workoutPlanId: newPlan.id } : s);
    const updatedStudent = mockStudents.find(s => s.id === studentId);

    res.json({ updatedStudent, newPlan });
});


// PUT - Assign diet plan to student
app.put('/api/students/:studentId/diet-plan', async (req, res) => {
    const { studentId } = req.params;
    const planData = req.body;

    // TODO: Lógica de banco de dados
    const newPlan = {
      id: `dp_${Date.now()}`,
      name: planData.name,
      details: planData.details,
    };
    mockDietPlans.push(newPlan);
    
    mockStudents = mockStudents.map(s => s.id === studentId ? { ...s, dietPlanId: newPlan.id } : s);
    const updatedStudent = mockStudents.find(s => s.id === studentId);
    
    res.json({ updatedStudent, newPlan });
});


// POST - AI Suggestion
app.post('/api/ai/suggest', async (req, res) => {
    if (!ai) {
        return res.status(503).json({ error: "O serviço de IA não está disponível." });
    }

    const { type, prompt } = req.body;
    if (!type || !prompt) {
        return res.status(400).json({ error: "Tipo e prompt são obrigatórios." });
    }

    let finalPrompt = '';
    if (type === 'Workout') {
        finalPrompt = `Você é um personal trainer especialista. Crie uma sugestão de treino com base na seguinte solicitação. Forneça um plano conciso e prático. Solicitação: "${prompt}"`;
    } else if (type === 'Diet') {
        finalPrompt = `Você é um nutricionista especialista. Crie uma sugestão de plano alimentar simples com base na seguinte solicitação. Foque em alimentos integrais e forneça uma estimativa de calorias. Solicitação: "${prompt}"`;
    } else {
        return res.status(400).json({ error: "Tipo de sugestão inválido." });
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: finalPrompt,
        });
        const suggestionText = response.text;
        res.json({ suggestion: suggestionText });
    } catch (error) {
        console.error("Erro na API Gemini:", error);
        res.status(500).json({ error: "Falha ao gerar sugestão da IA." });
    }
});


// --- Start Server ---
app.listen(port, () => {
  console.log(`Servidor backend rodando em http://localhost:${port}`);
});