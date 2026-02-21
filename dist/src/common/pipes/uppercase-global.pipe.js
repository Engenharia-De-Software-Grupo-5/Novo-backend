"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UppercaseGlobalPipe = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
let UppercaseGlobalPipe = class UppercaseGlobalPipe {
    transform(value, metadata) {
        if (!(value && typeof value === 'object'))
            return value;
        const prototype = (metadata.metatype || {}).prototype;
        for (const key of Object.keys(value)) {
            const skip = Reflect.getMetadata('skipUppercase', prototype, key);
            if (skip)
                continue;
            if ((0, class_validator_1.isUUID)(value[key]))
                continue;
            const propertyType = Reflect.getMetadata('design:type', prototype, key);
            if (propertyType !== String)
                continue;
            if (typeof value[key] === 'string')
                value[key] = value[key].toUpperCase();
        }
        return value;
    }
};
exports.UppercaseGlobalPipe = UppercaseGlobalPipe;
exports.UppercaseGlobalPipe = UppercaseGlobalPipe = __decorate([
    (0, common_1.Injectable)()
], UppercaseGlobalPipe);
//# sourceMappingURL=uppercase-global.pipe.js.map