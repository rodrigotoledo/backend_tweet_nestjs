import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Tweet } from './tweet.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.comments, { eager: true })
  user: User;

  @ManyToOne(() => Tweet, tweet => tweet.comments, { onDelete: 'CASCADE' })
  tweet: Tweet;
}
