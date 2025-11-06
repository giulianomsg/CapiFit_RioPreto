
import React, { useState } from 'react';
import { generateWorkoutSuggestion, generateDietSuggestion } from '../services/geminiService';
import { ICONS } from '../constants';

interface PlanCreatorProps {
  type: 'Workout' | 'Diet';
  studentName: string;
  onClose: () => void;
}

export const PlanCreator: React.FC<PlanCreatorProps> = ({ type, studentName, onClose }) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState('');

  const handleGenerateSuggestion = async () => {
    if (!aiPrompt) return;
    setIsLoading(true);
    setAiSuggestion('');
    try {
      const suggestion = type === 'Workout'
        ? await generateWorkoutSuggestion(aiPrompt)
        : await generateDietSuggestion(aiPrompt);
      setAiSuggestion(suggestion);
    } catch (error) {
      setAiSuggestion('Failed to generate suggestion. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-xl w-full max-w-2xl m-4">
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold">Create {type} Plan for {studentName}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Use the AI assistant to get some ideas.</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="ai-prompt" className="block text-sm font-medium mb-1">AI Prompt</label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {type === 'Workout' 
                ? 'e.g., "A 3-day full body routine for a beginner focused on strength."'
                : 'e.g., "A 2000 calorie meal plan high in protein for muscle gain."'}
            </p>
            <div className="flex space-x-2">
              <input
                id="ai-prompt"
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe the plan you need..."
                className="flex-1 bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleGenerateSuggestion}
                disabled={isLoading}
                className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ICONS.ai}
                <span className="ml-2">{isLoading ? 'Generating...' : 'Generate'}</span>
              </button>
            </div>
          </div>
          
          {(isLoading || aiSuggestion) && (
            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
              <h3 className="font-semibold mb-2">AI Suggestion:</h3>
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                </div>
              ) : (
                <textarea
                  readOnly
                  value={aiSuggestion}
                  className="w-full h-40 bg-transparent border-none text-sm whitespace-pre-wrap resize-none focus:outline-none"
                />
              )}
            </div>
          )}

          <textarea
            placeholder={`Manually enter the ${type.toLowerCase()} plan details here...`}
            className="w-full h-48 bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="p-6 bg-gray-50 dark:bg-dark-bg/50 flex justify-end space-x-3 rounded-b-lg">
          <button onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-light-text dark:text-dark-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
            Cancel
          </button>
          <button className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
            Save Plan
          </button>
        </div>
      </div>
    </div>
  );
};
