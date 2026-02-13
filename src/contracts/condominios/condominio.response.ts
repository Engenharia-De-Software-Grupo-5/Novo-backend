import { EnderecoResponse } from './endereco.response';
import { ImovelResponse } from './imovel.dto.response';

export class CondominioResponse {
  id: string;
  nome: string;
  descricao?: string;
  endereco: EnderecoResponse;
  imoveis: ImovelResponse[];
}
