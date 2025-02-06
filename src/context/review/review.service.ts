import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '@/context/shared/providers/prisma.service';
import { ErrorHandlerService } from '@/context/shared/providers/errorHandler.service';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class ReviewService {
  constructor(
    private prisma: PrismaService,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      const comisionDetail = await this.prisma.comission_detail.findFirst({
        where: {
          id: createReviewDto.idComissionMember,
        },
      });

      if (!comisionDetail) {
        throw this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se ha encontrado el miembro de la comisión.',
        );
      }

      const proposal = await this.prisma.proposal_header.findFirst({
        where: {
          id: createReviewDto.idProposal,
        },
      });

      if (!proposal) {
        throw this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se ha encontrado la propuesta.',
        );
      }

      const review = await this.prisma.review.findFirst({
        where: {
          id_proposal: createReviewDto.idProposal,
        },
      });

      if (review) {
        throw this.errorHandlerService.handleThrow(
          HttpStatus.BAD_REQUEST,
          'Ya existe una revisión para esta propuesta.',
        );
      }

      await this.prisma.review.create({
        data: {
          id: uuidV4(),
          id_comision_member: createReviewDto.idComissionMember,
          id_proposal: createReviewDto.idProposal,
          comment: '',
          status: 'ACTIVE',
        },
      });

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.CREATED,
        message: 'Revisión creada exitosamente.',
        data: null,
      };
    } catch (error) {
      throw this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al crear la revisión. Por favor, inténtelo de nuevo.',
      );
    }
  }

  async findAll() {
    try {
      const reviews = await this.prisma.review.findMany();

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Revisión obtenida exitosamente.',
        data: reviews,
      };
    } catch (error) {
      throw this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al obtener las revisiones. Por favor, inténtelo de nuevo.',
      );
    }
  }

  async findOne(id: string) {
    try {
      const review = await this.prisma.review.findFirst({
        where: {
          id: id,
        },
      });

      if (!review) {
        throw this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se ha encontrado la revisión.',
        );
      }

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Revisión obtenida exitosamente.',
        data: review,
      };
    } catch (error) {
      throw this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al obtener la revisión. Por favor, inténtelo de nuevo.',
      );
    }
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    try {
      const review = await this.prisma.review.findFirst({
        where: {
          id: id,
        },
      });

      if (!review) {
        throw this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se ha encontrado la revisión.',
        );
      }

      await this.prisma.review.update({
        where: {
          id: id,
        },
        data: {
          id_comision_member: updateReviewDto.idComissionMember,
          id_proposal: updateReviewDto.idProposal,
          comment: updateReviewDto.comment,
        },
      });

      const proposal = await this.prisma.proposal_header.findFirst({
        where: {
          id: updateReviewDto.idProposal,
        },
      });

      if (!proposal) {
        throw this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se ha encontrado la propuesta.',
        );
      }

      await this.prisma.proposal_header.update({
        where: {
          id: updateReviewDto.idProposal,
        },
        data: {
          statusApplication: updateReviewDto.statusApplication,
        },
      });

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Revisión actualizada exitosamente.',
        data: null,
      };
    } catch (error) {
      throw this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al actualizar la revisión. Por favor, inténtelo de nuevo.',
      );
    }
  }

  async remove(id: string) {
    try {
      const review = await this.prisma.review.findFirst({
        where: {
          id: id,
        },
      });

      if (!review) {
        throw this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se ha encontrado la revisión.',
        );
      }

      await this.prisma.review.delete({
        where: {
          id: id,
        },
      });

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Revisión eliminada exitosamente.',
        data: null,
      };
    } catch (error) {
      throw this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al eliminar la revisión. Por favor, inténtelo de nuevo.',
      );
    }
  }

  async getReviewsByMember(idComissionMember: string) {
    try {
      const reviews = await this.prisma.review.findMany({
        where: {
          id_comision_member: idComissionMember,
        },
      });

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Revisiones obtenida exitosamente.',
        data: reviews,
      };
    } catch (error) {
      throw this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al obtener las revisiones. Por favor, inténtelo de nuevo.',
      );
    }
  }

  async getReviewsByDocument(document: string) {
    try {
      const reviews = await this.prisma.review.findMany({
        where: {
          comission: {
            person: {
              document: document,
            },
          },
        },
        include: { proposal: true },
      });

      if (!reviews) {
        return {
          token: null,
          status: 'success',
          statusCode: HttpStatus.OK,
          message: 'No se han encontrado revisiones.',
          data: [],
        };
      }

      let data = [];

      for (const review of reviews) {
        data.push({
          idReview: review.id,
          id_comision_member: review.id_comision_member,
          ...review.proposal,
        });
      }

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Revisiones obtenida exitosamente.',
        data,
      };
    } catch (error) {
      throw this.errorHandlerService.handleCatch(
        error,
        'Ha ocurrido un error al obtener las revisiones. Por favor, inténtelo de nuevo.',
      );
    }
  }
}
