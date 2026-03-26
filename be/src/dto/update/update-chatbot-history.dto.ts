import { PartialType } from '@nestjs/mapped-types';
import { CreateChatbotHistoryDto } from '../create/create-chatbot-history.dto';

export class UpdateChatbotHistoryDto extends PartialType(
  CreateChatbotHistoryDto,
) {}
