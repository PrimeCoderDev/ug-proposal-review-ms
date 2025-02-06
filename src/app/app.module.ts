import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '@/context/shared/logger/logger.module';
import { AuthModule } from '@/context/auth/auth.module';
import { MenuModule } from '@/context/menu/menu.module';
import { PeriodModule } from '@/context/period/period.module';
import { ProposalModule } from '@/context/proposal/proposal.module';
import { ComissionModule } from '@/context/comission/comission.module';
import { ReviewModule } from '@/context/review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule,
    AuthModule,
    MenuModule,
    PeriodModule,
    ProposalModule,
    ComissionModule,
    ReviewModule,
  ],
})
export class AppModule {}
