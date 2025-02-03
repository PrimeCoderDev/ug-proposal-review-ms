import { IsString, IsUUID } from 'class-validator';

export class ProcessFileDto {
  @IsString()
  filename: string;
  @IsUUID()
  periodId: string;
}
