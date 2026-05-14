import { NestFactory } from '@nestjs/core';
import { AppModule }   from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS para o frontend React conseguir chamar a API
  // Em produção, troque '*' pela URL real do seu frontend
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST'],
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Backend rodando em http://localhost:${port}`);
  console.log(`📬 Endpoint de leads: POST http://localhost:${port}/leads`);
}

bootstrap();
