import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Retweet } from './retweet.entity';


@Entity()
export class Tweet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.tweets, { eager: true })
  user: User;

  @OneToMany(() => Comment, comment => comment.tweet)
  comments: Comment[];

  @OneToMany(() => Like, like => like.tweet)
  likes: Like[];

  @OneToMany(() => Retweet, retweet => retweet.tweet)
  retweets: Retweet[];
}
