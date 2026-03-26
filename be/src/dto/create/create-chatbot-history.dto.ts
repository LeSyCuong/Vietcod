import { IsInt, IsString } from 'class-validator';

export class CreateChatbotHistoryDto {
  @IsInt()
  userId: number;

  @IsString()
  role: string;

  @IsString()
  text: string;
}
