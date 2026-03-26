import { Injectable } from '@nestjs/common';
import { ChatbotHistoryService } from './chatbot-history.service';
import { OpenRouterService } from './ai/openrouter.service';
import { RagService } from 'src/services/ai/rag.service';
import { ConTactService } from './contact.service';
import { Readable } from 'stream';

@Injectable()
export class ChatbotService {
  constructor(
    public readonly historyService: ChatbotHistoryService,
    private readonly aiService: OpenRouterService,
    private readonly ragService: RagService,
    private readonly contactService: ConTactService,
  ) {}

  async getHistoryContext(userId: number, limit = 5): Promise<string> {
    const history = await this.historyService.getHistory(userId);
    return history
      .slice(-limit)
      .map((m) => `${m.role}: ${m.text}`)
      .join('\n');
  }

  public async detectAndSaveContact(userId: number, message: string) {
    const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
    const phoneRegex = /\b\d{8,12}\b/;
    const nameRegex =
      /\b(tôi tên là|tên tôi là|mình là|tôi là)\s+([^\d@]{2,50})/i;
    const serviceRegex =
      /\b(mua|bán|xem|demo|thử|liên hệ|báo giá|source|game|thể loại|code)\s+([^\d@]{2,200})/i;

    const email = emailRegex.exec(message)?.[0];
    const phone = phoneRegex.exec(message)?.[0];
    const name = nameRegex.exec(message)?.[2]?.trim();

    let service = serviceRegex.exec(message)?.[2]?.trim();
    if (
      !service &&
      /(mua|bán|xem|demo|thử|liên hệ|báo giá|source|game|thể loại|code)/i.test(
        message,
      )
    ) {
      let temp = message;
      if (email) temp = temp.replace(email, '');
      if (phone) temp = temp.replace(phone, '');
      if (name) temp = temp.replace(name, '');
      service = temp.trim();
    }

    if (!email && !phone && !name && !service) return;

    let contact = await this.contactService.findLatestByUser(userId, 'chatbot');
    if (contact) {
      if (name && !contact.name) contact.name = name;
      if (email && !contact.email) contact.email = email;
      if (phone && !contact.phone) contact.phone = phone;
      if (service) {
        const services = new Set([
          ...(contact.service
            ? contact.service.split(',').map((s) => s.trim())
            : []),
          service,
        ]);
        contact.service = Array.from(services).join(', ');
      }
      contact.message = contact.message
        ? `${contact.message}\n${message}`
        : message;
      await this.contactService.updateContact(contact.id, contact);
    } else {
      await this.contactService.createContact({
        type: 'chatbot',
        user: userId,
        name,
        email,
        phone,
        service,
        message,
      });
    }
  }

  async streamMessage(userId: number, userMessage: string): Promise<Readable> {
    const history = await this.getHistoryContext(userId);
    const ragContext = await this.ragService.getRelevantContext(
      `${history}\n${userMessage}`,
    );

    const systemPrompt = `
Bạn là nhân viên tư vấn của website Vietcod.com — chuyên bán mã nguồn và server game.

 Mục tiêu:
- Hiểu rõ yêu cầu khách hàng (mua, xem demo, hỏi giá, hỏi setup...).
- Dựa vào "Sản phẩm liên quan" để cung cấp thông tin chính xác, tự nhiên, thân thiện.
- Trả lời ngắn gọn, đúng ý, nhưng nếu người dùng hỏi chi tiết thì trích dẫn phần "Mô tả chi tiết" tương ứng.

Quy tắc:
- Nếu khách hỏi setup → trả lời "Kỹ thuật hỗ trợ sau khi mua".
- Nếu khách hỏi giảm giá → hướng dẫn liên hệ Zalo hoặc hotline.
- Nếu khách muốn mua → hướng dẫn truy cập website Vietcod.com và chọn gói thanh toán.
- Nếu không có thông tin → trả lời "Tôi chưa có thông tin cụ thể về game này trong hệ thống."
- Giữ ngôn ngữ theo người dùng (nếu họ nói tiếng Anh thì trả lời bằng tiếng Anh).
- Chỉ trả lời các sản phẩm có trên dữ liệu sản phẩm hoặc nội bộ, không trả lời các sản phẩm không liên quan đến web
- Mỗi lần nhắn, không cần thiết phải nhắn xin chào rồi giới thiệu bản thân, chỉ cần trả lời đúng trọng tâm câu hỏi của khách

Dữ liệu nội bộ:
${ragContext.info}

Sản phẩm liên quan:
${ragContext.products}
`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `${history}\nUser: ${userMessage}` },
    ];

    return this.aiService.streamMessage(messages);
  }

  async handleMessage(userId: number, userMessage: string): Promise<string> {
    const stream = await this.streamMessage(userId, userMessage);
    let reply = '';

    for await (const chunk of stream) {
      const str = chunk.toString();
      str.split('\n').forEach((line) => {
        if (!line) return;
        try {
          const obj = JSON.parse(line);
          if (obj.message?.content) reply += obj.message.content;
        } catch (e) {}
      });
    }

    await this.historyService.saveMessage(userId, 'user', userMessage);
    await this.historyService.saveMessage(userId, 'bot', reply);
    await this.detectAndSaveContact(userId, userMessage);

    return reply;
  }
}
