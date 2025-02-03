import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePeriodDto } from './dto/create-period.dto';
import { UpdatePeriodDto } from './dto/update-period.dto';
import { PrismaService } from '@/context/shared/providers/prisma.service';
import { ErrorHandlerService } from '@/context/shared/providers/errorHandler.service';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class PeriodService {
  constructor(
    private prisma: PrismaService,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  async create(createPeriodDto: CreatePeriodDto) {
    try {
      const periodActive = await this.prisma.period.findFirst({
        where: { status: 'ACTIVE' },
      });

      if (periodActive) {
        this.errorHandlerService.handleThrow(
          HttpStatus.CONFLICT,
          'Ya existe un periodo activo.',
        );
      }
      await this.prisma.period.create({
        data: {
          id: uuidV4(),
          start_date: createPeriodDto.startDate,
          end_date: createPeriodDto.endDate,
          description: createPeriodDto.description,
          available_load: true,
          status: 'ACTIVE',
        },
      });

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.CREATED,
        message: 'Periodo creado exitosamente.',
        data: null,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Hubo un error al crear el periodo. Intente mas tarde.',
      );
    }
  }

  async findAll() {
    try {
      const periods = await this.prisma.period.findMany({
        select: {
          id: true,
          start_date: true,
          end_date: true,
          description: true,
          status: true,
          available_load: true,
        },
      });

      if (!periods) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontraron periodos.',
        );
      }

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Periodos obtenidos exitosamente.',
        data: periods,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Hubo un error al obtener los periodos. Intente mas tarde.',
      );
    }
  }

  async findOne(id: string) {
    try {
      const period = await this.prisma.period.findUnique({
        where: { id },
        select: {
          id: true,
          start_date: true,
          end_date: true,
          description: true,
          status: true,
        },
      });

      if (!period) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontró el periodo.',
        );
      }

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Periodo obtenido exitosamente.',
        data: period,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Hubo un error al obtener el periodo. Intente mas tarde.',
      );
    }
  }

  async update(id: string, updatePeriodDto: UpdatePeriodDto) {
    try {
      const period = await this.prisma.period.findUnique({
        where: { id },
      });

      if (!period) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontró el periodo.',
        );
      }

      await this.prisma.period.update({
        where: { id },
        data: {
          start_date: updatePeriodDto.startDate,
          end_date: updatePeriodDto.endDate,
          description: updatePeriodDto.description,
          status: updatePeriodDto.status,
        },
      });

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Periodo actualizado exitosamente.',
        data: null,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Hubo un error al actualizar el periodo. Intente mas tarde.',
      );
    }
  }

  async remove(id: string) {
    try {
      const period = await this.prisma.period.findUnique({
        where: { id },
      });

      if (!period) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontró el periodo.',
        );
      }

      await this.prisma.period.delete({ where: { id } });

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Periodo eliminado exitosamente.',
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Hubo un error al eliminar el periodo. Intente mas tarde.',
      );
    }
  }
}
