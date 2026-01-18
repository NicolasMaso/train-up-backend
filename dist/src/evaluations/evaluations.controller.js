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
exports.EvaluationsController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const evaluations_service_1 = require("./evaluations.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let EvaluationsController = class EvaluationsController {
    evaluationsService;
    constructor(evaluationsService) {
        this.evaluationsService = evaluationsService;
    }
    async create(user, createEvaluationDto) {
        return this.evaluationsService.create(user.id, createEvaluationDto);
    }
    async findAllByStudent(user, studentId) {
        const targetStudentId = user.role === client_1.UserRole.STUDENT ? user.id : studentId;
        return this.evaluationsService.findAllByStudent(targetStudentId, user.id, user.role);
    }
    async getProgress(user, studentId) {
        const targetStudentId = user.role === client_1.UserRole.STUDENT ? user.id : studentId;
        return this.evaluationsService.getProgress(targetStudentId, user.id, user.role);
    }
    async findOne(user, id) {
        return this.evaluationsService.findOne(id, user.id, user.role);
    }
    async update(user, id, updateEvaluationDto) {
        return this.evaluationsService.update(user.id, id, updateEvaluationDto);
    }
    async remove(user, id) {
        return this.evaluationsService.remove(user.id, id);
    }
};
exports.EvaluationsController = EvaluationsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateEvaluationDto]),
    __metadata("design:returntype", Promise)
], EvaluationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EvaluationsController.prototype, "findAllByStudent", null);
__decorate([
    (0, common_1.Get)('progress'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EvaluationsController.prototype, "getProgress", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EvaluationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateEvaluationDto]),
    __metadata("design:returntype", Promise)
], EvaluationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EvaluationsController.prototype, "remove", null);
exports.EvaluationsController = EvaluationsController = __decorate([
    (0, common_1.Controller)('evaluations'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [evaluations_service_1.EvaluationsService])
], EvaluationsController);
//# sourceMappingURL=evaluations.controller.js.map