import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service.js';
import { AuthGuard } from '@nestjs/passport';
import { BoardAccessGuard } from './guards/board-access.guard.js';
import { BoardResource } from './decorators/board-resource.decorator.js';
import { CreateBoardDto } from './dto/create-board.dto.js';
import { AddMemberDto } from './dto/add-member.dto.js';

@Controller('boards')
@UseGuards(AuthGuard('jwt'))
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async createBoard(
    @Req() req: any,
    @Body() createBoardDto: CreateBoardDto,
  ) {
    return this.boardsService.createBoard(req.user.id, createBoardDto);
  }

  @Get()
  async getBoards(@Req() req: any) {
    return this.boardsService.getUserBoards(req.user.id);
  }

  @Get(':boardId')
  @UseGuards(BoardAccessGuard)
  @BoardResource({ kind: 'board', paramName: 'boardId', minRole: 'MEMBER' })
  async getBoard(@Req() req: any) {
    // req.boardId is populated by the BoardAccessGuard!
    return this.boardsService.getBoardById(req.boardId);
  }

  @Post(':boardId/members')
  @UseGuards(BoardAccessGuard)
  @BoardResource({ kind: 'board', paramName: 'boardId', minRole: 'OWNER' })
  async addMember(
    @Req() req: any,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.boardsService.addMember(req.boardId, addMemberDto.email, addMemberDto.role);
  }
}
