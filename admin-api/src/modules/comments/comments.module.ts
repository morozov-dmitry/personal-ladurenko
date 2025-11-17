import { Module } from '@nestjs/common';
import { DynamooseModule } from 'nestjs-dynamoose';
import { DynamoDBService } from '../../services/dynamodb.service';
import { CommentRepository } from './repositories/comment.repository';
import { CommentsController } from './controllers/comments.controller';
import { CommentSchema } from './entities/comment.entity';
import { getTableName } from '../../utils/table-naming.util';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'Comment',
        schema: CommentSchema,
        options: {
          tableName: getTableName('comments'),
        },
      },
    ]),
  ],
  controllers: [CommentsController],
  providers: [DynamoDBService, CommentRepository],
  exports: [DynamoDBService, CommentRepository],
})
export class CommentsModule {}
