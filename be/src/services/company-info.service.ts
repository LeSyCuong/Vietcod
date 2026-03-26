import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyInfo } from 'src/entities/company_info.entity';
import { CreateCompanyInfoDto } from 'src/dto/create/create-company-info.dto';
import { UpdateCompanyInfoDto } from 'src/dto/update/update-company-info.dto';

@Injectable()
export class CompanyInfoService {
  constructor(
    @InjectRepository(CompanyInfo)
    private repo: Repository<CompanyInfo>,
  ) {}

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async create(data: CreateCompanyInfoDto) {
    const company = this.repo.create(data);
    return await this.repo.save(company);
  }

  async update(id: number, data: UpdateCompanyInfoDto) {
    await this.repo.update(id, data);
    const updated = await this.repo.findOneBy({ id });
    if (!updated) throw new NotFoundException();
    return updated;
  }

  async remove(id: number) {
    return await this.repo.delete(id);
  }
}
