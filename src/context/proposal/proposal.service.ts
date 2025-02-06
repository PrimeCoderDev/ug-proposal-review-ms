import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/context/shared/providers/prisma.service';
import { ErrorHandlerService } from '@/context/shared/providers/errorHandler.service';
import { v4 as uuidV4 } from 'uuid';
import { ProcessFileDto } from './dto/process-file.dto';
import { UpdateProposalDto } from './dto/update-proposal.dto';
import fs from 'fs-extra';
import path from 'path';
import * as csv from 'fast-csv';

@Injectable()
export class ProposalService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private errorHandlerService: ErrorHandlerService,
  ) {}

  private readonly filesPath =
    this.configService.get<string>('FILES_PATH') ?? '';

  async findAll(periodId: string) {
    try {
      const proposals = await this.prisma.proposal_header.findMany({
        where: { id_period: periodId },
        include: { proposal_detail: { include: { person: true } } },
      });

      if (!proposals) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontraron propuestas.',
        );
      }

      const data = [];

      for (const proposal of proposals) {
        data.push({
          id: proposal.id,
          document: proposal.proposal_detail
            .filter((detail) => detail.principal)
            .map((detail) => detail.person.document)[0],
          name: proposal.proposal_detail
            .filter((detail) => detail.principal)
            .map((detail) => detail.person.name)[0],
          option: proposal.option,
          category: proposal.category,
          statusApplication: proposal.statusApplication,
          practicesValidities: proposal.practicesValidities,
          viculationValidities: proposal.viculationValidities,
        });
      }

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Propuestas obtenidas exitosamente.',
        data,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Hubo un error al obtener las propuestas. Intente mas tarde.',
      );
    }
  }

  async update(id: string, updateProposalDto: UpdateProposalDto) {
    try {
      const proposal = await this.prisma.proposal_header.findUnique({
        where: { id },
      });

      if (!proposal) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontró la propuesta.',
        );
      }

      const proposalDetail = await this.prisma.proposal_detail.findFirst({
        where: { id_proposal: id, principal: false },
      });

      console.log(proposalDetail);

      if (proposalDetail === null) {
        await this.prisma.proposal_detail.create({
          data: {
            id: uuidV4(),
            id_proposal: id,
            id_person: updateProposalDto.id_person,
            principal: false,
            status: 'ACTIVE',
          },
        });
      } else {
        await this.prisma.proposal_detail.update({
          where: { id: proposalDetail?.id },
          data: {
            id_person: updateProposalDto.id_person,
          },
        });
      }

      await this.prisma.proposal_header.update({
        where: { id },
        data: {
          title: updateProposalDto.title,
          modality: updateProposalDto.modality,
          research_line: updateProposalDto.research_line,
          research_subline: updateProposalDto.research_subline,
        },
      });

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Propuesta actualizada exitosamente.',
        data: null,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Hubo un error al actualizar la propuesta. Intente mas tarde.',
      );
    }
  }

  async findDetail(id: string) {
    try {
      const detail = await this.prisma.proposal_detail.findMany({
        where: { id_proposal: id },
        include: { person: true, proposal: true },
      });

      if (!detail) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontraron detalles de la propuesta.',
        );
      }

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Detalle de la propuesta obtenido exitosamente.',
        data: {
          proposal: detail.map((detail) => detail.proposal)[0],
          principal: detail
            .filter((detail) => detail.principal)
            .map((detail) => detail.person)[0],
          partner:
            detail
              .filter((detail) => !detail.principal)
              .map((detail) => detail.person)[0] ?? null,
        },
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Hubo un error al obtener el detalle de la propuesta. Intente mas tarde.',
      );
    }
  }

  async updateDetail(id: string) {
    try {
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Hubo un error al actualizar el detalle de la propuesta. Intente mas tarde.',
      );
    }
  }

  async findAllFile() {
    try {
      if (this.filesPath === '') {
        this.errorHandlerService.handleThrow(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Ha ocurrido un error al leer la ruta de los archivos. Contacte al administrador.',
        );
      }

      const files = await fs.readdir(this.filesPath);

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Archivos obtenidos exitosamente.',
        data: files.filter((file) => file.endsWith('.csv')),
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Hubo un error al obtener los archivos. Intente mas tarde.',
      );
    }
  }

  async processFile(processFileDto: ProcessFileDto) {
    try {
      if (this.filesPath === '') {
        this.errorHandlerService.handleThrow(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Ha ocurrido un error al leer la ruta de los archivos. Contacte al administrador.',
        );
      }

      const filePath = path.join(this.filesPath, processFileDto.filename);
      const records: any[] = [];

      await new Promise<void>((resolve, reject) => {
        const stream = fs.createReadStream(filePath);

        stream
          .pipe(csv.parse({ headers: false }))
          .on('data', (row) => {
            records.push(row);
          })
          .on('end', resolve)
          .on('error', reject);
      });

      const period = await this.prisma.period.findUnique({
        where: { id: processFileDto.periodId },
      });

      if (!period) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontró el periodo.',
        );
      }

      for (const record of records) {
        const person = await this.prisma.person.findUnique({
          where: { document: record[0] },
        });

        if (!person) {
          this.errorHandlerService.handleThrow(
            HttpStatus.NOT_FOUND,
            'Hubo un error al procesar el archivo. Datos inconsistentes.',
          );
        }

        const idProposal = uuidV4();

        await this.prisma.proposal_header.create({
          data: {
            id: idProposal,
            id_period: processFileDto.periodId,
            option: String(record[2]) ?? '',
            category: String(record[3]) ?? '',
            statusApplication:
              record[4] === 'PENDIENTE'
                ? 'PENDING'
                : record[4] === 'APROBADO'
                  ? 'APPROVED'
                  : record[4] === 'RECHAZADO'
                    ? 'REJECTED'
                    : 'PENDING',
            practicesValidities: String(record[5]) ?? '0',
            viculationValidities: String(record[6]) ?? '0',
            status: 'ACTIVE',
          },
        });

        await this.prisma.proposal_detail.create({
          data: {
            id: uuidV4(),
            id_proposal: idProposal,
            id_person: person?.id ?? '',
            principal: true,
            status: 'ACTIVE',
          },
        });
      }

      await this.prisma.period.update({
        where: { id: processFileDto.periodId },
        data: { available_load: false },
      });

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Propuestas procesadas exitosamente.',
        data: null,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Hubo un error al realizar la carga de las propuestas. Intente más tarde.',
      );
    }
  }

  async findPartner(document: string) {
    try {
      const partner = await this.prisma.person.findUnique({
        where: { document },
      });

      if (!partner) {
        this.errorHandlerService.handleThrow(
          HttpStatus.NOT_FOUND,
          'No se encontró el estudiante par.',
        );
      }

      return {
        token: null,
        status: 'success',
        statusCode: HttpStatus.OK,
        message: 'Estudiante par encontrado exitosamente.',
        data: partner,
      };
    } catch (error) {
      this.errorHandlerService.handleCatch(
        error,
        'Hubo un error al obtener el estudiante par. Intente mas tarde.',
      );
    }
  }
}
