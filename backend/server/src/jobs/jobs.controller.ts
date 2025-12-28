import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query, Put, ForbiddenException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { SaveJobDto, CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  // Public endpoint - Get all jobs with optional filters
  @Get()
  async getAllJobs(
    @Query('location') location?: string,
    @Query('type') type?: string,
    @Query('experience') experience?: string,
    @Query('industry') industry?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.jobsService.getAllJobs({ 
      location, 
      type, 
      experience, 
      industry, 
      search,
      page: page ? parseInt(page, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });
  }

  // Protected endpoints - Get saved jobs (must come before :id route)
  @Get('saved')
  @UseGuards(JwtAuthGuard)
  async getSavedJobs(@Request() req) {
    return this.jobsService.getSavedJobs(req.user.userId);
  }

  // Public endpoint - Get single job by ID
  @Get(':id')
  async getJobById(@Param('id') id: string) {
    return this.jobsService.getJobById(id);
  }

  // Create a new job (employers only)
  @Post()
  @UseGuards(JwtAuthGuard)
  async createJob(@Request() req, @Body() createJobDto: CreateJobDto) {
    const user = await this.jobsService.getUserById(req.user.userId);
    if (user.role !== 'employer' && user.role !== 'admin') {
      throw new ForbiddenException('Only employers can post jobs');
    }
    return this.jobsService.createJob(req.user.userId, createJobDto);
  }

  // Update a job (employer who created it only)
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateJob(@Request() req, @Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    const job = await this.jobsService.getRawJobById(id);
    if (job.employer_id !== req.user.userId) {
      throw new ForbiddenException('You can only edit your own jobs');
    }
    return this.jobsService.updateJob(id, updateJobDto);
  }

  // Delete a job (employer who created it only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteJob(@Request() req, @Param('id') id: string) {
    const job = await this.jobsService.getRawJobById(id);
    if (job.employer_id !== req.user.userId) {
      throw new ForbiddenException('You can only delete your own jobs');
    }
    return this.jobsService.deleteJob(id);
  }

  // Get jobs posted by logged-in employer
  @Get('employer/my-jobs')
  @UseGuards(JwtAuthGuard)
  async getMyJobs(@Request() req) {
    const user = await this.jobsService.getUserById(req.user.userId);
    if (user.role !== 'employer' && user.role !== 'admin') {
      throw new ForbiddenException('Only employers can access this');
    }
    return this.jobsService.getEmployerJobs(req.user.userId);
  }

  @Post(':jobId/save')
  @UseGuards(JwtAuthGuard)
  async saveJob(@Request() req, @Param('jobId') jobId: string, @Body() body: any) {
    const saveJobDto: SaveJobDto = {
      job_id: jobId,
      job_data: body,
    };
    return this.jobsService.saveJob(req.user.userId, saveJobDto);
  }

  @Delete(':jobId/save')
  @UseGuards(JwtAuthGuard)
  async unsaveJob(@Request() req, @Param('jobId') jobId: string) {
    return this.jobsService.unsaveJob(req.user.userId, jobId);
  }

  @Get(':jobId/saved')
  @UseGuards(JwtAuthGuard)
  async isJobSaved(@Request() req, @Param('jobId') jobId: string) {
    const isSaved = await this.jobsService.isJobSaved(req.user.userId, jobId);
    return { isSaved };
  }
}
