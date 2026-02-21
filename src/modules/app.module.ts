import { Module } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { AppController } from 'src/controllers/app.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { PrismaDatabaseModule } from './database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MinioClientModule } from './tools/minio-client.module';
import { ContractTemplateModule } from './contract.templates/contract.template.module';
import { EmployeeModule } from './employee/employee.module';
import { CondominiumModule } from './condominium/condominium.module';
import { PropertyModule } from './condominium/property.module';
import { ExpenseModule } from './expense/expense.module';
import { TenantModule } from './tenant/tenant.module';
import { ContractModule } from './contract/contract.module';
import { ChargesModule } from './charge/charge.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaDatabaseModule,
    AuthModule,
    MinioClientModule,
    ContractTemplateModule,
    CondominiumModule,
    EmployeeModule,
    PropertyModule,
    ExpenseModule,
    ContractModule,
    TenantModule,
    ChargesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
