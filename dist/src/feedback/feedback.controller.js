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
exports.FeedbackController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const feedback_service_1 = require("./feedback.service");
const dto_1 = require("./dto");
let FeedbackController = class FeedbackController {
    feedbackService;
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
    }
    create(req, createFeedbackDto) {
        return this.feedbackService.create(req.user.sub, createFeedbackDto);
    }
    findAll(req, status) {
        const feedbackStatus = status === 'RESOLVED'
            ? client_1.FeedbackStatus.RESOLVED
            : status === 'OPEN'
                ? client_1.FeedbackStatus.OPEN
                : undefined;
        if (req.user.role === client_1.UserRole.PERSONAL) {
            return this.feedbackService.findAllByPersonal(req.user.sub, feedbackStatus);
        }
        return this.feedbackService.findAllByStudent(req.user.sub);
    }
    findOne(req, id) {
        return this.feedbackService.findOne(id, req.user.sub, req.user.role);
    }
    addResponse(req, id, createResponseDto) {
        return this.feedbackService.addResponse(id, req.user.sub, createResponseDto);
    }
    resolve(req, id) {
        return this.feedbackService.resolve(id, req.user.sub);
    }
    reopen(req, id) {
        return this.feedbackService.reopen(id, req.user.sub);
    }
};
exports.FeedbackController = FeedbackController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(client_1.UserRole.STUDENT),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateFeedbackDto]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/response'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.CreateResponseDto]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "addResponse", null);
__decorate([
    (0, common_1.Patch)(':id/resolve'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "resolve", null);
__decorate([
    (0, common_1.Patch)(':id/reopen'),
    (0, roles_decorator_1.Roles)(client_1.UserRole.PERSONAL),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FeedbackController.prototype, "reopen", null);
exports.FeedbackController = FeedbackController = __decorate([
    (0, common_1.Controller)('feedback'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [feedback_service_1.FeedbackService])
], FeedbackController);
//# sourceMappingURL=feedback.controller.js.map