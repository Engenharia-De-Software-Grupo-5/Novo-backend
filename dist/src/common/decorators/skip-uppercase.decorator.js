"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipUppercase = void 0;
require("reflect-metadata");
const SkipUppercase = () => {
    return (target, propertyKey) => {
        Reflect.defineMetadata('skipUppercase', true, target, propertyKey);
    };
};
exports.SkipUppercase = SkipUppercase;
//# sourceMappingURL=skip-uppercase.decorator.js.map