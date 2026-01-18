"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const prisma_1 = require("./prisma");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const students_module_1 = require("./students/students.module");
const exercises_module_1 = require("./exercises/exercises.module");
const workouts_module_1 = require("./workouts/workouts.module");
const anamnesis_module_1 = require("./anamnesis/anamnesis.module");
const evaluations_module_1 = require("./evaluations/evaluations.module");
const finances_module_1 = require("./finances/finances.module");
const feedback_1 = require("./feedback");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            students_module_1.StudentsModule,
            exercises_module_1.ExercisesModule,
            workouts_module_1.WorkoutsModule,
            anamnesis_module_1.AnamnesisModule,
            evaluations_module_1.EvaluationsModule,
            finances_module_1.FinancesModule,
            feedback_1.FeedbackModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map