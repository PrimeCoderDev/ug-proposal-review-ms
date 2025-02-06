import { Module } from '@nestjs/common';
import { ComissionService } from './comission.service';
import { ComissionController } from './comission.controller';
import { PrismaService } from '@/context/shared/providers/prisma.service';
import { ErrorHandlerService } from '@/context/shared/providers/errorHandler.service';

@Module({
  controllers: [ComissionController],
  providers: [ComissionService, PrismaService, ErrorHandlerService],
})
export class ComissionModule {}
