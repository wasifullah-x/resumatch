import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';

export class ResumeParser {
  static async parseResume(filePath: string): Promise<string[]> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfParser = (pdfParse as any).default || pdfParse;
      const data = await pdfParser(dataBuffer);
      const text = data.text;

      // Extract skills using common keywords and patterns
      const skills = this.extractSkills(text);
      return skills;
    } catch (error) {
      console.error('Error parsing resume:', error);
      return [];
    }
  }

  private static extractSkills(text: string): string[] {
    const skillsKeywords = [
      // Programming Languages
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
      
      // Web Technologies
      'HTML', 'CSS', 'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Next.js', 'Nuxt.js', 'Redux',
      'Webpack', 'Vite', 'Bootstrap', 'Tailwind', 'SASS', 'LESS',
      
      // Backend & Databases
      'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API', 'Prisma', 'TypeORM',
      'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'Laravel',
      
      // Cloud & DevOps
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'Git', 'GitHub', 'GitLab',
      'Terraform', 'Ansible', 'Linux', 'Nginx', 'Apache',
      
      // Mobile
      'React Native', 'Flutter', 'iOS', 'Android', 'Xamarin',
      
      // Data & AI
      'Machine Learning', 'TensorFlow', 'PyTorch', 'Data Analysis', 'Pandas', 'NumPy', 'Scikit-learn',
      'Power BI', 'Tableau', 'Excel',
      
      // Testing
      'Jest', 'Mocha', 'Cypress', 'Selenium', 'JUnit', 'PyTest',
      
      // Soft Skills
      'Leadership', 'Communication', 'Team Management', 'Problem Solving', 'Agile', 'Scrum',
      'Project Management', 'Critical Thinking'
    ];

    const foundSkills: string[] = [];
    const lowerText = text.toLowerCase();

    for (const skill of skillsKeywords) {
      const lowerSkill = skill.toLowerCase();
      if (lowerText.includes(lowerSkill)) {
        foundSkills.push(skill);
      }
    }

    return [...new Set(foundSkills)]; // Remove duplicates
  }
}
