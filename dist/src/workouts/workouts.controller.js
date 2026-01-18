"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkoutsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const workouts_service_1 = require("./workouts.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let WorkoutsController = class WorkoutsController {
    workoutsService;
    constructor(workoutsService) {
        this.workoutsService = workoutsService;
    }
    async create(user, createWorkoutDto) {
        return this.workoutsService.create(user.id, createWorkoutDto);
    }
    async getExpiring(user, days) {
        const daysAhead = days ? parseInt(days, 10) : 7;
        return this.workoutsService.getExpiring(user.id, daysAhead);
    }
    async findAll(user, studentId) {
        if (user.role === client_1.UserRole.STUDENT) {
            return this.workoutsService.findAllForStudent(user.id);
        }
        return this.workoutsService.findAllForPersonal(user.id, studentId);
    }
    async findOne(user, id) {
        return this.workoutsService.findOne(id, user.id, user.role);
    }
    async update(user, id, updateWorkoutDto) {
        return this.workoutsService.update(user.id, id, updateWorkoutDto);
    }
    async markAsCompleted(user, id) {
        return this.workoutsService.markAsCompleted(id, user.id);
    }
    async remove(user, id) {
        return this.workoutsService.remove(user.id, id);
    }
};
exports.WorkoutsController = WorkoutsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateWorkoutDto]),
    __metadata("design:returntype", Promise)
], WorkoutsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('expiring'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('days')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkoutsController.prototype, "getExpiring", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkoutsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkoutsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateWorkoutDto]),
    __metadata("design:returntype", Promise)
], WorkoutsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.STUDENT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkoutsController.prototype, "markAsCompleted", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WorkoutsController.prototype, "remove", null);
exports.WorkoutsController = WorkoutsController = __decorate([
    (0, common_1.Controller)('workouts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [workouts_service_1.WorkoutsService])
], WorkoutsController);
//# sourceMappingURL=workouts.controller.js.map