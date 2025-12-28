import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveJobDto } from './dto/job.dto';

interface JobFilters {
  location?: string;
  type?: string;
  experience?: string;
  industry?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async getAllJobs(filters: JobFilters = {}) {
    const { page, limit, ...queryFilters } = filters;
    const where: any = { status: 'active' };

    // Apply filters
    if (queryFilters.location && queryFilters.location !== 'all') {
      where.location = {
        contains: queryFilters.location,
        mode: 'insensitive',
      };
    }

    if (queryFilters.type && queryFilters.type !== 'all') {
      where.type = {
        equals: queryFilters.type,
        mode: 'insensitive',
      };
    }

    if (queryFilters.experience && queryFilters.experience !== 'all') {
      where.experience = {
        contains: queryFilters.experience,
        mode: 'insensitive',
      };
    }

    if (queryFilters.industry && queryFilters.industry !== 'all') {
      where.industry = {
        contains: queryFilters.industry,
        mode: 'insensitive',
      };
    }

    if (queryFilters.search) {
      where.OR = [
        { title: { contains: queryFilters.search, mode: 'insensitive' } },
        { company: { contains: queryFilters.search, mode: 'insensitive' } },
        { description: { contains: queryFilters.search, mode: 'insensitive' } },
      ];
    }

    const queryOptions: any = {
      where,
      orderBy: { posted_date: 'desc' },
    };

    // Add pagination if provided
    if (page && limit) {
      queryOptions.skip = (page - 1) * limit;
      queryOptions.take = limit;
    }

    const jobs = await this.prisma.job.findMany(queryOptions);

    // Get total count for pagination
    const total = await this.prisma.job.count({ where });

    // Transform to match frontend format
    const transformedJobs = jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary: {
        min: job.salary_min,
        max: job.salary_max,
        currency: job.salary_currency,
      },
      description: job.description,
      requirements: job.requirements as string[],
      applicationSteps: job.application_steps as string[],
      skills: job.skills as string[],
      benefits: job.benefits as string[],
      postedDate: job.posted_date.toISOString().split('T')[0],
      applicants: job.applicants,
      remote: job.remote,
      industry: job.industry,
    }));

    // Return with pagination metadata if pagination was used
    if (page && limit) {
      return {
        data: transformedJobs,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }

    return transformedJobs;
  }

  async getJobById(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id, status: 'active' },
    });
    
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    // Transform to match frontend format
    return {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      experience: job.experience,
      salary: {
        min: job.salary_min,
        max: job.salary_max,
        currency: job.salary_currency,
      },
      description: job.description,
      requirements: job.requirements as string[],
      applicationSteps: job.application_steps as string[],
      skills: job.skills as string[],
      benefits: job.benefits as string[],
      postedDate: job.posted_date.toISOString().split('T')[0],
      applicants: job.applicants,
      remote: job.remote,
      industry: job.industry,
    };
  }

  async getSavedJobs(userId: number) {
    const savedJobs = await this.prisma.savedJob.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });

    return savedJobs.map(job => ({
      id: job.job_id,
      ...(typeof job.job_data === 'object' && job.job_data !== null ? job.job_data : {}),
      savedAt: job.created_at,
    }));
  }

  async saveJob(userId: number, saveJobDto: SaveJobDto) {
    const { job_id, job_data } = saveJobDto;

    // Check if already saved
    const existing = await this.prisma.savedJob.findUnique({
      where: {
        user_id_job_id: {
          user_id: userId,
          job_id: job_id,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Job already saved');
    }

    const savedJob = await this.prisma.savedJob.create({
      data: {
        user_id: userId,
        job_id: job_id,
        job_data: job_data,
      },
    });

    return {
      message: 'Job saved successfully',
      savedJob,
    };
  }

  async unsaveJob(userId: number, jobId: string) {
    const savedJob = await this.prisma.savedJob.findUnique({
      where: {
        user_id_job_id: {
          user_id: userId,
          job_id: jobId,
        },
      },
    });

    if (!savedJob) {
      throw new NotFoundException('Saved job not found');
    }

    await this.prisma.savedJob.delete({
      where: {
        user_id_job_id: {
          user_id: userId,
          job_id: jobId,
        },
      },
    });

    return { message: 'Job removed from saved jobs' };
  }

  async isJobSaved(userId: number, jobId: string): Promise<boolean> {
    const savedJob = await this.prisma.savedJob.findUnique({
      where: {
        user_id_job_id: {
          user_id: userId,
          job_id: jobId,
        },
      },
    });

    return !!savedJob;
  }
}
