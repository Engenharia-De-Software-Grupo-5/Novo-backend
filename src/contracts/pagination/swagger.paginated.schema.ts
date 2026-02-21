import { getSchemaPath } from '@nestjs/swagger';

export function PaginatedResponseSchema(itemType: any) {
	return {
		allOf: [
			{ $ref: getSchemaPath(require('./paginated.result').PaginatedResult) },
			{
				properties: {
					items: {
						type: 'array',
						items: { $ref: getSchemaPath(itemType) },
					},
				},
			},
		],
	};
}
