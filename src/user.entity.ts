import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Tweet } from './tweet.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Dislike } from './dislike.entity';
import { Retweet } from './retweet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Tweet, tweet => tweet.user)
  tweets: Tweet[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Dislike, (dislike) => dislike.user)
  dislikes: Dislike[];

  @OneToMany(() => Retweet, (retweet) => retweet.user)
  retweets: Retweet[];
}
