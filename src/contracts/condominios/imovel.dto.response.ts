import { SituacaoImovel, TipoUnidade } from "@prisma/client";

export class ImovelResponse {
    id: string
    identificador: string;
    endereco: string;
    numeroUnidade: string;
    tipoUnidade: TipoUnidade;
    bloco?: string;
    andar?: number;
    areaTotal?: number;
    situacaoImovel: SituacaoImovel;
    observacoes?: string;
}