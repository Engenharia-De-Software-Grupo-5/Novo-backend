"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedContractTemplates = seedContractTemplates;
async function seedContractTemplates(prisma) {
    const contractTemplate1 = await prisma.contractTemplates.create({
        data: {
            name: 'Contrato de Locação Residencial 2026',
            description: 'Modelo padrão para locação de imóvel residencial',
            template: `
                    CONTRATO DE LOCAÇÃO

                    Locador: ¿locador_nome?
                    CPF/CNPJ: ¿locador_documento?

                    Locatário: ¿locatario_nome?
                    CPF: ¿locatario_documento?

                    Imóvel: ¿endereco_imovel?

                    Valor do aluguel: R$ ¿valor_aluguel?
                    Data de início: ¿data_inicio?
                    Prazo: ¿prazo_meses? meses

                    Assinatura do Locador: _______________________
                    Assinatura do Locatário: _______________________
                    `
        },
    });
    const contractTemplate2 = await prisma.contractTemplates.create({
        data: {
            name: 'Contrato de Prestação de Serviços 2026',
            description: 'Modelo padrão para contratação de serviços profissionais',
            template: `
                    CONTRATO DE PRESTAÇÃO DE SERVIÇOS

                    Contratante: ¿contratante_nome?
                    CPF/CNPJ: ¿contratante_documento?

                    Contratado: ¿contratado_nome?
                    CPF/CNPJ: ¿contratado_documento?

                    Serviço: ¿descricao_servico?
                    Valor total: R$ ¿valor_total?
                    Prazo de execução: ¿prazo_dias? dias

                    Data da assinatura: ¿data_assinatura?

                    Assinatura do Contratante: _______________________
                    Assinatura do Contratado: _______________________
                    `
        },
    });
    return { contractTemplate1, contractTemplate2 };
}
//# sourceMappingURL=contract.template.seed.js.map