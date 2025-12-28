import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Dislike } from './dislike.entity';
import { Retweet } from './retweet.entity';

@Entity()
export class Tweet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.tweets, { eager: true })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.tweet)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.tweet)
  likes: Like[];

  @OneToMany(() => Dislike, (dislike) => dislike.tweet)
  dislikes: Dislike[];

  @OneToMany(() => Retweet, (retweet) => retweet.tweet)
  retweets: Retweet[];

  get retweetCount(): number {
    return this.retweets ? this.retweets.length : 0;
  }

  get dislikeCount(): number {
    return this.dislikes ? this.dislikes.length : 0;
  }
}
