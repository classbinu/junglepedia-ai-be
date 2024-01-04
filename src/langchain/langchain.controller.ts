import { Body, Controller, Post } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { LangchainService } from './langchain.service';
import { LangchainDto } from './dto/langchain.dto';

@ApiTags('Langchain')
@Controller('langchain')
export class LangchainController {
  constructor(private readonly langchainService: LangchainService) {}

  @Post()
  post(@Body() langchainDto: LangchainDto) {
    // 서버 요청인지 확인 필요. 클라이언트 요청이면 400 에러
    return this.langchainService.post(langchainDto);
  }
}
