import { Controller, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service.js';
import { AuthGuard } from '@nestjs/passport';
import { BoardAccessGuard } from './guards/board-access.guard.js';
import { BoardResource } from './decorators/board-resource.decorator.js';
import { UpdateColumnDto } from './dto/update-column.dto.js';
import { CreateTaskDto } from './dto/create-task.dto.js';

@Controller('columns')
@UseGuards(AuthGuard('jwt'))
export class ColumnsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Patch(':columnId')
  @UseGuards(BoardAccessGuard)
  @BoardResource({ kind: 'column', paramName: 'columnId', minRole: 'MEMBER' })
  async updateColumn(
    @Param('columnId') columnId: string,
    @Body() updateColumnDto: UpdateColumnDto,
  ) {
    return this.boardsService.updateColumn(columnId, updateColumnDto);
  }

  @Delete(':columnId')
  @UseGuards(BoardAccessGuard)
  @BoardResource({ kind: 'column', paramName: 'columnId', minRole: 'MEMBER' })
  async deleteColumn(@Param('columnId') columnId: string) {
    return this.boardsService.deleteColumn(columnId);
  }

  @Post(':columnId/tasks')
  @UseGuards(BoardAccessGuard)
  @BoardResource({ kind: 'column', paramName: 'columnId', minRole: 'MEMBER' })
  async createTask(
    @Param('columnId') columnId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.boardsService.createTask(columnId, createTaskDto);
  }
}
