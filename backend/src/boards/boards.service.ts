import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBoardDto } from './dto/create-board.dto.js';
import { CreateColumnDto } from './dto/create-column.dto.js';
import { UpdateColumnDto } from './dto/update-column.dto.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

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

  async createColumn(boardId: string, createColumnDto: CreateColumnDto) {
    const lastColumn = await this.prisma.column.findFirst({
      where: { boardId },
      orderBy: { order: 'desc' },
    });
    const nextOrder = lastColumn ? lastColumn.order + 1024 : 1024;
    return this.prisma.column.create({
      data: {
        title: createColumnDto.title,
        order: nextOrder,
        boardId,
      },
    });
  }

  async updateColumn(columnId: string, updateColumnDto: UpdateColumnDto) {
    return this.prisma.column.update({
      where: { id: columnId },
      data: {
        title: updateColumnDto.title,
      },
    });
  }

  async deleteColumn(columnId: string) {
    return this.prisma.column.delete({
      where: { id: columnId },
    });
  }

  async createTask(columnId: string, createTaskDto: CreateTaskDto) {
    const lastTask = await this.prisma.task.findFirst({
      where: { columnId },
      orderBy: { order: 'desc' },
    });
    const nextOrder = lastTask ? lastTask.order + 1024 : 1024;
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        description: createTaskDto.description,
        order: nextOrder,
        columnId,
      },
    });
  }

  async updateTask(taskId: string, updateTaskDto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: updateTaskDto.title,
        description: updateTaskDto.description,
      },
    });
  }

  async deleteTask(taskId: string) {
    return this.prisma.task.delete({
      where: { id: taskId },
    });
  }
}
