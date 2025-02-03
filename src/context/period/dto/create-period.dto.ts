import { IsString, IsDateString } from 'class-validator';

export class CreatePeriodDto {
  @IsDateString()
  startDate: string;
  @IsDateString()
  endDate: string;
  @IsString()
  description: string;
}
