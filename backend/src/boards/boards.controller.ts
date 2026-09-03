import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service.js';
import { AuthGuard } from '@nestjs/passport';
import { BoardAccessGuard } from './guards/board-access.guard.js';
import { BoardResource } from './decorators/board-resource.decorator.js';

@Controller('boards')
@UseGuards(AuthGuard('jwt'))
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async createBoard(
    @Req() req: any,
    @Body('title') title: string,
    @Body('description') description?: string,
  ) {
    return this.boardsService.createBoard(req.user.id, title, description);
  }

  @Get(':boardId')
  @UseGuards(BoardAccessGuard)
  @BoardResource({ kind: 'board', paramName: 'boardId', minRole: 'MEMBER' })
  async getBoard(@Req() req: any) {
    // req.boardId is populated by the BoardAccessGuard!
    return this.boardsService.getBoardById(req.boardId);
  }
}
