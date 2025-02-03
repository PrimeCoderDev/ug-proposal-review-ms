import { Module } from '@nestjs/common';
import { PeriodService } from './period.service';
import { PeriodController } from './period.controller';
import { PrismaService } from '../shared/providers/prisma.service';
import { ErrorHandlerService } from '../shared/providers/errorHandler.service';

@Module({
  controllers: [PeriodController],
  providers: [PeriodService, PrismaService, ErrorHandlerService],
})
export class PeriodModule {}
