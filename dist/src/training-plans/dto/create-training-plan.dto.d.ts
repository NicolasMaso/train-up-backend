declare class WorkoutExerciseDto {
    exerciseId: string;
    order: number;
    sets: number;
    reps: string;
    restSeconds?: number;
    weight?: string;
    notes?: string;
}
declare class WorkoutDto {
    name: string;
    description?: string;
    exercises: WorkoutExerciseDto[];
}
export declare class CreateTrainingPlanDto {
    name: string;
    description?: string;
    studentId: string;
    startDate: string;
    endDate: string;
    workouts: WorkoutDto[];
}
export {};
