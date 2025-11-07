import React, { useState } from 'react';
import { apiService } from '../services/apiService';

interface RegisterFormProps {
  onRegisterSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      await apiService.register({ name, email, password, role: 'trainer' });
      setSuccess('Cadastro realizado com sucesso! Você já pode fazer o login.');
      setTimeout(() => {
        onRegisterSuccess();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Falha no cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-dark-text mb-6">Crie sua Conta de Treinador</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name-register" className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
          <input
            id="name-register"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-dark-bg border border-gray-600 rounded-lg p-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="email-register" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            id="email-register"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-dark-bg border border-gray-600 rounded-lg p-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label htmlFor="password-register" className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
          <input
            id="password-register"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-dark-bg border border-gray-600 rounded-lg p-3 text-dark-text focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Cadastrando...' : 'Criar Conta'}
        </button>
      </form>
    </div>
  );
};
