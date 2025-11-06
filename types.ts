
export type Page = 'Dashboard' | 'Students' | 'Workouts' | 'Diet Plans' | 'Messages' | 'Settings';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  videoUrl?: string;
}

export interface WorkoutSet {
  sets: number;
  reps: string;
  rest: string; // e.g., "60s"
  exercise: Exercise;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  days: {
    [day: string]: WorkoutSet[]; // e.g., "Monday", "Tuesday"
  };
}

export interface Meal {
  name: string;
  time: string; // e.g., "08:00"
  description: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface DietPlan {
  id: string;
  name: string;
  meals: Meal[];
}

export interface ProgressPhoto {
  id: string;
  date: string;
  url: string;
}

export interface Measurement {
  date: string; // YYYY-MM-DD
  weight: number; // in kg
  bodyFat?: number; // percentage
  chest?: number; // in cm
  waist?: number; // in cm
  hips?: number; // in cm
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  plan: string; // e.g., "Premium Monthly"
  status: 'Active' | 'Inactive';
  lastActive: string;
  workoutPlanId?: string;
  dietPlanId?: string;
  progressPhotos: ProgressPhoto[];
  measurements: Measurement[];
}
