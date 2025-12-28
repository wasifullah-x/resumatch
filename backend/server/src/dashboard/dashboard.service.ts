import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(userId: number) {
    const [appliedJobs, savedJobs, user] = await Promise.all([
      this.prisma.application.count({ where: { user_id: userId } }),
      this.prisma.savedJob.count({ where: { user_id: userId } }),
      this.prisma.user.findUnique({ where: { id: userId } }),
    ]);

    // Calculate recommendations based on user skills
    const recommendations = this.calculateRecommendations(user);

    return {
      appliedJobs,
      savedJobs,
      recommendations,
    };
  }

  async getRecommendedJobs(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      return [];
    }

    // Extract user skills
    const userSkills = this.extractUserSkills(user);

    // In a real application, you would:
    // 1. Fetch jobs from The Muse API or your own database
    // 2. Match them with user skills
    // 3. Return the most relevant jobs
    
    // For now, return a recommendation count
    return {
      message: 'Job recommendations based on your skills',
      skills: userSkills,
      recommendationCount: userSkills.length * 10, // Mock calculation
    };
  }

  private calculateRecommendations(user: any): number {
    if (!user || !user.skills) return 0;
    
    const skills = user.skills as any;
    let count = 0;
    
    if (skills.primary) count += Array.isArray(skills.primary) ? skills.primary.length : 0;
    if (skills.technical) count += Array.isArray(skills.technical) ? skills.technical.length : 0;
    
    return count * 5; // Mock calculation: 5 jobs per skill
  }

  private extractUserSkills(user: any): string[] {
    if (!user || !user.skills) return [];
    
    const skills = user.skills as any;
    const allSkills: string[] = [];
    
    if (Array.isArray(skills.primary)) allSkills.push(...skills.primary);
    if (Array.isArray(skills.technical)) allSkills.push(...skills.technical);
    if (Array.isArray(skills.secondary)) allSkills.push(...skills.secondary);
    
    return allSkills;
  }
}
