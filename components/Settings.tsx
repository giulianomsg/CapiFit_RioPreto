import React from 'react';

export const Settings: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Configurações</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md">Página de configurações em desenvolvimento.</p>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">Aqui você poderá gerenciar seu perfil profissional, detalhes de pagamento, assinaturas e outras preferências da plataforma.</p>
    </div>
  );
};
