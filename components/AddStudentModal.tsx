import React, { useState } from 'react';
import type { Student } from '../types';

interface AddStudentModalProps {
  onAddStudent: (studentData: Omit<Student, 'id' | 'progressPhotos' | 'measurements'>) => void;
  onClose: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ onAddStudent, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('Premium Monthly');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Nome e Email são obrigatórios.');
      return;
    }

    onAddStudent({
      name,
      email,
      plan,
      status,
      avatarUrl: `https://picsum.photos/seed/${name.replace(/\s+/g, '')}/200/200`,
      lastActive: 'agora mesmo',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-xl w-full max-w-lg m-4">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-2xl font-bold">Adicionar Novo Aluno</h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="student-name" className="block text-sm font-medium mb-1">Nome Completo</label>
              <input
                id="student-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Jane Doe"
                className="w-full bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="student-email" className="block text-sm font-medium mb-1">Email</label>
              <input
                id="student-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: jane.doe@example.com"
                className="w-full bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div>
                <label htmlFor="student-plan" className="block text-sm font-medium mb-1">Plano de Assinatura</label>
                <select 
                    id="student-plan" 
                    value={plan} 
                    onChange={(e) => setPlan(e.target.value)}
                    className="w-full bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="Premium Monthly">Premium Mensal</option>
                    <option value="Basic Yearly">Básico Anual</option>
                    <option value="Trial">Teste</option>
                </select>
            </div>
             <div>
                <label htmlFor="student-status" className="block text-sm font-medium mb-1">Status</label>
                <select 
                    id="student-status" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                    className="w-full bg-light-bg dark:bg-dark-bg border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="Active">Ativo</option>
                    <option value="Inactive">Inativo</option>
                </select>
            </div>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-dark-bg/50 flex justify-end space-x-3 rounded-b-lg">
            <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-light-text dark:text-dark-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              Cancelar
            </button>
            <button type="submit" className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
              Adicionar Aluno
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
