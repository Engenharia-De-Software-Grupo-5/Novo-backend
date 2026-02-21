import { PaginationDto } from './pagination.dto';

interface FilterOptions {
  numberFields?: string[];
  dateFields?: string[];
  enumFields?: string[];
  booleanFields?: string[];
  customMappings?: Record<string, (content: string) => any>;
}

// Regex para validar se uma string é um UUID v4
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Função auxiliar para converter strings variadas em booleano
 * Aceita: true, verdadeiro, sim (e variações de case)
 */
function parseBoolean(value: string): boolean | null {
  if (!value) return null;

  const normalized = value.trim().toLowerCase();

  // Lista de valores considerados TRUE
  const trueValues = ['true', 'verdadeiro', 'sim', '1', 'v', 's'];

  // Lista de valores considerados FALSE (inclui 'não' com e sem acento)
  const falseValues = ['false', 'falso', 'nao', 'não', '0', 'f', 'n'];

  if (trueValues.includes(normalized)) return true;
  if (falseValues.includes(normalized)) return false;

  return null; // Não conseguiu identificar como booleano
}

export function buildDynamicWhere(
  dto: PaginationDto,
  fixedWhere: any = {},
  options: FilterOptions = {},
) {
  const where = { ...fixedWhere };
  const { columnName = [], content = [] } = dto;

  // Se não houver filtros, retorna o fixedWhere
  if (columnName.length === 0 || content.length === 0) return where;

  // Itera com base no menor array para evitar erros caso os tamanhos sejam diferentes
  const limit = Math.min(columnName.length, content.length);

  for (let i = 0; i < limit; i++) {
    const col = columnName[i];
    const val = content[i];

    // Ignora se coluna ou valor estiverem vazios nesse índice
    if (!col || val === undefined || val === '') continue;

    // 2. FILTRO CUSTOMIZADO
    if (options.customMappings && options.customMappings[col]) {
      const customFilter = options.customMappings[col](val);
      Object.assign(where, customFilter);
      continue;
    }

    // === 3. DETECÇÃO AUTOMÁTICA DE UUID ===
    const isUuidField = col.endsWith('Id') || col === 'id';
    if (isUuidField) {
      if (UUID_REGEX.test(val)) {
        where[col] = { equals: val };
      }
      continue; // Ignora se não for UUID válido, pula pro próximo
    }

    // 4. ENUMS
    if (options.enumFields?.includes(col)) {
      const enumValue = val.toUpperCase();
      where[col] = { equals: enumValue };
      continue;
    }

    // 5. BOOLEANOS (NOVO)
    if (options.booleanFields?.includes(col)) {
      const boolValue = parseBoolean(val);
      if (boolValue !== null) {
        where[col] = { equals: boolValue };
      }
      continue;
    }

    // 6. NÚMEROS
    if (options.numberFields?.includes(col)) {
      const numValue = Number(val);
      if (!isNaN(numValue)) where[col] = { equals: numValue };
      continue;
    }

    // 7. DATAS
    if (options.dateFields?.includes(col)) {
      const dateValue = new Date(val);
      if (!isNaN(dateValue.getTime())) {
        const startOfDay = new Date(dateValue.setHours(0, 0, 0, 0));
        const endOfDay = new Date(dateValue.setHours(23, 59, 59, 999));
        where[col] = { gte: startOfDay, lte: endOfDay };
      }
      continue;
    }

    // 8. PADRÃO (STRINGS)
    where[col] = { contains: val, mode: 'insensitive' };
  }

  return where;
}
