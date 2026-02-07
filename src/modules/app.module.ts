import { Module } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { AppController } from 'src/controllers/app.controller';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';
import { PrismaDatabaseModule } from './database/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaDatabaseModule,
    AuthModule,
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
