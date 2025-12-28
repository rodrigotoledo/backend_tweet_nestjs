import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
  Param,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TweetService } from './tweet.service';

type JwtUserPayload = {
  userId: number;
  username: string;
};

@Controller('tweets')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  // Retweet endpoint
  @Post(':id/retweet')
  @UseGuards(JwtAuthGuard)
  async retweet(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: JwtUserPayload },
  ): Promise<any> {
    const userId = req.user.userId;
    // @ts-ignore
    const tweet: any = await this.tweetService.findTweetById(id);
    if (!tweet) throw new HttpException('Tweet not found', HttpStatus.NOT_FOUND);
    // @ts-ignore
    if (tweet && tweet.user && tweet.user.id === userId) {
      throw new HttpException('You cannot retweet your own tweet', HttpStatus.FORBIDDEN);
    }
    // @ts-ignore
    return this.tweetService.retweetTweet(id, userId);
  }

  // Unretweet endpoint
  @Post(':id/unretweet')
  @UseGuards(JwtAuthGuard)
  async unretweet(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: { user: JwtUserPayload },
  ): Promise<any> {
    const userId = req.user.userId;
    // @ts-ignore
    const tweet: any = await this.tweetService.findTweetById(id);
    if (!tweet) throw new HttpException('Tweet not found', HttpStatus.NOT_FOUND);
    // @ts-ignore
    if (tweet && tweet.user && tweet.user.id === userId) {
      throw new HttpException('You cannot unretweet your own tweet', HttpStatus.FORBIDDEN);
    }
    // @ts-ignore
    return this.tweetService.unretweetTweet(id, userId);
  }


  /**
   * Dá like em um tweet (usuário autenticado)
   * Não permite dar like no próprio tweet
   */
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async likeTweet(
    @Param('id') id: string,
    @Request() req: { user: JwtUserPayload },
  ): Promise<any> {
    const tweetId = Number(id);
    const userId = req.user.userId;
    // @ts-ignore
    const tweet: any = await this.tweetService.findTweetById(tweetId);
    if (!tweet) {
      return { error: 'Tweet not found' };
    }
    // @ts-ignore
    if (tweet && tweet.user && tweet.user.id === userId) {
      return { error: 'Você não pode dar like no seu próprio tweet.' };
    }
    try {
      // @ts-ignore
      const result = await this.tweetService.likeTweet(tweetId, userId);
      return result;
    } catch (err: any) {
      return { error: err.message || 'Erro ao dar like' };
    }
  }

  /**
   * Remove like do tweet (usuário autenticado)
   * Não permite dislike no próprio tweet
   */
  @Post(':id/dislike')
  @UseGuards(JwtAuthGuard)
  async dislikeTweet(
    @Param('id') id: string,
    @Request() req: { user: JwtUserPayload },
  ): Promise<any> {
    const tweetId = Number(id);
    const userId = req.user.userId;
    // @ts-ignore
    const tweet: any = await this.tweetService.findTweetById(tweetId);
    if (!tweet) {
      return { error: 'Tweet not found' };
    }
    // @ts-ignore
    if (tweet && tweet.user && tweet.user.id === userId) {
      return { error: 'Você não pode dar dislike no seu próprio tweet.' };
    }
    try {
      // @ts-ignore
      const result = await this.tweetService.dislikeTweet(tweetId, userId);
      return result;
    } catch (err: any) {
      return { error: err.message || 'Erro ao dar dislike' };
    }
  }

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
  findLatest() {
    // Retorna os últimos tweets de todos os usuários
    console.log('[TweetController] GET /tweets/latest');
    return this.tweetService.findLatest();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('userId') userId: string,
    @Request() req: { user: JwtUserPayload },
  ) {
    // Se userId for passado, retorna os tweets desse usuário, senão do logado
    const id = userId ? Number(userId) : req.user.userId;
    console.log(`[TweetController] GET /tweets - userId: ${id}`);
    return this.tweetService.findAll(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body('content') content: string,
    @Request() req: { user: JwtUserPayload },
  ) {
    console.log(`[TweetController] POST /tweets - userId: ${req.user.userId}, content: ${content}`);
    return this.tweetService.create(content, req.user);
  }
}
