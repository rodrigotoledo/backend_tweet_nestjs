import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tweet } from './tweet.entity';

@Injectable()
export class TweetService {
  constructor(
    @InjectRepository(Tweet)
    private tweetRepository: Repository<Tweet>,
  ) {}

  create(content: string) {
    const tweet = this.tweetRepository.create({ content });
    return this.tweetRepository.save(tweet);
  }

  findAll() {
    return this.tweetRepository.find({ order: { createdAt: 'DESC' } });
  }
}
