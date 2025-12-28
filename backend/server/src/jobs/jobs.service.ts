import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveJobDto, CreateJobDto, UpdateJobDto } from './dto/job.dto';

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

  async getRawJobById(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
    });
    
    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
    
    return job;
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

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createJob(employerId: number, createJobDto: CreateJobDto) {
    const job = await this.prisma.job.create({
      data: {
        title: createJobDto.title,
        company: createJobDto.company,
        location: createJobDto.location,
        type: createJobDto.type,
        experience: createJobDto.experience,
        salary_min: createJobDto.salary_min || null,
        salary_max: createJobDto.salary_max || null,
        salary_currency: createJobDto.salary_currency || 'PKR',
        description: createJobDto.description,
        requirements: createJobDto.requirements,
        application_steps: createJobDto.application_steps,
        skills: createJobDto.skills,
        benefits: createJobDto.benefits || [],
        remote: createJobDto.remote || false,
        industry: createJobDto.industry,
        employer_id: employerId,
        status: 'active',
        posted_date: new Date(),
        applicants: 0,
        views: 0,
        featured: false,
      },
    });

    return {
      message: 'Job posted successfully',
      job: {
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
      },
    };
  }

  async updateJob(jobId: string, updateJobDto: UpdateJobDto) {
    const updateData: any = {};
    
    if (updateJobDto.title) updateData.title = updateJobDto.title;
    if (updateJobDto.company) updateData.company = updateJobDto.company;
    if (updateJobDto.location) updateData.location = updateJobDto.location;
    if (updateJobDto.type) updateData.type = updateJobDto.type;
    if (updateJobDto.experience) updateData.experience = updateJobDto.experience;
    if (updateJobDto.salary_min !== undefined) updateData.salary_min = updateJobDto.salary_min;
    if (updateJobDto.salary_max !== undefined) updateData.salary_max = updateJobDto.salary_max;
    if (updateJobDto.salary_currency) updateData.salary_currency = updateJobDto.salary_currency;
    if (updateJobDto.description) updateData.description = updateJobDto.description;
    if (updateJobDto.requirements) updateData.requirements = updateJobDto.requirements;
    if (updateJobDto.application_steps) updateData.application_steps = updateJobDto.application_steps;
    if (updateJobDto.skills) updateData.skills = updateJobDto.skills;
    if (updateJobDto.benefits) updateData.benefits = updateJobDto.benefits;
    if (updateJobDto.remote !== undefined) updateData.remote = updateJobDto.remote;
    if (updateJobDto.industry) updateData.industry = updateJobDto.industry;
    if (updateJobDto.status) updateData.status = updateJobDto.status;

    const job = await this.prisma.job.update({
      where: { id: jobId },
      data: updateData,
    });

    return {
      message: 'Job updated successfully',
      job: {
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
        status: job.status,
      },
    };
  }

  async deleteJob(jobId: string) {
    await this.prisma.job.update({
      where: { id: jobId },
      data: { status: 'deleted' },
    });

    return { message: 'Job deleted successfully' };
  }

  async getEmployerJobs(employerId: number) {
    const jobs = await this.prisma.job.findMany({
      where: { 
        employer_id: employerId,
        status: { not: 'deleted' },
      },
      orderBy: { posted_date: 'desc' },
    });

    return jobs.map(job => ({
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
      applications: 0, // TODO: Count actual applications
      remote: job.remote,
      industry: job.industry,
      status: job.status,
      views: job.views,
      featured: job.featured,
    }));
  }
}
