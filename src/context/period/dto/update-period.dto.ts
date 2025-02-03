import { PartialType } from '@nestjs/mapped-types';
import { CreatePeriodDto } from './create-period.dto';
import { IsEnum } from 'class-validator';

enum Status {
  'ACTIVE' = 'ACTIVE',
  'INACTIVE' = 'INACTIVE',
}
export class UpdatePeriodDto extends PartialType(CreatePeriodDto) {
  @IsEnum(Status)
  status: Status;
}
