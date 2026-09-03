import { IsString, IsEmail, IsNotEmpty, IsIn } from 'class-validator';

export class AddMemberDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsIn(['OWNER', 'MEMBER'])
  role: string;
}
