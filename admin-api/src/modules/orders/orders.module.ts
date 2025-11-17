import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamoDBService } from '../../services/dynamodb.service';
import { OrderRepository } from './repositories/order.repository';
import { OrdersController } from './controllers/orders.controller';
import { OrderSchema } from './entities/order.entity';
import { getTableName } from '../../utils/table-naming.util';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Order',
        schema: OrderSchema,
        options: {
          tableName: getTableName('orders'),
        },
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [DynamoDBService, OrderRepository],
  exports: [DynamoDBService, OrderRepository],
})
export class OrdersModule {}
