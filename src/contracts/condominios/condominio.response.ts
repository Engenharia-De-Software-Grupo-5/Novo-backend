import { EnderecoResponse } from './endereco.response';

export class CondominioResponse {
  id: string;
  nome: string;
  descricao?: string;
  endereco: EnderecoResponse;
}
