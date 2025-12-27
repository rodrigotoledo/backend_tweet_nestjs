import { Controller, Get, Post, Body } from '@nestjs/common';
import { TweetService } from './tweet.service';

@Controller('tweets')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get()
  findAll() {
    return this.tweetService.findAll();
  }

  @Post()
  create(@Body('content') content: string) {
    return this.tweetService.create(content);
  }
}
