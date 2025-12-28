

import { Controller, Get, Post, Body, UseGuards, Request, Query, Param } from '@nestjs/common';

interface JwtUserPayload {
  userId: number;
  username: string;
}
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TweetService } from './tweet.service';

@Controller('tweets')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get('username/:username')
  @UseGuards(JwtAuthGuard)
  findByUsername(
    @Request() req: { user: JwtUserPayload },
    @Param('username') username: string,
  ) {
    // Busca tweets pelo username
    console.log(`[TweetController] GET /tweets/username/${username}`);
    return this.tweetService.findByUsername(username);
  }

  @Get('latest')
  @UseGuards(JwtAuthGuard)
  findLatest(@Request() req: { user: JwtUserPayload }) {
    // Retorna os últimos tweets de todos os usuários
    console.log('[TweetController] GET /tweets/latest');
    return this.tweetService.findLatest();
  }

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
