import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Tweet } from './tweet.entity';

@Entity()
export class Retweet {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.retweets, { eager: true })
  user: User;

  @ManyToOne(() => Tweet, tweet => tweet.retweets, { onDelete: 'CASCADE' })
  tweet: Tweet;

  @CreateDateColumn()
  createdAt: Date;
}
