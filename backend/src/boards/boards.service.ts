import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBoardDto } from './dto/create-board.dto.js';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async createBoard(userId: string, createBoardDto: CreateBoardDto) {
    return this.prisma.board.create({
      data: {
        title: createBoardDto.title,
        description: createBoardDto.description,
        members: {
          create: {
            userId,
            role: 'OWNER',
          },
        },
      },
    });
  }

  async getUserBoards(userId: string) {
    return this.prisma.board.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });
  }

  async getBoardById(boardId: string) {
    return this.prisma.board.findUnique({
      where: { id: boardId },
      include: {
        columns: {
          orderBy: { order: 'asc' },
          include: {
            tasks: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  async addMember(boardId: string, email: string, role: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('no user with that email');
    }

    return this.prisma.boardMember.upsert({
      where: {
        userId_boardId: {
          userId: user.id,
          boardId: boardId,
        },
      },
      update: { role },
      create: {
        userId: user.id,
        boardId: boardId,
        role: role,
      },
    });
  }
}
