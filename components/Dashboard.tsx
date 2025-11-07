import React from 'react';
import type { Student } from '../types';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-md flex items-center space-x-4">
    <div className="bg-primary/10 text-primary p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-light-text dark:text-dark-text">{value}</p>
    </div>
  </div>
);

interface DashboardProps {
  students: Student[];
}

export const Dashboard: React.FC<DashboardProps> = ({ students }) => {
    const activeStudents = students.filter(s => s.status === 'Active').length;
    
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bem-vindo ao CapiFit, Treinador!</h1>
        <p className="text-gray-500 dark:text-gray-400">Aqui está um resumo da sua atividade.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Alunos Ativos" value={activeStudents.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard title="Planos Atribuídos" value={students.filter(s => s.workoutPlanId || s.dietPlanId).length.toString()} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} />
        <StatCard title="Mensagens Pendentes" value="0" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
      </div>

      <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-4">Alunos Ativos Recentemente</h3>
        {students.length > 0 ? (
          <div className="space-y-4">
            {students.slice(0, 3).map(student => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-light-bg dark:bg-dark-bg rounded-lg">
                <div className="flex items-center space-x-4">
                  <img src={student.avatarUrl} alt={student.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-light-text dark:text-dark-text">{student.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{student.lastActive}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Nenhum aluno cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
};
