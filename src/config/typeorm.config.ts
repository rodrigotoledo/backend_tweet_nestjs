import { DataSource } from 'typeorm';
import { Tweet } from '../tweet.entity';
import { User } from '../user.entity';
import { Comment } from '../comment.entity';
import { Like } from '../like.entity';
import { Dislike } from '../dislike.entity';
import { Retweet } from '../retweet.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USERNAME || 'tweet_user',
  password: process.env.DATABASE_PASSWORD || 'tweet_password',
  database: process.env.DATABASE_NAME || 'tweet_app',
  entities: [Tweet, User, Comment, Like, Dislike, Retweet],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});

