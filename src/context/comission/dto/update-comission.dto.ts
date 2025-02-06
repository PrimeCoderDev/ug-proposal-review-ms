import { PartialType } from '@nestjs/mapped-types';
import {
  CreateHeaderComissionDto,
  CreateDetailComissionDto,
} from './create-comission.dto';
import { IsEnum } from 'class-validator';

enum Status {
  'ACTIVE' = 'ACTIVE',
  'INACTIVE' = 'INACTIVE',
}

export class UpdateHeaderComissionDto extends PartialType(
  CreateHeaderComissionDto,
) {
  @IsEnum(['ACTIVE', 'INACTIVE'])
  status: Status;
}
export class UpdateDetailComissionDto extends PartialType(
  CreateDetailComissionDto,
) {}
