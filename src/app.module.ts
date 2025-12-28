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
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USERNAME || 'tweet_user',
      password: process.env.DATABASE_PASSWORD || 'tweet_password',
      database: process.env.DATABASE_NAME || 'tweet_app',
      entities: [Tweet, User, Comment, Like, Dislike, Retweet],
      synchronize: process.env.NODE_ENV === 'development' && !process.env.USE_MIGRATIONS,
      migrations: ['dist/migrations/*.js'],
      migrationsRun:
        process.env.NODE_ENV === 'production' ||
        process.env.USE_MIGRATIONS === 'true',
      logging: process.env.NODE_ENV === 'development',
    }),
    TypeOrmModule.forFeature([Tweet, User, Comment, Like, Dislike, Retweet]),
    AuthModule,
  ],
  controllers: [AppController, TweetController],
  providers: [AppService, TweetService],
})
export class AppModule {}
