import { HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateHeaderComissionDto,
  CreateDetailComissionDto,
} from './dto/create-comission.dto';
import {
  UpdateHeaderComissionDto,
  UpdateDetailComissionDto,
} from './dto/update-comission.dto';
import { PrismaService } from '@/context/shared/providers/prisma.service';
import { ErrorHandlerService } from '@/context/shared/providers/errorHandler.service';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class ComissionService {
  constructor(
    private prisma: PrismaService,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  async createHeader(createHeaderComissionDto: CreateHeaderComissionDto) {
    try {
      const period = await this.prisma.period.findUnique({
        where: { id: createHeaderComissionDto.idPeriod, status: 'ACTIVE' },
      });

      if (!period) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontró el periodo activo.',
        );
      }

      await this.prisma.comission_header.create({
        data: {
          id: uuidV4(),
          id_period: createHeaderComissionDto.idPeriod,
          description: createHeaderComissionDto.description,
          status: 'ACTIVE',
        },
      });

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.CREATED,
        message: 'Comision creada exitosamente.',
        data: null,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al crear la comisión. Por favor, intente nuevamente.',
      );
    }
  }

  async findAllHeader() {
    try {
      const comissions = await this.prisma.comission_header.findMany({
        include: { period: true },
      });

      if (!comissions) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontraron comisiones.',
        );
      }

      const data = comissions.map((comission) => ({
        id: comission.id,
        period: comission.period.description,
        description: comission.description,
        status: comission.status,
      }));

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Comisiones obtenidas exitosamente.',
        data,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al obtener las comisiones. Por favor, intente nuevamente.',
      );
    }
  }

  async findOneHeader(id: string) {
    try {
      const comission = await this.prisma.comission_header.findUnique({
        where: { id },
        include: { period: true },
      });

      if (!comission) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontró la comisión.',
        );
      }

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Comisión obtenida exitosamente.',
        data: {
          id: comission?.id,
          period: comission?.period.description,
          description: comission?.description,
          status: comission?.status,
        },
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al obtener la comisión. Por favor, intente nuevamente.',
      );
    }
  }

  async updateHeader(
    id: string,
    updateHeaderComissionDto: UpdateHeaderComissionDto,
  ) {
    try {
      const comission = await this.prisma.comission_header.findUnique({
        where: { id },
      });

      if (!comission) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontró la comisión.',
        );
      }

      await this.prisma.comission_header.update({
        where: { id },
        data: {
          id_period: updateHeaderComissionDto.idPeriod,
          description: updateHeaderComissionDto.description,
          status: updateHeaderComissionDto.status,
        },
      });

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Comisión actualizada exitosamente.',
        data: null,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al actualizar la comisión. Por favor, intente nuevamente.',
      );
    }
  }

  async inactiveHeader(id: string) {
    try {
      await this.prisma.comission_header.update({
        where: { id },
        data: { status: 'INACTIVE' },
      });

      await this.prisma.comission_detail.updateMany({
        where: { id_comission: id },
        data: { status: 'INACTIVE' },
      });

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Comisión inactivada exitosamente.',
        data: null,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al inactivar la comisión. Por favor, intente nuevamente',
      );
    }
  }

  async createDetail(createDetailComissionDto: CreateDetailComissionDto) {
    try {
      const comission = await this.prisma.comission_header.findUnique({
        where: { id: createDetailComissionDto.idComission },
      });

      if (!comission) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontró la comisión.',
        );
      }

      const comisionDetails = await this.prisma.comission_detail.findFirst({
        where: {
          id_comission: createDetailComissionDto.idComission,
          id_person: createDetailComissionDto.idPerson,
          status: 'ACTIVE',
        },
      });

      if (comisionDetails) {
        this.errorHandlerService.handleThrow(
          HttpStatus.CONFLICT,
          `El profesor ya se encuentra asignado a la comisión: ${comission?.description}.`,
        );
      }

      await this.prisma.comission_detail.create({
        data: {
          id: uuidV4(),
          id_comission: createDetailComissionDto.idComission,
          id_person: createDetailComissionDto.idPerson,
          role_comission: createDetailComissionDto.roleComission,
          status: 'ACTIVE',
        },
      });

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.CREATED,
        message: 'Detalle de comisión creado exitosamente.',
        data: null,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al crear el detalle de la comisión. Por favor, intente nuevamente.',
      );
    }
  }

  async findDetail(idHeader: string) {
    try {
      const comissionDetail = await this.prisma.comission_detail.findMany({
        where: { id_comission: idHeader, status: 'ACTIVE' },
        select: {
          id: true,
          status: true,
          role_comission: true,
          person: { select: { id: true, name: true, faculty: true } },
        },
      });

      if (!comissionDetail) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontró el detalle de la comisión.',
        );
      }

      let data = [];

      for (const detail of comissionDetail) {
        data.push({
          id: detail.id,
          role_comission: detail.role_comission,
          id_person: detail.person.id,
          name: detail.person.name,
          faculty: detail.person.faculty,
          status: detail.status,
        });
      }

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Detalle de comisión obtenido exitosamente.',
        data,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al obtener el detalle de la comisión. Por favor, intente nuevamente.',
      );
    }
  }

  async updateDetail(
    id: string,
    updateDetailComissionDto: UpdateDetailComissionDto,
  ) {
    try {
      const comissionDetail = await this.prisma.comission_detail.findUnique({
        where: { id },
      });

      if (!comissionDetail) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontró el detalle de la comisión.',
        );
      }

      const inAnotherComission = await this.prisma.comission_detail.findFirst({
        where: {
          id_person: updateDetailComissionDto.idPerson,
          status: 'ACTIVE',
        },
        include: { comission: true },
      });

      if (inAnotherComission) {
        this.errorHandlerService.handleThrow(
          HttpStatus.CONFLICT,
          `El profesor ya se encuentra asignado a la comisión: ${inAnotherComission.comission.description}.`,
        );
      }

      await this.prisma.comission_detail.update({
        where: { id },
        data: {
          id_person: updateDetailComissionDto.idPerson,
          role_comission: updateDetailComissionDto.roleComission,
        },
      });
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al actualizar el detalle de la comisión. Por favor, intente nuevamente.',
      );
    }
  }

  async inactiveDetail(id: string) {
    try {
      const comissionDetail = await this.prisma.comission_detail.findUnique({
        where: { id },
      });

      if (!comissionDetail) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontró el detalle de la comisión.',
        );
      }

      await this.prisma.comission_detail.update({
        where: { id },
        data: { status: 'INACTIVE' },
      });

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Miembro de comisión inactivado exitosamente.',
        data: null,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al inactivar el detalle de la comisión. Por favor, intente nuevamente.',
      );
    }
  }

  async getTeachers() {
    try {
      const teachers = await this.prisma.person.findMany({
        where: { type: 'TEACHER', status: 'ACTIVE' },
        select: {
          id: true,
          document: true,
          name: true,
          faculty: true,
          status: true,
        },
      });

      if (!teachers) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontraron profesores.',
        );
      }

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Profesores obtenidos exitosamente.',
        data: teachers,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al obtener los profesores. Por favor, intente nuevamente.',
      );
    }
  }

  async getReviewersByDocument(document: string) {
    try {
      const detail = await this.prisma.comission_detail.findFirst({
        where: { person: { document }, status: 'ACTIVE' },
      });

      if (!detail) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontro al coordinador.',
        );
      }

      const reviwers = await this.prisma.comission_detail.findMany({
        where: {
          id_comission: detail?.id_comission,
          status: 'ACTIVE',
          role_comission: 'REVIEWER',
        },
        include: { person: true },
      });

      let data = [];

      for (const reviewer of reviwers) {
        data.push({
          id: reviewer.id,
          role_comission: reviewer.role_comission,
          id_person: reviewer.person.id,
          name: reviewer.person.name,
          faculty: reviewer.person.faculty,
          status: reviewer.status,
        });
      }

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Revisores obtenidos exitosamente.',
        data,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al obtener los revisores. Por favor, intente nuevamente.',
      );
    }
  }
}
