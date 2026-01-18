import { UserRole } from '@prisma/client';
import { AnamnesisService } from './anamnesis.service';
import { CreateAnamnesisDto, UpdateAnamnesisDto } from './dto';
export declare class AnamnesisController {
    private readonly anamnesisService;
    constructor(anamnesisService: AnamnesisService);
    create(user: {
        id: string;
    }, createAnamnesisDto: CreateAnamnesisDto): Promise<{
        student: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        studentId: string;
        medicalConditions: string | null;
        medications: string | null;
        allergies: string | null;
        previousInjuries: string | null;
        surgeries: string | null;
        occupation: string | null;
        sleepHours: number | null;
        stressLevel: number | null;
        smokingHabit: boolean;
        alcoholConsumption: string | null;
        mainGoal: string | null;
        secondaryGoals: string | null;
        exerciseExperience: string | null;
        currentActivityLevel: string | null;
        dietaryRestrictions: string | null;
        mealsPerDay: number | null;
        waterIntakeLiters: number | null;
    }>;
    findAllByStudent(user: {
        id: string;
        role: UserRole;
    }, studentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        studentId: string;
        medicalConditions: string | null;
        medications: string | null;
        allergies: string | null;
        previousInjuries: string | null;
        surgeries: string | null;
        occupation: string | null;
        sleepHours: number | null;
        stressLevel: number | null;
        smokingHabit: boolean;
        alcoholConsumption: string | null;
        mainGoal: string | null;
        secondaryGoals: string | null;
        exerciseExperience: string | null;
        currentActivityLevel: string | null;
        dietaryRestrictions: string | null;
        mealsPerDay: number | null;
        waterIntakeLiters: number | null;
    }[]>;
    findOne(user: {
        id: string;
        role: UserRole;
    }, id: string): Promise<{
        student: {
            id: string;
            name: string;
            email: string;
            personalId: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        studentId: string;
        medicalConditions: string | null;
        medications: string | null;
        allergies: string | null;
        previousInjuries: string | null;
        surgeries: string | null;
        occupation: string | null;
        sleepHours: number | null;
        stressLevel: number | null;
        smokingHabit: boolean;
        alcoholConsumption: string | null;
        mainGoal: string | null;
        secondaryGoals: string | null;
        exerciseExperience: string | null;
        currentActivityLevel: string | null;
        dietaryRestrictions: string | null;
        mealsPerDay: number | null;
        waterIntakeLiters: number | null;
    }>;
    update(user: {
        id: string;
    }, id: string, updateAnamnesisDto: UpdateAnamnesisDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        notes: string | null;
        studentId: string;
        medicalConditions: string | null;
        medications: string | null;
        allergies: string | null;
        previousInjuries: string | null;
        surgeries: string | null;
        occupation: string | null;
        sleepHours: number | null;
        stressLevel: number | null;
        smokingHabit: boolean;
        alcoholConsumption: string | null;
        mainGoal: string | null;
        secondaryGoals: string | null;
        exerciseExperience: string | null;
        currentActivityLevel: string | null;
        dietaryRestrictions: string | null;
        mealsPerDay: number | null;
        waterIntakeLiters: number | null;
    }>;
    remove(user: {
        id: string;
    }, id: string): Promise<{
        message: string;
    }>;
}
