import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@/context/shared/logger/logger.module';
import { AuthModule } from '@/context/auth/auth.module';
import { MenuModule } from '@/context/menu/menu.module';
import { PeriodModule } from '@/context/period/period.module';
import { ProposalModule } from '@/context/proposal/proposal.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule,
    AuthModule,
    MenuModule,
    PeriodModule,
    ProposalModule,
  ],
})
export class AppModule {}
