import { IsString, IsOptional } from 'class-validator';

export class MoveTaskDto {
  @IsString()
  targetColumnId: string;

  @IsOptional()
  @IsString()
  beforeTaskId?: string;

  @IsOptional()
  @IsString()
  afterTaskId?: string;
}
