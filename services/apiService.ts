// FIX: This file was empty, causing a "not a module" error in files that import from it.
// It has been implemented to provide an API service layer for the application.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface AiSuggestionResponse {
  suggestion: string;
}

export const apiService = {
  /**
   * Fetches an AI-generated suggestion for a workout or diet plan from the backend.
   * @param type - The type of plan ('Workout' or 'Diet').
   * @param prompt - The user's prompt describing the desired plan.
   * @returns A promise that resolves to an object containing the AI suggestion.
   */
  getAiSuggestion: async (type: 'Workout' | 'Diet', prompt: string): Promise<AiSuggestionResponse> => {
    const response = await fetch(`${API_BASE_URL}/ai/suggestion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch AI suggestion from the backend.' }));
      throw new Error(errorData.message || 'An unknown error occurred while fetching AI suggestion.');
    }

    return response.json();
  },
};
