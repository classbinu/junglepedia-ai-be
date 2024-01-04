import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Jungle Pedia API')
  .setDescription('Jungle Pedia API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
