import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, IsArray } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  company: string;

  @IsString()
  location: string;

  @IsString()
  type: string;

  @IsString()
  experience: string;

  @IsOptional()
  @IsInt()
  salary_min?: number;

  @IsOptional()
  @IsInt()
  salary_max?: number;

  @IsString()
  @IsOptional()
  salary_currency?: string;

  @IsString()
  description: string;

  @IsArray()
  requirements: string[];

  @IsArray()
  application_steps: string[];

  @IsArray()
  skills: string[];

  @IsArray()
  @IsOptional()
  benefits?: string[];

  @IsBoolean()
  @IsOptional()
  remote?: boolean;

  @IsString()
  industry: string;
}

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  experience?: string;

  @IsOptional()
  @IsInt()
  salary_min?: number;

  @IsOptional()
  @IsInt()
  salary_max?: number;

  @IsString()
  @IsOptional()
  salary_currency?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  requirements?: string[];

  @IsArray()
  @IsOptional()
  application_steps?: string[];

  @IsArray()
  @IsOptional()
  skills?: string[];

  @IsArray()
  @IsOptional()
  benefits?: string[];

  @IsBoolean()
  @IsOptional()
  remote?: boolean;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  status?: string;
}

export class SaveJobDto {
  @IsString()
  @IsNotEmpty()
  job_id: string;

  @IsNotEmpty()
  job_data: any;
}

