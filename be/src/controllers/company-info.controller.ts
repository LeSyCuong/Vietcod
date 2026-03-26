import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CompanyInfoService } from 'src/services/company-info.service';
import { CreateCompanyInfoDto } from 'src/dto/create/create-company-info.dto';
import { UpdateCompanyInfoDto } from 'src/dto/update/update-company-info.dto';
import { JwtAuthGuard } from 'src/middlewares/auth/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/auth/roles.guard';
import { Roles } from 'src/middlewares/auth/roles.decorator';

@Controller('company-info')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyInfoController {
  constructor(private readonly service: CompanyInfoService) {}

  @Get('all')
  @Roles('admin')
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @Roles('admin')
  create(@Body() data: CreateCompanyInfoDto) {
    return this.service.create(data);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() data: UpdateCompanyInfoDto) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
