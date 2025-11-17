import { Module, Global } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { HealthController } from './controllers/health.controller';
import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AuthModule } from './modules/auth/auth.module';
import { FormModule } from './modules/form/form.module';
import { DynamoDBService } from './services/dynamodb.service';
import { FilterService } from './services/filter.service';

@Global()
@Module({
  imports: [
    DynamooseModule.forRoot({
      aws: {
        region: process.env.AWS_REGION || 'eu-central-1',
      },
      local:
        process.env.NODE_ENV === 'development' && process.env.DYNAMODB_ENDPOINT
          ? process.env.DYNAMODB_ENDPOINT
          : false,
    }),
    OrdersModule,
    UsersModule,
    CommentsModule,
    AuthModule,
    FormModule,
  ],
  controllers: [HealthController],
  providers: [DynamoDBService, FilterService],
  exports: [DynamoDBService, FilterService],
})
export class AppModule {}
