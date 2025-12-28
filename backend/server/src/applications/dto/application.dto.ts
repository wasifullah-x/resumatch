import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  job_id: string;

  @IsString()
  @IsNotEmpty()
  job_title: string;

  @IsString()
  @IsNotEmpty()
  company_name: string;

  @IsOptional()
  @IsString()
  job_location?: string;

  @IsOptional()
  @IsString()
  job_type?: string;

  @IsOptional()
  job_data?: any;

  @IsOptional()
  @IsString()
  cover_letter?: string;

  @IsOptional()
  @IsString()
  applied_via?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateApplicationDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
