"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildDynamicWhere = buildDynamicWhere;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function parseBoolean(value) {
    if (!value)
        return null;
    const normalized = value.trim().toLowerCase();
    const trueValues = ['true', 'verdadeiro', 'sim', '1', 'v', 's'];
    const falseValues = ['false', 'falso', 'nao', 'não', '0', 'f', 'n'];
    if (trueValues.includes(normalized))
        return true;
    if (falseValues.includes(normalized))
        return false;
    return null;
}
function buildDynamicWhere(dto, fixedWhere = {}, options = {}) {
    const where = { ...fixedWhere };
    const { columnName = [], content = [] } = dto;
    if (columnName.length === 0 || content.length === 0)
        return where;
    const limit = Math.min(columnName.length, content.length);
    for (let i = 0; i < limit; i++) {
        const col = columnName[i];
        const val = content[i];
        if (!col || val === undefined || val === '')
            continue;
        if (options.customMappings && options.customMappings[col]) {
            const customFilter = options.customMappings[col](val);
            Object.assign(where, customFilter);
            continue;
        }
        const isUuidField = col.endsWith('Id') || col === 'id';
        if (isUuidField) {
            if (UUID_REGEX.test(val)) {
                where[col] = { equals: val };
            }
            continue;
        }
        if (options.enumFields?.includes(col)) {
            const enumValue = val.toUpperCase();
            where[col] = { equals: enumValue };
            continue;
        }
        if (options.booleanFields?.includes(col)) {
            const boolValue = parseBoolean(val);
            if (boolValue !== null) {
                where[col] = { equals: boolValue };
            }
            continue;
        }
        if (options.numberFields?.includes(col)) {
            const numValue = Number(val);
            if (!isNaN(numValue))
                where[col] = { equals: numValue };
            continue;
        }
        if (options.dateFields?.includes(col)) {
            const dateValue = new Date(val);
            if (!isNaN(dateValue.getTime())) {
                const startOfDay = new Date(dateValue.setHours(0, 0, 0, 0));
                const endOfDay = new Date(dateValue.setHours(23, 59, 59, 999));
                where[col] = { gte: startOfDay, lte: endOfDay };
            }
            continue;
        }
        where[col] = { contains: val, mode: 'insensitive' };
    }
    return where;
}
//# sourceMappingURL=prisma.utils.js.map