import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../shared/providers/prisma.service';
import { PasswordService } from '../shared/providers/password.service';
import { ErrorHandlerService } from '../shared/providers/errorHandler.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, PasswordService, ErrorHandlerService],
})
export class AuthModule {}
