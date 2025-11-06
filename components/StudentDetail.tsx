
import React, { useState } from 'react';
import type { Student } from '../types';
import { MOCK_WORKOUT_PLANS, MOCK_DIET_PLANS, ICONS } from '../constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PlanCreator } from './PlanCreator';

type Tab = 'Profile' | 'Workout' | 'Diet' | 'Progress' | 'Chat';

interface StudentDetailProps {
  student: Student;
  onBack: () => void;
}

const TabButton: React.FC<{ label: Tab; activeTab: Tab; onClick: (tab: Tab) => void }> = ({ label, activeTab, onClick }) => (
    <button
        onClick={() => onClick(label)}
        className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
            activeTab === label 
            ? 'border-b-2 border-primary text-primary' 
            : 'text-gray-500 hover:text-primary dark:text-gray-400'
        }`}
    >
        {label}
    </button>
);

export const StudentDetail: React.FC<StudentDetailProps> = ({ student, onBack }) => {
    const [activeTab, setActiveTab] = useState<Tab>('Profile');
    const [isWorkoutModalOpen, setWorkoutModalOpen] = useState(false);
    const [isDietModalOpen, setDietModalOpen] = useState(false);

    const workoutPlan = MOCK_WORKOUT_PLANS.find(p => p.id === student.workoutPlanId);
    const dietPlan = MOCK_DIET_PLANS.find(p => p.id === student.dietPlanId);
    
    const renderContent = () => {
        switch (activeTab) {
            case 'Profile':
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Client Information</h3>
                        <p><strong>Email:</strong> {student.email}</p>
                        <p><strong>Plan:</strong> {student.plan}</p>
                        <p><strong>Status:</strong> {student.status}</p>
                    </div>
                );
            case 'Workout':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Workout Plan</h3>
                            <button onClick={() => setWorkoutModalOpen(true)} className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                                {workoutPlan ? 'Edit Plan' : '+ Assign Plan'}
                            </button>
                        </div>
                        {workoutPlan ? (
                            <div className="space-y-4">
                                {Object.entries(workoutPlan.days).map(([day, sets]) => (
                                    <div key={day}>
                                        <h4 className="font-bold text-lg mb-2">{day}</h4>
                                        <ul className="list-disc list-inside space-y-1">
                                            {sets.map((s, i) => <li key={i}>{s.exercise.name}: {s.sets} sets of {s.reps}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : <p>No workout plan assigned.</p>}
                    </div>
                );
             case 'Diet':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Diet Plan</h3>
                            <button onClick={() => setDietModalOpen(true)} className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
                                {dietPlan ? 'Edit Plan' : '+ Assign Plan'}
                            </button>
                        </div>
                        {dietPlan ? (
                             <div className="space-y-4">
                                {dietPlan.meals.map((meal, i) => (
                                    <div key={i} className="p-3 bg-light-bg dark:bg-dark-bg rounded-lg">
                                        <p className="font-bold">{meal.time} - {meal.name}</p>
                                        <p className="text-sm">{meal.description}</p>
                                    </div>
                                ))}
                            </div>
                        ) : <p>No diet plan assigned.</p>}
                    </div>
                );
            case 'Progress':
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Weight Progression</h3>
                        <div style={{ width: '100%', height: 300 }}>
                           <ResponsiveContainer>
                                <LineChart data={student.measurements} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2}/>
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                );
            default:
                return <div>Content for {activeTab}</div>;
        }
    };
    
    return (
        <div className="bg-light-card dark:bg-dark-card p-6 rounded-xl shadow-md">
            <button onClick={onBack} className="text-primary font-semibold mb-4">&larr; Back to all students</button>
            <div className="flex items-center space-x-4 mb-6">
                <img src={student.avatarUrl} alt={student.name} className="w-20 h-20 rounded-full object-cover"/>
                <div>
                    <h2 className="text-3xl font-bold">{student.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{student.email}</p>
                </div>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <nav className="-mb-px flex space-x-4">
                    {(['Profile', 'Workout', 'Diet', 'Progress', 'Chat'] as Tab[]).map(tab => (
                        <TabButton key={tab} label={tab} activeTab={activeTab} onClick={setActiveTab} />
                    ))}
                </nav>
            </div>
            
            <div>{renderContent()}</div>

            {isWorkoutModalOpen && <PlanCreator type="Workout" studentName={student.name} onClose={() => setWorkoutModalOpen(false)} />}
            {isDietModalOpen && <PlanCreator type="Diet" studentName={student.name} onClose={() => setDietModalOpen(false)} />}
        </div>
    );
};
