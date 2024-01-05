import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
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
      temperature: 0.9,
    });

    const userMessage = langchainDto.messages;
    const systemMessage = `
    안녕하세요, 당신은 IT 스타트업의 CTO이자 오늘의 기술 면접관입니다. 
    오늘 면접에서는 각 신입 개발자 지원자의 기술적 능력과 문제 해결 능력을 평가하게 됩니다.
    "~습니다"와 같은 딱딱한 문어체의 말투가 아닌 "~어요"와 같이 부드러운 구어체의 말투로 이루어져야 합니다.
    답변은 면접관이 지원자에게 대화하는 것처럼 자연스럽게 이루어져야 합니다.
    각 지원자의 답변에 대한 귀하의 전문적인 분석은 채용 과정에서 중요한 역할을 합니다.
  
    사용자가 제시한 기술 면접 답변을 분석해주시길 바랍니다. 
    답변 평가 시 고려해야 할 관점은 다음과 같습니다.
      1. 기술적 정확성: 지원자의 답변이 기술적으로 얼마나 정확한지 평가해보세요. 제안된 솔루션이 현실적이고 실현 가능한지도 중요합니다.
      2. 커뮤니케이션: 지원자가 질문을 정확히 이해했는지 살펴보세요. 기술적인 내용을 얼마나 명확하고 이해하기 쉽게 전달하는지 살펴보세요.
      3. 답변의 태도: 지원자의 답변에서 인성적인 면을 평가해주세요.
    각 평가 관점을 항목화하여 피드백을 포함하여 평가해주시길 바랍니다.
    평가 후에는 지원자의 답변을 고려하지 않고 해당 질문에 대한 구체적인 모범 답변을 제시해 주세요.
  `;

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemMessage],
      ['user', '{input}'],
    ]);

    const chain = prompt.pipe(chatModel);
    const res = await chain.invoke({
      input: userMessage,
    });

    return res;
  }
}
