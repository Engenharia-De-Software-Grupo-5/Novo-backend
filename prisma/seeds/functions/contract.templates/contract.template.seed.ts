import { PrismaClient } from '@prisma/client';

export async function seedContractTemplates(
    prisma: PrismaClient,
) {

    const contractTemplateA = await prisma.contractTemplates.create({
        data: {
            name: 'Locação Padrão',
            description: 'Template de contrato de locação padrão',
            condominiumId: 'condominiumAId',
            template: `# CONTRATO DE LOCAÇÃO

                Locador: Proprietário do condomínio  
                Locatário: {{ tenant.name }}  
                CPF do Locatário: {{ tenant.cpf }}  
                Imóvel: {{ property.name }} - Unidade {{ property.unityNumber }}  
                Identificador do Imóvel: {{ property.identifier }}

                Início: {{ startDate }}  
                Término: {{ dueDate }}  
                Contrato: {{ contractUrl }}

                ---

                Cláusulas Básicas:  
                1. O locatário deve cuidar do imóvel.  
                2. O locador garante a posse do imóvel.  
                3. Pagamento conforme acordado entre as partes.  

                Assinaturas:  

                Locador: ____________  
                Locatário: ____________  

                Data: ___/___/____`,
        },
    });

    const contractTemplateB = await prisma.contractTemplates.create({
        data: {
            name: 'Prestação de Serviços Padrão',
            description: 'Template de contrato de prestação de serviços padrão',
            condominiumId: 'condominiumBId',
            template: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS

                Contratante: {{ tenant.name }}  
                CPF: {{ tenant.cpf }}  
                Email: {{ tenant.email }}  

                Prestador: Empresa do condomínio  
                Serviço: Serviço prestado no imóvel {{ property.name }} - Unidade {{ property.unityNumber }}  
                Início: {{ startDate }}  
                Término: {{ dueDate }}  
                Contrato: {{ contractUrl }}

                ---

                Cláusulas Básicas:  
                1. O prestador deve executar o serviço corretamente.  
                2. O contratante deve efetuar o pagamento conforme combinado.  
                3. O contrato pode ser rescindido por acordo ou descumprimento.  

                Assinaturas:  

                Contratante: ____________  
                Prestador: ____________  

                Data: ___/___/____
            `,
        },
    });

    return { contractTemplateA, contractTemplateB };

}