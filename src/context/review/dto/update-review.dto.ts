import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { IsString, IsEnum } from 'class-validator';

enum StatusApplication {
  'PENDING' = 'PENDING',
  'APPROVED' = 'APPROVED',
  'REJECTED' = 'REJECTED',
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @IsString()
  comment: string;

  @IsEnum(StatusApplication)
  statusApplication: StatusApplication;
}
