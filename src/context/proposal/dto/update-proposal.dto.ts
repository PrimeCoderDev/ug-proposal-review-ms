import { IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProposalDto {
  @IsString()
  title: string;
  @IsString()
  modality: string;
  @IsString()
  research_line: string;
  @IsString()
  research_subline: string;
  @IsUUID()
  id_proposal: string;
  @IsUUID()
  id_person: string;
}
