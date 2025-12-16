import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api') //全局路径
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
