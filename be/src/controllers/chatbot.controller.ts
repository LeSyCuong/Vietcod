import { Controller, Post, Get, Body, Res, Query } from '@nestjs/common';
import { ChatbotService } from 'src/services/chatbot.service';
import { Response } from 'express';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatService: ChatbotService) {}

  @Post()
  async sendMessage(@Body() body: { message: string; userId: number }) {
    const reply = await this.chatService.handleMessage(
      body.userId,
      body.message,
    );
    return { reply };
  }

  @Get('stream')
  async chatStream(
    @Res() res: Response,
    @Query('userId') userId: number,
    @Query('message') message: string,
  ) {
    res.set({
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.flushHeaders();

    const stream = await this.chatService.streamMessage(userId, message);

    let reply = '';
    try {
      for await (const chunk of stream) {
        const str = chunk.toString();
        str.split('\n').forEach((line) => {
          if (!line) return;
          try {
            const obj = JSON.parse(line);
            if (obj.message?.content) {
              reply += obj.message.content;
              res.write(`data: ${obj.message.content}\n\n`);
            }
          } catch (e) {}
        });
      }

      await this.chatService.historyService.saveMessage(
        userId,
        'user',
        message,
      );
      await this.chatService.historyService.saveMessage(userId, 'bot', reply);
      await this.chatService.detectAndSaveContact(userId, message);

      res.write('event: done\ndata: \n\n');
      res.end();
    } catch (err) {
      console.error(err);
      res.write('event: error\ndata: Lỗi khi xử lý chatbot\n\n');
      res.end();
    }
  }
}
