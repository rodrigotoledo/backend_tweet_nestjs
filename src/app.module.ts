import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Tweet } from './tweet.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Dislike } from './dislike.entity';
import { Retweet } from './retweet.entity';
import { TweetController } from './tweet.controller';
import { TweetService } from './tweet.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.sqlite3',
      entities: [Tweet, User, Comment, Like, Dislike, Retweet],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Tweet, User, Comment, Like, Dislike, Retweet]),
    AuthModule,
  ],
  controllers: [AppController, TweetController],
  providers: [AppService, TweetService],
})
export class AppModule {}
