import { IsEnum, IsString, IsUUID } from 'class-validator';

export class CreateHeaderComissionDto {
  @IsUUID()
  idPeriod: string;

  @IsString()
  description: string;
}

enum RoleComission {
  'REVIEWER' = 'REVIEWER',
  'COORDINATOR' = 'COORDINATOR',
}

export class CreateDetailComissionDto {
  @IsUUID()
  idComission: string;

  @IsUUID()
  idPerson: string;

  @IsEnum(RoleComission)
  roleComission: RoleComission;
}
