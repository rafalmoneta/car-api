import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { User } from 'src/users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.reportRepository.create(reportDto);
    report.user = user;
    return this.reportRepository.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    report.approved = approved;
    return this.reportRepository.save(report);
  }

  async createEstimate({
    make,
    model,
    lng,
    lat,
    year,
    mileage,
  }: GetEstimateDto) {
    return this.reportRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
