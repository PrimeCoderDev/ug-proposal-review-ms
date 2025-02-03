import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto, LogoutDto } from './dto/auth.dto';
import { PrismaService } from '@/context/shared/providers/prisma.service';
import { PasswordService } from '@/context/shared/providers/password.service';
import { ErrorHandlerService } from '@/context/shared/providers/errorHandler.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const userData = await this.prisma.user.findFirst({
        where: { username: loginDto.username },
        include: { person: true, role: true },
      });

      if (!userData) {
        throw new HttpException(
          {
            token: null,
            status: 'error',
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'El usuario no existe.',
            data: null,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isPasswordValid = await this.passwordService.verifyPassword(
        loginDto.password,
        userData.password,
      );

      if (!isPasswordValid) {
        throw new HttpException(
          {
            token: null,
            status: 'error',
            statusCode: HttpStatus.UNAUTHORIZED,
            message: 'La contraseña es incorrecta.',
            data: null,
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      return {
        token: userData.id,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Inicio de sesión exitoso.',
        data: {
          document: userData.person.document,
          name: userData.person.name,
          email: userData.person.email,
        },
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error inesperado al intentar iniciar sesión. Por favor, inténtelo de nuevo más tarde.',
      );
    }
  }

  logout(logoutDto: LogoutDto) {
    return {
      token: null,
      status: 'success',
      statusCode: HttpStatus.OK,
      message: 'Inicio de sesión exitoso.',
      data: null,
    };
  }
}
