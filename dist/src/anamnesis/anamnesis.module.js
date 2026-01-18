"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnamnesisModule = void 0;
const common_1 = require("@nestjs/common");
const anamnesis_service_1 = require("./anamnesis.service");
const anamnesis_controller_1 = require("./anamnesis.controller");
const students_module_1 = require("../students/students.module");
let AnamnesisModule = class AnamnesisModule {
};
exports.AnamnesisModule = AnamnesisModule;
exports.AnamnesisModule = AnamnesisModule = __decorate([
    (0, common_1.Module)({
        imports: [students_module_1.StudentsModule],
        controllers: [anamnesis_controller_1.AnamnesisController],
        providers: [anamnesis_service_1.AnamnesisService],
        exports: [anamnesis_service_1.AnamnesisService],
    })
], AnamnesisModule);
//# sourceMappingURL=anamnesis.module.js.map