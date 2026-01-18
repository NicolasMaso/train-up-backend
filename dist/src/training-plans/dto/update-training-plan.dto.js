"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTrainingPlanDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_training_plan_dto_1 = require("./create-training-plan.dto");
class UpdateTrainingPlanDto extends (0, mapped_types_1.PartialType)(create_training_plan_dto_1.CreateTrainingPlanDto) {
}
exports.UpdateTrainingPlanDto = UpdateTrainingPlanDto;
//# sourceMappingURL=update-training-plan.dto.js.map