import { Module } from '@nestjs/common';
import { TenantController } from 'src/controllers/tenants/tenant.controller';
import { TenantRepository } from 'src/repositories/tenants/tenant.repository';
import { TenantService } from 'src/services/tenants/tenant.service';

@Module({
  imports: [],
  controllers: [TenantController],
  providers: [TenantService, TenantRepository],
})
export class TenantModule {}