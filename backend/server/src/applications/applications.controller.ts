import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto, UpdateApplicationDto } from './dto/application.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get()
  async getApplications(
    @Request() req,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('jobId') jobId?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    return this.applicationsService.getApplications(req.user.userId, status, limitNum, jobId);
  }

  @Get('stats')
  async getApplicationStats(@Request() req) {
    return this.applicationsService.getApplicationStats(req.user.userId);
  }

  @Get(':id')
  async getApplicationById(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.getApplicationById(req.user.userId, id);
  }

  @Post()
  async createApplication(@Request() req, @Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.createApplication(req.user.userId, createApplicationDto);
  }

  @Put(':id')
  async updateApplication(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationsService.updateApplication(req.user.userId, id, updateApplicationDto);
  }

  @Delete(':id')
  async deleteApplication(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.applicationsService.deleteApplication(req.user.userId, id);
  }
}
