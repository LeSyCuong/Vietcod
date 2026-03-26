import { PartialType } from '@nestjs/mapped-types';
import { CreateConfigDto } from '../create/create-config.dto';

export class UpdateConfigDto extends PartialType(CreateConfigDto) {}
