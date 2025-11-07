import type { Student, WorkoutPlan, DietPlan } from '../types';

const API_BASE_URL = '/api'; // Nginx irá redirecionar para o backend

const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ocorreu um erro no servidor');
    }
    return response.json();
};

export const apiService = {
    getAllData: async (): Promise<{ students: Student[], workoutPlans: WorkoutPlan[], dietPlans: DietPlan[] }> => {
        const response = await fetch(`${API_BASE_URL}/data`);
        return handleResponse(response);
    },

    addStudent: async (studentData: Omit<Student, 'id' | 'progressPhotos' | 'measurements'>): Promise<Student> => {
        const response = await fetch(`${API_BASE_URL}/students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(studentData),
        });
        return handleResponse(response);
    },

    addWorkoutPlan: async (planData: { name: string; details: string }): Promise<WorkoutPlan> => {
        const response = await fetch(`${API_BASE_URL}/workouts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(planData),
        });
        return handleResponse(response);
    },

    addDietPlan: async (planData: { name: string; details: string }): Promise<DietPlan> => {
        const response = await fetch(`${API_BASE_URL}/diets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(planData),
        });
        return handleResponse(response);
    },
    
    assignWorkoutPlan: async (studentId: string, planData: { name: string; details: string }): Promise<{ updatedStudent: Student, newPlan: WorkoutPlan }> => {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}/workout-plan`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(planData),
        });
        return handleResponse(response);
    },
    
    assignDietPlan: async (studentId: string, planData: { name: string; details: string }): Promise<{ updatedStudent: Student, newPlan: DietPlan }> => {
        const response = await fetch(`${API_BASE_URL}/students/${studentId}/diet-plan`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(planData),
        });
        return handleResponse(response);
    },

    getAiSuggestion: async (type: 'Workout' | 'Diet', prompt: string): Promise<{ suggestion: string }> => {
        const response = await fetch(`${API_BASE_URL}/ai/suggest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, prompt }),
        });
        return handleResponse(response);
    }
};
