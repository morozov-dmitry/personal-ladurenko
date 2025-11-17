import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api');

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Lostal Admin API')
    .setDescription('API documentation for Lostal Legal Office admin system')
    .setVersion('1.0')
    .addTag('health', 'Health check endpoints')
    .addTag('orders', 'Order management endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('comments', 'Comment management endpoints')
    .addTag('form', 'Form submission endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Enable CORS for frontend integration
  app.enableCors('*');

  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `🚀 Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📚 API Documentation: http://localhost:${process.env.PORT ?? 3000}/api/docs`,
  );
}
bootstrap();
