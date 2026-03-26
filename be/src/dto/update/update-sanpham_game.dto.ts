import { PartialType } from '@nestjs/mapped-types';
import { CreateSanphamGameDto } from '../create/create-sanpham_game.dto';

export class UpdateSanphamGameDto extends PartialType(CreateSanphamGameDto) {}
