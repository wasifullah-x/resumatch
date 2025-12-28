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
    const { email, password, name, phone, location } = registerDto;

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

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}
