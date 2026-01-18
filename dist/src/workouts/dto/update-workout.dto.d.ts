import { WorkoutExerciseDto } from './create-workout.dto';
export declare class UpdateWorkoutDto {
    name?: string;
    description?: string;
    scheduledDate?: string;
    exercises?: WorkoutExerciseDto[];
}
