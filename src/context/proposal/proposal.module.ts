import { Module } from '@nestjs/common';
import { ProposalService } from './proposal.service';
import { ProposalController } from './proposal.controller';
import { PrismaService } from '@/context/shared/providers/prisma.service';
import { ErrorHandlerService } from '@/context/shared/providers/errorHandler.service';

@Module({
  controllers: [ProposalController],
  providers: [ProposalService, PrismaService, ErrorHandlerService],
})
export class ProposalModule {}
