import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix(process.env.API_PREFIX ?? 'api');
  setupSwagger(app);
  await app.listen(process.env.API_PORT ?? 8000);
}
bootstrap();
