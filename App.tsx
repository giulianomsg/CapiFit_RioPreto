import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Students } from './components/Students';
import { Workouts } from './components/Workouts';
import { DietPlans } from './components/DietPlans';
import { Messages } from './components/Messages';
import { Settings } from './components/Settings';
import type { Page, Student, WorkoutPlan, DietPlan } from './types';
import { ThemeContext } from './components/ThemeContext';
import { apiService } from './services/apiService';

const App: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [currentPage, setCurrentPage] = useState<Page>('Painel');
  const [isLoading, setIsLoading] = useState(true);
  
  // State management for all app data, fetched from backend
  const [students, setStudents] = useState<Student[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);

  // Load all data from backend on initial render
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await apiService.getAllData();
        setStudents(data.students);
        setWorkoutPlans(data.workoutPlans);
        setDietPlans(data.dietPlans);
      } catch (error) {
        console.error("Failed to fetch data from backend", error);
        // TODO: Mostrar um estado de erro para o usuário
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const oldTheme = theme === 'light' ? 'dark' : 'light';
    root.classList.remove(oldTheme);
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const themeContextValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  
  // --- Data Handling Functions ---
  const handleAddStudent = async (studentData: Omit<Student, 'id' | 'progressPhotos' | 'measurements'>) => {
    try {
      const newStudent = await apiService.addStudent(studentData);
      setStudents(prev => [...prev, newStudent]);
    } catch (error) {
      console.error("Failed to add student:", error);
    }
  };

  const handleAddWorkoutPlan = async (plan: { name: string; details: string }) => {
    try {
      const newPlan = await apiService.addWorkoutPlan(plan);
      setWorkoutPlans(prev => [...prev, newPlan]);
    } catch (error) {
      console.error("Failed to add workout plan:", error);
    }
  };
  
  const handleAddDietPlan = async (plan: { name: string; details: string }) => {
    try {
      const newPlan = await apiService.addDietPlan(plan);
      setDietPlans(prev => [...prev, newPlan]);
    } catch (error) {
      console.error("Failed to add diet plan:", error);
    }
  };

  const handleAssignWorkoutPlan = async (studentId: string, plan: { name: string; details: string }) => {
    try {
        const { updatedStudent, newPlan } = await apiService.assignWorkoutPlan(studentId, plan);
        setWorkoutPlans(prev => [...prev, newPlan]);
        setStudents(prev => prev.map(s => s.id === studentId ? updatedStudent : s));
    } catch (error) {
        console.error("Failed to assign workout plan:", error);
    }
  };

  const handleAssignDietPlan = async (studentId: string, plan: { name: string; details: string }) => {
    try {
        const { updatedStudent, newPlan } = await apiService.assignDietPlan(studentId, plan);
        setDietPlans(prev => [...prev, newPlan]);
        setStudents(prev => prev.map(s => s.id === studentId ? updatedStudent : s));
    } catch (error) {
        console.error("Failed to assign diet plan:", error);
    }
  };


  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-full"><p>Carregando dados...</p></div>;
    }

    switch (currentPage) {
      case 'Painel':
        return <Dashboard students={students} />;
      case 'Alunos':
        return <Students 
          students={students} 
          workoutPlans={workoutPlans}
          dietPlans={dietPlans}
          onAddStudent={handleAddStudent} 
          onAssignWorkoutPlan={handleAssignWorkoutPlan}
          onAssignDietPlan={handleAssignDietPlan}
          />;
      case 'Treinos':
        return <Workouts workoutPlans={workoutPlans} onAddPlan={handleAddWorkoutPlan} />;
      case 'Planos de Dieta':
        return <DietPlans dietPlans={dietPlans} onAddPlan={handleAddDietPlan} />;
      case 'Mensagens':
        return <Messages />;
      case 'Configurações':
        return <Settings />;
      default:
        return <Dashboard students={students} />;
    }
  };

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <div className="dark:bg-dark-bg bg-light-bg min-h-screen flex text-light-text dark:text-dark-text">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className="flex-1 flex flex-col">
          <Header currentPage={currentPage} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
