import { ChatOpenAI } from '@langchain/openai';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { LangchainDto } from './dto/langchain.dto';

@Injectable()
export class LangchainService {
  constructor(private configService: ConfigService) {}

  async post(langchainDto: LangchainDto) {
    const chatModel = new ChatOpenAI({
      openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
      modelName: 'gpt-3.5-turbo-1106',
      temperature: 0,
    });

    const question = langchainDto.messages;
    const res = await chatModel.invoke(question);
    return res;
  }
}
