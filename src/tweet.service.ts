import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tweet } from './tweet.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Like } from './like.entity';
import { Dislike } from './dislike.entity';
import { Retweet } from './retweet.entity';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet)
    private tweetRepository: Repository<Tweet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Dislike)
    private dislikeRepository: Repository<Dislike>,
    @InjectRepository(Retweet)
    private retweetRepository: Repository<Retweet>,
  ) {}

  // Retweet: usuário logado só pode retweetar 1x por tweet
  async retweetTweet(tweetId: number, userId: number): Promise<Tweet | null> {
    const tweet = await this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: ['retweets', 'user'],
    });
    if (!tweet) throw new Error('Tweet not found');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    // Impede retweet do próprio tweet
    if (tweet.user.id === userId) {
      throw new Error('Você não pode retweetar seu próprio tweet.');
    }
    // Verifica se já existe retweet
    const existing = await this.retweetRepository.findOne({
      where: { tweet: { id: tweetId }, user: { id: userId } },
    });
    if (existing) return tweet; // já retweetou, retorna tweet
    const retweet = this.retweetRepository.create({ tweet, user });
    await this.retweetRepository.save(retweet);
    // Retorna tweet atualizado
    return this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: ['retweets', 'user'],
    });
  }

  // Unretweet: remove o retweet do usuário logado
  async unretweetTweet(tweetId: number, userId: number): Promise<Tweet | null> {
    const tweet = await this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: ['retweets', 'user'],
    });
    if (!tweet) throw new Error('Tweet not found');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    // Remove retweet se existir
    const existing = await this.retweetRepository.findOne({
      where: { tweet: { id: tweetId }, user: { id: userId } },
    });
    if (existing) await this.retweetRepository.remove(existing);
    // Retorna tweet atualizado
    return this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: ['retweets', 'user'],
    });
  }

  // Busca tweet por id (com user)
  async findTweetById(tweetId: number) {
    const tweet = await this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: [
        'user',
        'likes',
        'dislikes',
        'retweets',
        'comments',
        'comments.user',
      ],
    });
    if (!tweet) return null;
    return {
      id: tweet.id,
      content: tweet.content,
      creatorId: tweet.user?.id || 0,
      creatorUsername: tweet.user?.username || 'unknown',
      likes: tweet.likes?.length || 0,
      dislikes: tweet.dislikes?.length || 0,
      retweets: tweet.retweets?.length || 0,
      comments:
        tweet.comments
          ?.filter((comment) => comment.user)
          .map((comment) => ({
            id: comment.id,
            content: comment.content,
            creatorId: comment.user.id,
            creatorUsername: comment.user.username,
            createdAt: comment.createdAt,
          })) || [],
      createdAt: tweet.createdAt,
    };
  }

  // Comment: usuário logado só pode comentar tweets que não são seus
  async commentTweet(
    tweetId: number,
    userId: number,
    content: string,
  ): Promise<Comment> {
    const tweet = await this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: ['user'],
    });
    if (!tweet) throw new Error('Tweet not found');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // Impede comentário no próprio tweet
    if (tweet.user.id === userId) {
      throw new Error('Você não pode comentar seu próprio tweet.');
    }

    const comment = this.commentRepository.create({ tweet, user, content });
    return this.commentRepository.save(comment);
  }

  // Like: usuário logado só pode dar like 1x por tweet
  async likeTweet(tweetId: number, userId: number): Promise<Tweet | null> {
    const tweet = await this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: ['likes', 'user'],
    });
    if (!tweet) throw new Error('Tweet not found');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    // Verifica se já existe like
    const existing = await this.likeRepository.findOne({
      where: { tweet: { id: tweetId }, user: { id: userId } },
    });
    if (existing) return tweet; // já curtiu, retorna tweet
    const like = this.likeRepository.create({ tweet, user });
    await this.likeRepository.save(like);
    // Retorna tweet atualizado
    return this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: ['likes', 'user'],
    });
  }

  // Dislike: usuário logado só pode dar dislike 1x por tweet
  async dislikeTweet(tweetId: number, userId: number): Promise<Tweet | null> {
    const tweet = await this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: ['dislikes', 'user'],
    });
    if (!tweet) throw new Error('Tweet not found');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    // Verifica se já existe dislike
    const existing = await this.dislikeRepository.findOne({
      where: { tweet: { id: tweetId }, user: { id: userId } },
    });
    if (existing) return tweet; // já deu dislike, retorna tweet
    const dislike = this.dislikeRepository.create({ tweet, user });
    await this.dislikeRepository.save(dislike);
    // Retorna tweet atualizado
    return this.tweetRepository.findOne({
      where: { id: tweetId },
      relations: ['dislikes', 'user'],
    });
  }

  async findByUsername(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      return [];
    }
    const tweets = await this.tweetRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      relations: [
        'user',
        'likes',
        'dislikes',
        'retweets',
        'comments',
        'comments.user',
      ],
    });
    return tweets.map((tweet) => ({
      id: tweet.id,
      content: tweet.content,
      creatorId: tweet.user?.id || 0,
      creatorUsername: tweet.user?.username || 'unknown',
      likes: tweet.likes?.length || 0,
      dislikes: tweet.dislikes?.length || 0,
      retweets: tweet.retweets?.length || 0,
      comments:
        tweet.comments
          ?.filter((comment) => comment.user)
          .map((comment) => ({
            id: comment.id,
            content: comment.content,
            creatorId: comment.user.id,
            creatorUsername: comment.user.username,
            createdAt: comment.createdAt,
          })) || [],
      createdAt: tweet.createdAt,
    }));
  }

  async findLatest() {
    const tweets = await this.tweetRepository.find({
      order: { createdAt: 'DESC' },
      relations: [
        'user',
        'likes',
        'dislikes',
        'retweets',
        'comments',
        'comments.user',
      ],
    });
    return tweets.map((tweet) => ({
      id: tweet.id,
      content: tweet.content,
      creatorId: tweet.user?.id || 0,
      creatorUsername: tweet.user?.username || 'unknown',
      likes: tweet.likes?.length || 0,
      dislikes: tweet.dislikes?.length || 0,
      retweets: tweet.retweets?.length || 0,
      comments:
        tweet.comments
          ?.filter((comment) => comment.user)
          .map((comment) => ({
            id: comment.id,
            content: comment.content,
            creatorId: comment.user.id,
            creatorUsername: comment.user.username,
            createdAt: comment.createdAt,
          })) || [],
      createdAt: tweet.createdAt,
    }));
  }

  async create(content: string, userPayload: { userId: number }) {
    const user = await this.userRepository.findOne({
      where: { id: userPayload.userId },
    });
    if (!user) {
      throw new Error('User not found');
    }
    const tweet = this.tweetRepository.create({ content, user });
    const saved = await this.tweetRepository.save(tweet);
    return {
      id: saved.id,
      content: saved.content,
      creatorId: user.id,
      creatorUsername: user.username,
      likes: 0,
      dislikes: 0,
      retweets: 0,
      comments: [],
      createdAt: saved.createdAt,
    };
  }

  async findAll(userId: number) {
    const tweets = await this.tweetRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: [
        'user',
        'likes',
        'dislikes',
        'retweets',
        'comments',
        'comments.user',
      ],
    });
    return tweets
      .filter((tweet) => tweet.user)
      .map((tweet) => ({
        id: tweet.id,
        content: tweet.content,
        creatorId: tweet.user.id,
        creatorUsername: tweet.user.username,
        likes: tweet.likes?.length || 0,
        dislikes: tweet.dislikes?.length || 0,
        retweets: tweet.retweets?.length || 0,
        comments:
          tweet.comments?.map((comment) => ({
            id: comment.id,
            content: comment.content,
            creatorId: comment.user.id,
            creatorUsername: comment.user.username,
            createdAt: comment.createdAt,
          })) || [],
        createdAt: tweet.createdAt,
      }));
  }
}
