
import React, { useState } from 'react';
import { generateWorkoutSuggestion, generateDietSuggestion } from '../services/geminiService';
import { ICONS } from '../constants';

interface PlanCreatorProps {
  type: 'Workout' | 'Diet';
  studentName?: string;
  onClose: () => void;
  onSave: (plan: { name: string, details: string }) => void;
}

export const PlanCreator: React.FC<PlanCreatorProps> = ({ type, studentName, onClose, onSave }) => {
  const [planName, setPlanName] = useState('');
  const [planDetails, setPlanDetails] = useState('');
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
  
  const handleUseSuggestion = () => {
    setPlanDetails(aiSuggestion);
  }

  const handleSave = () => {
    if (!planName || !planDetails) {
        alert("Por favor, preencha o nome e os detalhes do plano.");
        return;
    }
    onSave({ name: planName, details: planDetails });
  }

  const typeInPortuguese = type === 'Workout' ? 'Treino' : 'Dieta';
  const title = studentName 
    ? `Criar Plano de ${typeInPortuguese} para ${studentName}`
    : `Criar Novo Modelo de ${typeInPortuguese}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-xl w-full max-w-2xl m-4 flex flex-col max-h-[90vh]">
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {studentName ? 'Use o assistente de IA para ter algumas ideias.' : 'Este plano será salvo como um modelo para reutilização.'}
          </p>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="plan-name" className="block text-sm font-medium mb-1">Nome do Plano</label>
             <input
                id="plan-name"
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                placeholder={`ex: ${type === 'Workout' ? 'Força Total - Fase 1' : 'Dieta Hipercalórica'}`}
                className="w-full bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
          </div>

          <div className="border-t dark:border-gray-700 pt-4">
            <label htmlFor="ai-prompt" className="block text-sm font-medium mb-1">Assistente de IA</label>
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
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Sugestão da IA:</h3>
                {!isLoading && (
                  <button onClick={handleUseSuggestion} className="text-sm bg-primary/20 text-primary font-semibold py-1 px-3 rounded-md hover:bg-primary/30">
                    Usar esta sugestão
                  </button>
                )}
              </div>
              {isLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{aiSuggestion}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="plan-details" className="block text-sm font-medium mb-1">Detalhes do Plano</label>
            <textarea
              id="plan-details"
              value={planDetails}
              onChange={(e) => setPlanDetails(e.target.value)}
              placeholder={`Manualmente insira os detalhes do plano de ${typeInPortuguese.toLowerCase()} aqui...`}
              className="w-full h-48 bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-dark-bg/50 flex justify-end space-x-3 rounded-b-lg mt-auto">
          <button onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-light-text dark:text-dark-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
            Salvar Plano
          </button>
        </div>
      </div>
    </div>
  );
};
