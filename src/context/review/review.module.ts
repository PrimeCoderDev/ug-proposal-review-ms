import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { PrismaService } from '@/context/shared/providers/prisma.service';
import { ErrorHandlerService } from '@/context/shared/providers/errorHandler.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, PrismaService, ErrorHandlerService],
})
export class ReviewModule {}
