import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { configure } from '@vendia/serverless-express';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import * as express from 'express';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    
    // Enable CORS
    nestApp.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Amz-Date', 'X-Api-Key', 'X-Amz-Security-Token'],
    });
    
    // Enable validation pipes
    nestApp.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));
    
    await nestApp.init();
    cachedServer = configure({ app: expressApp });
  }
  return cachedServer;
}

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
  const server = await bootstrap();
  return server(event, context);
};
