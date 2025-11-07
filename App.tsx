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

const App: React.FC = () => {
  const [theme, setTheme] = useState('dark');
  const [currentPage, setCurrentPage] = useState<Page>('Painel');
  
  // State management for all app data
  const [students, setStudents] = useState<Student[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([]);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedStudents = localStorage.getItem('capifit_students');
      if (storedStudents) setStudents(JSON.parse(storedStudents));

      const storedWorkouts = localStorage.getItem('capifit_workouts');
      if (storedWorkouts) setWorkoutPlans(JSON.parse(storedWorkouts));

      const storedDiets = localStorage.getItem('capifit_diets');
      if (storedDiets) setDietPlans(JSON.parse(storedDiets));
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
    }
  }, []);

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('capifit_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('capifit_workouts', JSON.stringify(workoutPlans));
  }, [workoutPlans]);

  useEffect(() => {
    localStorage.setItem('capifit_diets', JSON.stringify(dietPlans));
  }, [dietPlans]);


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
  const handleAddStudent = (studentData: Omit<Student, 'id' | 'progressPhotos' | 'measurements'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `s_${Date.now()}`,
      progressPhotos: [],
      measurements: [{ date: new Date().toISOString().split('T')[0], weight: 0 }],
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const handleAddWorkoutPlan = (plan: { name: string; details: string }) => {
    const newPlan: WorkoutPlan = {
      id: `wp_${Date.now()}`,
      name: plan.name,
      details: plan.details,
    };
    setWorkoutPlans(prev => [...prev, newPlan]);
  };
  
  const handleAddDietPlan = (plan: { name: string; details: string }) => {
    const newPlan: DietPlan = {
      id: `dp_${Date.now()}`,
      name: plan.name,
      details: plan.details,
    };
    setDietPlans(prev => [...prev, newPlan]);
  };

  const handleAssignWorkoutPlan = (studentId: string, plan: { name: string; details: string }) => {
      const newPlan: WorkoutPlan = {
        id: `wp_${Date.now()}`,
        name: plan.name,
        details: plan.details,
      };
      // Add to global plans if it's a new unique plan, or just use an existing one
      setWorkoutPlans(prev => [...prev, newPlan]);
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, workoutPlanId: newPlan.id } : s));
  };

  const handleAssignDietPlan = (studentId: string, plan: { name: string; details: string }) => {
      const newPlan: DietPlan = {
        id: `dp_${Date.now()}`,
        name: plan.name,
        details: plan.details,
      };
      setDietPlans(prev => [...prev, newPlan]);
      setStudents(prev => prev.map(s => s.id === studentId ? { ...s, dietPlanId: newPlan.id } : s));
  };


  const renderContent = () => {
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
