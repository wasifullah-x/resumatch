import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateApplicationDto, UpdateApplicationDto } from './dto/application.dto';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async getApplications(userId: number, status?: string, limit?: number, jobId?: string) {
    const where: any = { user_id: userId };
    
    if (status) {
      where.status = status;
    }
    
    if (jobId) {
      where.job_id = jobId;
    }

    const applications = await this.prisma.application.findMany({
      where,
      orderBy: { applied_at: 'desc' },
      take: limit,
    });

    return applications;
  }

  async getApplicationById(userId: number, applicationId: number) {
    const application = await this.prisma.application.findFirst({
      where: {
        id: applicationId,
        user_id: userId,
      },
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async createApplication(userId: number, createApplicationDto: CreateApplicationDto) {
    const application = await this.prisma.application.create({
      data: {
        user_id: userId,
        job_id: createApplicationDto.job_id,
        job_title: createApplicationDto.job_title,
        company_name: createApplicationDto.company_name,
        job_location: createApplicationDto.job_location,
        job_type: createApplicationDto.job_type,
        job_data: createApplicationDto.job_data,
        cover_letter: createApplicationDto.cover_letter,
        applied_via: createApplicationDto.applied_via,
        notes: createApplicationDto.notes,
        status: 'applied',
      },
    });

    return application;
  }

  async updateApplication(userId: number, applicationId: number, updateApplicationDto: UpdateApplicationDto) {
    // Verify application belongs to user
    const existing = await this.prisma.application.findFirst({
      where: {
        id: applicationId,
        user_id: userId,
      },
    });

    if (!existing) {
      throw new NotFoundException('Application not found');
    }

    const application = await this.prisma.application.update({
      where: { id: applicationId },
      data: updateApplicationDto,
    });

    return application;
  }

  async deleteApplication(userId: number, applicationId: number) {
    // Verify application belongs to user
    const existing = await this.prisma.application.findFirst({
      where: {
        id: applicationId,
        user_id: userId,
      },
    });

    if (!existing) {
      throw new NotFoundException('Application not found');
    }

    await this.prisma.application.delete({
      where: { id: applicationId },
    });

    return { message: 'Application deleted successfully' };
  }

  async getApplicationStats(userId: number) {
    const [total, applied, interviewing, accepted, rejected] = await Promise.all([
      this.prisma.application.count({ where: { user_id: userId } }),
      this.prisma.application.count({ where: { user_id: userId, status: 'applied' } }),
      this.prisma.application.count({ where: { user_id: userId, status: 'interviewing' } }),
      this.prisma.application.count({ where: { user_id: userId, status: 'accepted' } }),
      this.prisma.application.count({ where: { user_id: userId, status: 'rejected' } }),
    ]);

    return {
      total,
      applied,
      interviewing,
      accepted,
      rejected,
    };
  }
}
