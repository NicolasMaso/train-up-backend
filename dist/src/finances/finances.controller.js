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
exports.FinancesController = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const finances_service_1 = require("./finances.service");
const dto_1 = require("./dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
let FinancesController = class FinancesController {
    financesService;
    constructor(financesService) {
        this.financesService = financesService;
    }
    async createPayment(user, createPaymentDto) {
        return this.financesService.createPayment(user.id, createPaymentDto);
    }
    async findAllPayments(user, studentId, status) {
        if (user.role === client_1.UserRole.STUDENT) {
            return this.financesService.findAllForStudent(user.id);
        }
        return this.financesService.findAllForPersonal(user.id, studentId, status);
    }
    async getFinancialSummary(user) {
        return this.financesService.getFinancialSummary(user.id);
    }
    async findOne(user, id) {
        return this.financesService.findOne(id, user.id, user.role);
    }
    async updatePayment(user, id, updatePaymentDto) {
        return this.financesService.update(user.id, id, updatePaymentDto);
    }
    async markAsPaid(user, id) {
        return this.financesService.markAsPaid(id, user.id, user.role);
    }
    async removePayment(user, id) {
        return this.financesService.remove(user.id, id);
    }
};
exports.FinancesController = FinancesController;
__decorate([
    (0, common_1.Post)('payments'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], FinancesController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Get)('payments'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('studentId')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], FinancesController.prototype, "findAllPayments", null);
__decorate([
    (0, common_1.Get)('summary'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FinancesController.prototype, "getFinancialSummary", null);
__decorate([
    (0, common_1.Get)('payments/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FinancesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('payments/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdatePaymentDto]),
    __metadata("design:returntype", Promise)
], FinancesController.prototype, "updatePayment", null);
__decorate([
    (0, common_1.Patch)('payments/:id/pay'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FinancesController.prototype, "markAsPaid", null);
__decorate([
    (0, common_1.Delete)('payments/:id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FinancesController.prototype, "removePayment", null);
exports.FinancesController = FinancesController = __decorate([
    (0, common_1.Controller)('finances'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [finances_service_1.FinancesService])
], FinancesController);
//# sourceMappingURL=finances.controller.js.map