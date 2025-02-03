import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { PrismaService } from '../shared/providers/prisma.service';
import { ErrorHandlerService } from '../shared/providers/errorHandler.service';

@Module({
  controllers: [MenuController],
  providers: [MenuService, PrismaService, ErrorHandlerService],
})
export class MenuModule {}
