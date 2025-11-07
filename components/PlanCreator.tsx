
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
      setAiSuggestion('Falha ao gerar sugestão. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const typeInPortuguese = type === 'Workout' ? 'Treino' : 'Dieta';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-xl w-full max-w-2xl m-4">
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold">Criar Plano de {typeInPortuguese} para {studentName}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Use o assistente de IA para ter algumas ideias.</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="ai-prompt" className="block text-sm font-medium mb-1">Prompt para IA</label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {type === 'Workout' 
                ? 'ex.: "Uma rotina de corpo inteiro de 3 dias para um iniciante focado em força."'
                : 'ex.: "Um plano alimentar de 2000 calorias rico em proteínas para ganho muscular."'}
            </p>
            <div className="flex space-x-2">
              <input
                id="ai-prompt"
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Descreva o plano que você precisa..."
                className="flex-1 bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleGenerateSuggestion}
                disabled={isLoading}
                className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {ICONS.ai}
                <span className="ml-2">{isLoading ? 'Gerando...' : 'Gerar'}</span>
              </button>
            </div>
          </div>
          
          {(isLoading || aiSuggestion) && (
            <div className="bg-light-bg dark:bg-dark-bg p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Sugestão da IA:</h3>
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
            placeholder={`Manualmente insira os detalhes do plano de ${typeInPortuguese.toLowerCase()} aqui...`}
            className="w-full h-48 bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="p-6 bg-gray-50 dark:bg-dark-bg/50 flex justify-end space-x-3 rounded-b-lg">
          <button onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-light-text dark:text-dark-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
            Cancelar
          </button>
          <button className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
            Salvar Plano
          </button>
        </div>
      </div>
    </div>
  );
};