const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface AiSuggestionResponse {
  suggestion: string;
}

// --- Helper para realizar chamadas de API com token de autenticação ---
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Ocorreu um erro na requisição.' }));
    throw new Error(errorData.message || 'Erro desconhecido.');
  }

  return response.json();
};


export const apiService = {
  // --- Auth ---
  login: async (credentials: any) => {
    const data = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  register: async (userData: any) => {
    return fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // --- AI ---
  getAiSuggestion: async (type: 'Workout' | 'Diet', prompt: string): Promise<AiSuggestionResponse> => {
     return fetchWithAuth('/ai/suggestion', {
      method: 'POST',
      body: JSON.stringify({ type, prompt }),
    });
  },

  // --- Students ---
  getStudents: async () => {
    return fetchWithAuth('/students');
  },

  addStudent: async (studentData: any) => {
    return fetchWithAuth('/students', {
        method: 'POST',
        body: JSON.stringify(studentData),
    });
  },

  assignWorkoutPlanToStudent: async (studentId: string, planId: string) => {
    return fetchWithAuth(`/students/${studentId}/assign-workout`, {
        method: 'POST',
        body: JSON.stringify({ planId }),
    });
  },

  assignDietPlanToStudent: async (studentId: string, planId: string) => {
     return fetchWithAuth(`/students/${studentId}/assign-diet`, {
        method: 'POST',
        body: JSON.stringify({ planId }),
    });
  },
  
  // --- Workout Plans ---
  getWorkoutPlans: async () => {
    return fetchWithAuth('/workout-plans');
  },

  addWorkoutPlan: async (planData: { name: string, details: string }) => {
    return fetchWithAuth('/workout-plans', {
        method: 'POST',
        body: JSON.stringify(planData),
    });
  },

  // --- Diet Plans ---
  getDietPlans: async () => {
    return fetchWithAuth('/diet-plans');
  },

  addDietPlan: async (planData: { name: string, details: string }) => {
    return fetchWithAuth('/diet-plans', {
        method: 'POST',
        body: JSON.stringify(planData),
    });
  },

};
