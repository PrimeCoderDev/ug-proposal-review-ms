import { IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  idComissionMember: string;
  @IsUUID()
  idProposal: string;
}
