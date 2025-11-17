import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamoDBService } from '../../services/dynamodb.service';
import { UserRepository } from './repositories/user.repository';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './users.service';
import { UserSchema } from './entities/user.entity';
import { getTableName } from '../../utils/table-naming.util';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'User',
        schema: UserSchema,
        options: {
          tableName: getTableName('users'),
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    DynamoDBService,
    UserRepository,
    UsersService,
  ],
  exports: [DynamoDBService, UserRepository, UsersService],
})
export class UsersModule {}
