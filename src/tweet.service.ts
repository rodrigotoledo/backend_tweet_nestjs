import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';
import { User } from './user.entity';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet)
    private tweetRepository: Repository<Tweet>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

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
      relations: ['user'],
    });
    console.log(
      `[TweetService] ${tweets.length} tweets encontrados para userId: ${userId}`,
    );
    return tweets;
  }
}
