import React, { useState } from 'react';
import { ICONS } from '../constants';
import type { DietPlan } from '../types';
import { PlanCreator } from './PlanCreator';


const PlanCard: React.FC<{ name: string; description: string }> = ({ name, description }) => (
  <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-md cursor-pointer transform hover:scale-105 transition-transform duration-200">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-lg text-light-text dark:text-dark-text">{name}</h3>
      <div className="text-primary">{ICONS.diet}</div>
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

interface DietPlansProps {
    dietPlans: DietPlan[];
    onAddPlan: (plan: { name: string; details: string }) => void;
}

export const DietPlans: React.FC<DietPlansProps> = ({ dietPlans, onAddPlan }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSavePlan = (plan: { name: string; details: string }) => {
    onAddPlan(plan);
    setModalOpen(false);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Modelos de Dieta</h2>
        <button onClick={() => setModalOpen(true)} className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
          + Criar Novo Plano
        </button>
      </div>

      {dietPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dietPlans.map(plan => (
            <PlanCard key={plan.id} name={plan.name} description={plan.details?.substring(0, 100) + '...' || 'Plano personalizado.'} />
          ))}
        </div>
      ) : (
         <div className="text-center py-12 bg-light-card dark:bg-dark-card rounded-xl">
            <h3 className="text-xl font-semibold">Nenhum modelo de dieta encontrado</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Crie modelos de dieta para reutilizar com seus alunos.</p>
        </div>
      )}

      {isModalOpen && <PlanCreator type="Diet" onClose={() => setModalOpen(false)} onSave={handleSavePlan} />}
    </div>
  );
};
