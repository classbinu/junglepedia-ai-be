import { LangchainController } from './langchain.controller';
import { LangchainService } from './langchain.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [LangchainController],
  providers: [LangchainService],
})
export class LangchainModule {}
