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
import { ChatbotHistoryService } from 'src/services/chatbot-history.service';
import { CreateChatbotHistoryDto } from 'src/dto/create/create-chatbot-history.dto';
import { UpdateChatbotHistoryDto } from 'src/dto/update/update-chatbot-history.dto';
import { JwtAuthGuard } from 'src/middlewares/auth/jwt-auth.guard';
import { RolesGuard } from 'src/middlewares/auth/roles.guard';
import { Roles } from 'src/middlewares/auth/roles.decorator';

@Controller('chatbot-history')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatbotHistoryController {
  constructor(private readonly service: ChatbotHistoryService) {}

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
  create(@Body() data: CreateChatbotHistoryDto) {
    return this.service.create(data);
  }

  @Put(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() data: UpdateChatbotHistoryDto) {
    return this.service.update(+id, data);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
