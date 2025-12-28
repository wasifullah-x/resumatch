import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { SaveJobDto } from './dto/job.dto';
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
