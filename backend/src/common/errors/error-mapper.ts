import {
  BadRequestException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

type DbError = { code: string; message: string };

// OCP: adicione novos códigos aqui sem alterar a lógica de dispatch
const ERROR_MAP = new Map<string, (e: DbError) => HttpException>([
  ['23505', () => new BadRequestException('Este e-mail já está cadastrado.')],
]);

export class ErrorMapper {
  static toHttpException(error: DbError): HttpException {
    const factory = ERROR_MAP.get(error.code);
    return factory ? factory(error) : new InternalServerErrorException(error.message);
  }
}
