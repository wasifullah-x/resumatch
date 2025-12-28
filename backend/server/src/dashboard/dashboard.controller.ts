import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  async getDashboardStats(@Request() req) {
    return this.dashboardService.getDashboardStats(req.user.userId);
  }

  @Get('recommendations')
  async getRecommendedJobs(@Request() req) {
    return this.dashboardService.getRecommendedJobs(req.user.userId);
  }
}
