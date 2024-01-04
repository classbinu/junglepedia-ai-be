import { IsString } from 'class-validator';

export class LangchainDto {
  @IsString()
  messages: string;
}
