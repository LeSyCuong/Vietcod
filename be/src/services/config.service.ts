import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConfigDto } from '../dto/create/create-config.dto';
import { UpdateConfigDto } from '../dto/update/update-config.dto';
import { Config } from '../entities/config.entity';

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(Config)
    private readonly ConfigRepository: Repository<Config>,
  ) {}

  async create(createConfigDto: CreateConfigDto): Promise<Config> {
    const newEntry = this.ConfigRepository.create(createConfigDto);
    return await this.ConfigRepository.save(newEntry);
  }

  async findAllByLang(lang: string): Promise<Config[]> {
    return await this.ConfigRepository.find({ where: { lang } });
  }

  async findAll(): Promise<Config[]> {
    return await this.ConfigRepository.find();
  }

  async findOne(id: number): Promise<Config> {
    const entry = await this.ConfigRepository.findOneBy({ id });
    if (!entry) throw new NotFoundException(`Config #${id} not found`);
    return entry;
  }

  async update(id: number, updateConfigDto: UpdateConfigDto): Promise<Config> {
    const entry = await this.findOne(id);
    Object.assign(entry, updateConfigDto);
    return await this.ConfigRepository.save(entry);
  }

  async remove(id: number): Promise<void> {
    const result = await this.ConfigRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Config #${id} not found`);
    }
  }
}
