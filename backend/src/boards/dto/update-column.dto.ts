import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateColumnDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}
