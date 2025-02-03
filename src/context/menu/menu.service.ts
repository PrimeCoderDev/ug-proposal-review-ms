import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '@/context/shared/providers/prisma.service';
import { ErrorHandlerService } from '@/context/shared/providers/errorHandler.service';

@Injectable()
export class MenuService {
  constructor(
    private prisma: PrismaService,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  async findAll(token: string) {
    try {
      if (!token || token === 'null') {
        this.errorHandlerService.handleThrow(
          HttpStatus.UNAUTHORIZED,
          'El usuario no está autenticado. Por favor, inicie sesión.',
        );
      }

      const user = await this.prisma.user.findFirst({
        where: { id: token },
        include: { role: { include: { menu: true } } },
      });

      if (!user) {
        this.errorHandlerService.handleThrow(
          HttpStatus.UNAUTHORIZED,
          'El usuario no existe.',
        );
      }

      let menus: any = [];

      if (user?.role.menu) {
        for (const item of user.role.menu) {
          const submenus = await this.prisma.submenu.findMany({
            where: { id_menu: item.id },
            select: { name: true, path: true, icon: true },
          });

          if (submenus) {
            menus.push({
              name: item.name,
              expanded: false,
              icon: item.icon,
              children: submenus,
            });
          }
        }
      }

      return {
        token: user?.id,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Menús obtenidos correctamente.',
        data: menus,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error inesperado al intentar obtener los menus. Por favor, inténtelo de nuevo más tarde.',
      );
    }
  }
}
