
import React, { useState } from 'react';
import { MOCK_STUDENTS } from '../constants';
import type { Student } from '../types';
import { StudentDetail } from './StudentDetail';

const StudentCard: React.FC<{ student: Student; onSelect: (student: Student) => void }> = ({ student, onSelect }) => (
  <div
    className="bg-light-card dark:bg-dark-card p-4 rounded-xl shadow-md flex flex-col items-center text-center cursor-pointer transform hover:scale-105 transition-transform duration-200"
    onClick={() => onSelect(student)}
  >
    <img src={student.avatarUrl} alt={student.name} className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-primary/20" />
    <h3 className="font-bold text-lg text-light-text dark:text-dark-text">{student.name}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">{student.plan}</p>
    <span
      className={`mt-2 px-3 py-1 text-xs font-semibold rounded-full ${
        student.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      }`}
    >
      {student.status}
    </span>
  </div>
);

export const Students: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  if (selectedStudent) {
    return <StudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Students</h2>
        <button className="bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors">
          + Add Student
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {MOCK_STUDENTS.map(student => (
          <StudentCard key={student.id} student={student} onSelect={setSelectedStudent} />
        ))}
      </div>
    </div>
  );
};
