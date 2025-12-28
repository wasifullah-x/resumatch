import { IsEmail, IsString, MinLength, IsOptional, IsIn } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  @IsIn(['jobseeker', 'employer', 'admin'])
  role?: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  job_title?: string;

  @IsOptional()
  years_of_experience?: number;

  @IsOptional()
  @IsString()
  experience_level?: string;

  @IsOptional()
  @IsString()
  current_company?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  professional_summary?: string;

  @IsOptional()
  @IsString()
  linkedin_profile?: string;

  @IsOptional()
  @IsString()
  portfolio_website?: string;

  @IsOptional()
  skills?: any;

  @IsOptional()
  education?: any;

  @IsOptional()
  job_preferences?: any;
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}
