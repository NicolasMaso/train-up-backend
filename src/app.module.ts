import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { PrismaModule } from './prisma';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StudentsModule } from './students/students.module';
import { ExercisesModule } from './exercises/exercises.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { TrainingPlansModule } from './training-plans/training-plans.module';
import { AnamnesisModule } from './anamnesis/anamnesis.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { FinancesModule } from './finances/finances.module';
import { FeedbackModule } from './feedback';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    ExercisesModule,
    WorkoutsModule,
    TrainingPlansModule,
    AnamnesisModule,
    EvaluationsModule,
    FinancesModule,
    FeedbackModule,
  ],
  providers: [
    // Global JWT auth guard
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
