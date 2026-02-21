"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedResponseSchema = PaginatedResponseSchema;
const swagger_1 = require("@nestjs/swagger");
function PaginatedResponseSchema(itemType) {
    return {
        allOf: [
            { $ref: (0, swagger_1.getSchemaPath)(require('./paginated.result').PaginatedResult) },
            {
                properties: {
                    items: {
                        type: 'array',
                        items: { $ref: (0, swagger_1.getSchemaPath)(itemType) },
                    },
                },
            },
        ],
    };
}
//# sourceMappingURL=swagger.paginated.schema.js.map