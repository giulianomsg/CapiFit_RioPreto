import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Students } from './components/Students';
import { Workouts } from './components/Workouts';
import { DietPlans } from './components/DietPlans';
import { Messages } from './components/Messages';
import { Settings } from './components/Settings';
import { ThemeContext } from './components/ThemeContext';
import { apiService } from './services/apiService';
import type { Page, Student, WorkoutPlan, DietPlan } from './types';

interface DashboardLayoutProps {
  onLogout: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const [theme, setTheme] = useState('dark');
  const [currentPage, setCurrentPage] = useState<Page>('Painel');
  const [students, setStudents] = useState<Student[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [studentsData, workoutsData, dietsData] = await Promise.all([
        apiService.getStudents(),
        apiService.getWorkoutPlans(),
        apiService.getDietPlans()
      ]);
      setStudents(studentsData);
      setWorkoutPlans(workoutsData);
      setDietPlans(dietsData);
    } catch (err: any) {
      setError(err.message || 'Falha ao carregar dados. Tente novamente mais tarde.');
      if (err.message.includes('401') || err.message.includes('403')) {
        onLogout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    fetchData();
  }, [fetchData]);

  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'progressPhotos' | 'measurements'>) => {
    try {
        await apiService.addStudent(studentData);
        fetchData(); // Recarrega todos os dados
    } catch (err: any) {
        alert(`Erro ao adicionar aluno: ${err.message}`);
    }
  };

  const handleAddWorkoutPlan = async (plan: { name: string; details: string }) => {
      try {
        const newPlan = await apiService.addWorkoutPlan(plan);
        setWorkoutPlans(prev => [...prev, newPlan]);
      } catch (err: any) {
         alert(`Erro ao adicionar plano de treino: ${err.message}`);
      }
  };

  const handleAddDietPlan = async (plan: { name: string; details: string }) => {
      try {
        const newPlan = await apiService.addDietPlan(plan);
        setDietPlans(prev => [...prev, newPlan]);
      } catch (err: any) {
         alert(`Erro ao adicionar plano de dieta: ${err.message}`);
      }
  };

  const handleAssignWorkoutPlan = async (studentId: string, plan: { name: string; details: string }) => {
     try {
        // Primeiro, verifica se um plano com este nome já existe. Se não, cria um novo.
        let planToAssign = workoutPlans.find(p => p.name.toLowerCase() === plan.name.toLowerCase());
        if (!planToAssign) {
            planToAssign = await apiService.addWorkoutPlan(plan);
            setWorkoutPlans(prev => [...prev, planToAssign!]);
        }
        await apiService.assignWorkoutPlanToStudent(studentId, planToAssign!.id);
        fetchData(); // Recarrega para refletir a atribuição
     } catch (err: any) {
         alert(`Erro ao atribuir plano de treino: ${err.message}`);
     }
  };

  const handleAssignDietPlan = async (studentId: string, plan: { name: string; details: string }) => {
      try {
        let planToAssign = dietPlans.find(p => p.name.toLowerCase() === plan.name.toLowerCase());
        if (!planToAssign) {
            planToAssign = await apiService.addDietPlan(plan);
            setDietPlans(prev => [...prev, planToAssign!]);
        }
        await apiService.assignDietPlanToStudent(studentId, planToAssign!.id);
        fetchData();
     } catch (err: any) {
         alert(`Erro ao atribuir plano de dieta: ${err.message}`);
     }
  };

  const renderCurrentPage = () => {
    if (isLoading) return <div className="flex justify-center items-center h-full"><p>Carregando dados...</p></div>;
    if (error) return <div className="flex justify-center items-center h-full"><p className="text-red-500">{error}</p></div>;

    switch (currentPage) {
      case 'Painel': return <Dashboard students={students} />;
      case 'Alunos': return <Students 
                                students={students} 
                                workoutPlans={workoutPlans}
                                dietPlans={dietPlans}
                                onAddStudent={handleAddStudent}
                                onAssignWorkoutPlan={handleAssignWorkoutPlan}
                                onAssignDietPlan={handleAssignDietPlan}
                             />;
      case 'Treinos': return <Workouts workoutPlans={workoutPlans} onAddPlan={handleAddWorkoutPlan} />;
      case 'Planos de Dieta': return <DietPlans dietPlans={dietPlans} onAddPlan={handleAddDietPlan} />;
      case 'Mensagens': return <Messages />;
      case 'Configurações': return <Settings />;
      default: return <Dashboard students={students} />;
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`${theme} bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text min-h-screen flex`}>
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 flex flex-col">
          <Header currentPage={currentPage} onLogout={onLogout} />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {renderCurrentPage()}
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};
