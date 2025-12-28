import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Tweet } from './tweet.entity';

@Entity()
export class Dislike {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.dislikes, { eager: true })
  user: User;

  @ManyToOne(() => Tweet, (tweet) => tweet.dislikes, { onDelete: 'CASCADE' })
  tweet: Tweet;

  @CreateDateColumn()
  createdAt: Date;
}