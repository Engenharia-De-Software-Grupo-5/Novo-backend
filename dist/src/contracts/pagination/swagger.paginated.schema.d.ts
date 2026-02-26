export declare function PaginatedResponseSchema(itemType: any): {
    allOf: ({
        $ref: string;
        properties?: undefined;
    } | {
        properties: {
            items: {
                type: string;
                items: {
                    $ref: string;
                };
            };
        };
        $ref?: undefined;
    })[];
};
