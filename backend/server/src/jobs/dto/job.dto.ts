import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class SaveJobDto {
  @IsString()
  @IsNotEmpty()
  job_id: string;

  @IsNotEmpty()
  job_data: any;
}
