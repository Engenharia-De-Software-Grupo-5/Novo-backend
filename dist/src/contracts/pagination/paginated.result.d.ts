export declare class PaginatedResult<T> {
    static of<T>(itemType: new () => T): new () => PaginatedResult<T>;
    items: T[];
    meta: {
        totalItems: number;
        totalPages: number;
        page: number;
        limit: number;
    };
}
