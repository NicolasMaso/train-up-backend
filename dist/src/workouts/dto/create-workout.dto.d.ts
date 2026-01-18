export declare class WorkoutExerciseDto {
    exerciseId: string;
    order: number;
    sets: number;
    reps: string;
    restSeconds?: number;
    weight?: string;
    notes?: string;
}
export declare class CreateWorkoutDto {
    name: string;
    description?: string;
    studentId: string;
    trainingPlanId?: string;
    exercises: WorkoutExerciseDto[];
}
