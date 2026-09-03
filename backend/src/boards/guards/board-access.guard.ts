import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BOARD_RESOURCE_KEY, BoardResourceOptions } from '../decorators/board-resource.decorator.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class BoardAccessGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.get<BoardResourceOptions>(BOARD_RESOURCE_KEY, context.getHandler());
    
    // If no decorator, allow access (or maybe block? safe to allow if not decorated)
    if (!options) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const paramValue = request.params[options.paramName];
    if (!paramValue) {
      throw new NotFoundException(`Parameter ${options.paramName} not found`);
    }

    let boardId: string | null = null;

    // Resolve the board ID based on the resource kind
    if (options.kind === 'board') {
      boardId = paramValue;
      if (!boardId) throw new NotFoundException('Board ID missing');
      // Optionally verify board exists
      const board = await this.prisma.board.findUnique({ where: { id: boardId } });
      if (!board) throw new NotFoundException('Board not found');
    } else if (options.kind === 'column') {
      const column = await this.prisma.column.findUnique({ where: { id: paramValue } });
      if (!column) throw new NotFoundException('Column not found');
      boardId = column.boardId;
    } else if (options.kind === 'task') {
      const task = await this.prisma.task.findUnique({
        where: { id: paramValue },
        include: { column: true },
      });
      if (!task) throw new NotFoundException('Task not found');
      boardId = task.column.boardId;
    }

    if (!boardId) {
      throw new NotFoundException('Could not resolve board ID');
    }

    // Check membership
    const membership = await this.prisma.boardMember.findUnique({
      where: {
        userId_boardId: {
          userId: user.id,
          boardId: boardId,
        },
      },
    });

    if (!membership) {
      // Return 403 or 404 to hide existence
      throw new ForbiddenException('You do not have access to this board');
    }

    const minRole = options.minRole || 'MEMBER';
    if (minRole === 'OWNER' && membership.role !== 'OWNER') {
      throw new ForbiddenException('Requires OWNER role for this action');
    }

    // Attach to request
    request.boardId = boardId;
    request.boardRole = membership.role;

    return true;
  }
}
