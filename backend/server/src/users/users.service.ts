import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, phone, location, role } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        location,
        role: role || 'jobseeker', // Default to jobseeker if not specified
      },
    });

    // Generate token
    const token = this.generateToken(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, token };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, token };
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        location: true,
        profile_picture_url: true,
        job_title: true,
        years_of_experience: true,
        experience_level: true,
        current_company: true,
        industry: true,
        professional_summary: true,
        linkedin_profile: true,
        portfolio_website: true,
        skills: true,
        education: true,
        job_preferences: true,
        resume_url: true,
        resume_filename: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto, profilePicture?: string) {
    const updateData: any = { ...updateProfileDto };

    if (profilePicture) {
      updateData.profile_picture_url = profilePicture;
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        location: true,
        profile_picture_url: true,
        job_title: true,
        years_of_experience: true,
        experience_level: true,
        current_company: true,
        industry: true,
        professional_summary: true,
        linkedin_profile: true,
        portfolio_website: true,
        skills: true,
        education: true,
        job_preferences: true,
        resume_url: true,
        resume_filename: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return user;
  }

  async uploadResume(userId: number, filename: string, skills: string[]) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        resume_url: `uploads/resumes/${filename}`,
        resume_filename: filename,
        skills: {
          primary: skills,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        location: true,
        profile_picture_url: true,
        job_title: true,
        years_of_experience: true,
        experience_level: true,
        current_company: true,
        industry: true,
        professional_summary: true,
        linkedin_profile: true,
        portfolio_website: true,
        skills: true,
        education: true,
        job_preferences: true,
        resume_url: true,
        resume_filename: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    return user;
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async deleteAccount(userId: number) {
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'Account deleted successfully' };
  }

  async getCandidates(filters: { location?: string; experience?: string; search?: string }) {
    const where: any = { 
      role: 'jobseeker',
      resume_url: { not: null }, // Only users with uploaded resumes
    };

    if (filters.location && filters.location !== 'all') {
      where.location = {
        contains: filters.location,
        mode: 'insensitive',
      };
    }

    if (filters.experience && filters.experience !== 'all') {
      where.experience_level = {
        contains: filters.experience,
        mode: 'insensitive',
      };
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { job_title: { contains: filters.search, mode: 'insensitive' } },
        { professional_summary: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const candidates = await this.prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        location: true,
        job_title: true,
        years_of_experience: true,
        experience_level: true,
        current_company: true,
        industry: true,
        professional_summary: true,
        skills: true,
        resume_url: true,
        profile_picture_url: true,
        linkedin_profile: true,
        portfolio_website: true,
      },
      orderBy: { created_at: 'desc' },
    });

    return candidates;
  }

  async getEmployerStats(employerId: number) {
    // Get total jobs posted by employer
    const totalJobs = await this.prisma.job.count({
      where: { 
        employer_id: employerId,
        status: { not: 'deleted' },
      },
    });

    // Get active jobs
    const activeJobs = await this.prisma.job.count({
      where: { 
        employer_id: employerId,
        status: 'active',
      },
    });

    // Get total applications across all employer's jobs
    const jobs = await this.prisma.job.findMany({
      where: { 
        employer_id: employerId,
        status: { not: 'deleted' },
      },
      select: {
        id: true,
        views: true,
      },
    });

    const jobIds = jobs.map(job => job.id);
    
    const totalApplications = await this.prisma.application.count({
      where: {
        job_id: { in: jobIds },
      },
    });

    // Get total views
    const totalViews = jobs.reduce((sum, job) => sum + job.views, 0);

    // Get pending applications
    const pendingApplications = await this.prisma.application.count({
      where: {
        job_id: { in: jobIds },
        status: 'pending',
      },
    });

    return {
      totalJobs,
      activeJobs,
      totalApplications,
      totalViews,
      pendingApplications,
    };
  }

  async getEmployerApplications(employerId: number) {
    // Get all jobs by employer
    const jobs = await this.prisma.job.findMany({
      where: { 
        employer_id: employerId,
        status: { not: 'deleted' },
      },
      select: {
        id: true,
        title: true,
        company: true,
      },
    });

    const jobIds = jobs.map(job => job.id);

    // Get applications for those jobs
    const applications = await this.prisma.application.findMany({
      where: {
        job_id: { in: jobIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            resume_url: true,
            profile_picture_url: true,
          },
        },
      },
      orderBy: { applied_at: 'desc' },
    });

    return applications.map(app => ({
      id: app.id,
      jobId: app.job_id,
      jobTitle: app.job_title,
      company: app.company_name,
      applicant: {
        id: app.user.id,
        name: app.user.name,
        email: app.user.email,
        phone: app.user.phone,
        resumeUrl: app.user.resume_url,
        profilePicture: app.user.profile_picture_url,
      },
      coverLetter: app.cover_letter,
      status: app.status,
      appliedDate: app.applied_at.toISOString().split('T')[0],
    }));
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}
