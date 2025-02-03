import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
}

export class LogoutDto {
  username: string;
}
