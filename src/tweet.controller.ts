import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';


interface JwtUserPayload {
  userId: number;
  username: string;
}
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TweetService } from './tweet.service';

@Controller('tweets')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('userId') userId: string, @Request() req: { user: JwtUserPayload }) {
    // Se userId for passado, retorna os tweets desse usuário, senão do logado
    const id = userId ? Number(userId) : req.user.userId;
    console.log(`[TweetController] GET /tweets - userId: ${id}`);
    return this.tweetService.findAll(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body('content') content: string, @Request() req: { user: JwtUserPayload }) {
    console.log(`[TweetController] POST /tweets - userId: ${req.user.userId}, content: ${content}`);
    return this.tweetService.create(content, req.user);
  }
}
