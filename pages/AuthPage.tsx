import React, { useState } from 'react';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import { ICONS } from '../constants';

interface AuthPageProps {
  onLoginSuccess: (token: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="dark bg-dark-bg min-h-screen flex flex-col justify-center items-center p-4">
      <div className="flex items-center mb-8">
        {ICONS.logo}
        <h1 className="text-4xl font-bold ml-3 text-dark-text">CapiFit</h1>
      </div>
      <div className="w-full max-w-md bg-dark-card rounded-xl shadow-lg p-8">
        {isLoginView ? (
          <>
            <LoginForm onLoginSuccess={onLoginSuccess} />
            <p className="mt-6 text-center text-sm text-gray-400">
              Não tem uma conta?{' '}
              <button onClick={() => setIsLoginView(false)} className="font-semibold text-primary hover:text-primary-light">
                Cadastre-se
              </button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm onRegisterSuccess={() => setIsLoginView(true)} />
            <p className="mt-6 text-center text-sm text-gray-400">
              Já tem uma conta?{' '}
              <button onClick={() => setIsLoginView(true)} className="font-semibold text-primary hover:text-primary-light">
                Faça login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};
