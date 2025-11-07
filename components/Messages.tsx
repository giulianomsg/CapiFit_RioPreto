import React from 'react';

export const Messages: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Mensagens</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">Funcionalidade de chat em desenvolvimento.</p>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">Em breve, você poderá se comunicar com seus alunos em tempo real por aqui, enviando mensagens, fotos e áudios.</p>
    </div>
  );
};
