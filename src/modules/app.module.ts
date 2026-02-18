import { Module } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { AppController } from 'src/controllers/app.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { PrismaDatabaseModule } from './database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MinioClientModule } from './tools/minio-client.module';
import { EmployeeModule } from './employee/employee.module';
import { CondominiumModule } from './condominium/condominium.module';
import { PropertyModule } from './condominium/property.module';
import { InvoiceModule} from './invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaDatabaseModule,
    AuthModule,
    MinioClientModule,
    CondominiumModule,
    EmployeeModule,
    PropertyModule,
    InvoiceModule,
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
export class AppModule {}
