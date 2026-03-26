import axios from 'axios';
import axiosRetry from 'axios-retry';
import { Injectable, Logger } from '@nestjs/common';
import { Readable } from 'stream';

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

@Injectable()
export class OpenRouterService {
  private readonly logger = new Logger(OpenRouterService.name);

  async streamMessage(
    messages: { role: string; content: string }[],
  ): Promise<Readable> {
    const stream = new Readable({ read() {} });

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages,
          stream: true,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.CHAT_API_KEY}`,
          },
          responseType: 'stream',
        },
      );

      response.data.on('data', (chunk: Buffer) => {
        const str = chunk.toString();
        str.split('\n').forEach((line) => {
          line = line.trim();
          if (!line || line === 'data: [DONE]') return;

          if (line.startsWith('data: ')) {
            const jsonStr = line.replace(/^data: /, '');
            try {
              const obj = JSON.parse(jsonStr);

              // lấy content nếu có
              const content = obj.choices?.[0]?.delta?.content;
              if (content) {
                // push ra stream dạng JSON chuẩn
                const outObj = { message: { content } };
                stream.push(JSON.stringify(outObj) + '\n');
              }
            } catch (e) {
              this.logger.warn('Lỗi parse token:', e.message);
            }
          }
        });
      });

      response.data.on('end', () => stream.push(null));
      response.data.on('error', (err: any) => {
        this.logger.error('OpenRouter stream error:', err.message);
        stream.destroy(err);
      });
    } catch (err) {
      this.logger.error('OpenRouter API request error:', err.message);
      stream.destroy(err);
    }

    return stream;
  }

  async sendMessage(
    messages: { role: string; content: string }[],
  ): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        { model: 'meta-llama/llama-4-scout-17b-16e-instruct', messages },
        { headers: { Authorization: `Bearer ${process.env.CHAT_API_KEY}` } },
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      this.logger.error(
        'OpenRouter API error:',
        error.response?.data || error.message,
      );
      return 'Xin lỗi, hiện tại trợ lý ảo đang bận. Vui lòng thử lại sau.';
    }
  }
}
