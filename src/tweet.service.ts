import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tweet } from './tweet.entity';
import { User } from './user.entity';
import { Like } from './like.entity';
import { Retweet } from './retweet.entity';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet)
    private tweetRepository: Repository<Tweet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Retweet)
    private retweetRepository: Repository<Retweet>,
  ) {}

  // Retweet: usuário logado só pode retweetar 1x por tweet
  async retweetTweet(tweetId: number, userId: number): Promise<Tweet | null> {
    const tweet = await this.tweetRepository.findOne({ where: { id: tweetId }, relations: ['retweets', 'user'] });
    if (!tweet) throw new Error('Tweet not found');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    // Verifica se já existe retweet
    const existing = await this.retweetRepository.findOne({ where: { tweet: { id: tweetId }, user: { id: userId } } });
    if (existing) return tweet; // já retweetou, retorna tweet
    const retweet = this.retweetRepository.create({ tweet, user });
    await this.retweetRepository.save(retweet);
    // Retorna tweet atualizado
    return this.tweetRepository.findOne({ where: { id: tweetId }, relations: ['retweets', 'user'] });
  }

  // Unretweet: remove o retweet do usuário logado
  async unretweetTweet(tweetId: number, userId: number): Promise<Tweet | null> {
    const tweet = await this.tweetRepository.findOne({ where: { id: tweetId }, relations: ['retweets', 'user'] });
    if (!tweet) throw new Error('Tweet not found');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    // Remove retweet se existir
    const existing = await this.retweetRepository.findOne({ where: { tweet: { id: tweetId }, user: { id: userId } } });
    if (existing) await this.retweetRepository.remove(existing);
    // Retorna tweet atualizado
    return this.tweetRepository.findOne({ where: { id: tweetId }, relations: ['retweets', 'user'] });
  }

  // Busca tweet por id (com user)
  async findTweetById(tweetId: number): Promise<Tweet | null> {
    return this.tweetRepository.findOne({ where: { id: tweetId }, relations: ['user'] });
  }
  // Like: usuário logado só pode dar like 1x por tweet
  async likeTweet(tweetId: number, userId: number): Promise<Tweet | null> {
    const tweet = await this.tweetRepository.findOne({ where: { id: tweetId }, relations: ['likes', 'user'] });
    if (!tweet) throw new Error('Tweet not found');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    // Verifica se já existe like
    const existing = await this.likeRepository.findOne({ where: { tweet: { id: tweetId }, user: { id: userId } } });
    if (existing) return tweet; // já curtiu, retorna tweet
    const like = this.likeRepository.create({ tweet, user });
    await this.likeRepository.save(like);
    // Retorna tweet atualizado
    return this.tweetRepository.findOne({ where: { id: tweetId }, relations: ['likes', 'user'] });
  }

  // Dislike: remove o like do usuário logado
  async dislikeTweet(tweetId: number, userId: number): Promise<Tweet | null> {
    const tweet = await this.tweetRepository.findOne({ where: { id: tweetId }, relations: ['likes', 'user'] });
    if (!tweet) throw new Error('Tweet not found');
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    // Remove like se existir
    const existing = await this.likeRepository.findOne({ where: { tweet: { id: tweetId }, user: { id: userId } } });
    if (existing) await this.likeRepository.remove(existing);
    // Retorna tweet atualizado
    return this.tweetRepository.findOne({ where: { id: tweetId }, relations: ['likes', 'user'] });
  }

  async findByUsername(username: string) {
    console.log(`[TweetService] Buscando tweets para username: '${username}'`);
    const user = await this.userRepository.findOne({ where: { username } });
    console.log(`[TweetService] Resultado da busca por usuário:`, user);
    if (!user) {
      console.warn(`[TweetService] Usuário não encontrado: '${username}'`);
      return [];
    }
    const tweets = await this.tweetRepository.find({
      where: { user: { id: user.id } },
      order: { createdAt: 'DESC' },
      relations: ['user', 'likes'],
    });
    console.log(`[TweetService] ${tweets.length} tweets encontrados para username: '${username}'`);
    return tweets;
  }

  async findLatest() {
    console.log('[TweetService] Buscando últimos tweets de todos os usuários');
    const tweets = await this.tweetRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['user', 'likes'],
    });
    console.log(`[TweetService] ${tweets.length} tweets encontrados (latest)`);
    return tweets;
  }

  async create(content: string, userPayload: { userId: number }) {
    console.log(
      `[TweetService] Criando tweet para userId: ${userPayload.userId}, content: ${content}`,
    );
    const user = await this.userRepository.findOne({
      where: { id: userPayload.userId },
    });
    if (!user) {
      console.error(
        `[TweetService] Usuário não encontrado: ${userPayload.userId}`,
      );
      throw new Error('User not found');
    }
    const tweet = this.tweetRepository.create({ content, user });
    const saved = await this.tweetRepository.save(tweet);
    console.log(`[TweetService] Tweet criado com id: ${saved.id}`);
    return saved;
  }

  async findAll(userId: number) {
    console.log(`[TweetService] Buscando tweets para userId: ${userId}`);
    const tweets = await this.tweetRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      relations: ['user', 'likes'],
    });
    console.log(
      `[TweetService] ${tweets.length} tweets encontrados para userId: ${userId}`,
    );
    return tweets;
  }
}
