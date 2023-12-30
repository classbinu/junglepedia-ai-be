import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('My Today API')
  .setDescription('My Today API description')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
