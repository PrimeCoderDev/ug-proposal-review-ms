import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ErrorHandlerService {
  constructor() {}

  handleCatch(error: any, message: string) {
    if (error instanceof HttpException) {
      throw error;
    } else {
      console.log(error);
      throw new HttpException(
        {
          token: null,
          status: 'error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            message ||
            'Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo más tarde.',
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  handleThrow(statusCode: HttpStatus, message: string) {
    throw new HttpException(
      {
        token: null,
        status: 'error',
        statusCode,
        message: message || 'Ha ocurrido un error inesperado.',
        data: null,
      },
      statusCode,
    );
  }
}
