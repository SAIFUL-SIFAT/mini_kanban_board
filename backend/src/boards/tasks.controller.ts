import { Controller, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service.js';
import { AuthGuard } from '@nestjs/passport';
import { BoardAccessGuard } from './guards/board-access.guard.js';
import { BoardResource } from './decorators/board-resource.decorator.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly boardsService: BoardsService) {}

  @Patch(':taskId')
  @UseGuards(BoardAccessGuard)
  @BoardResource({ kind: 'task', paramName: 'taskId', minRole: 'MEMBER' })
  async updateTask(
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.boardsService.updateTask(taskId, updateTaskDto);
  }

  @Delete(':taskId')
  @UseGuards(BoardAccessGuard)
  @BoardResource({ kind: 'task', paramName: 'taskId', minRole: 'MEMBER' })
  async deleteTask(@Param('taskId') taskId: string) {
    return this.boardsService.deleteTask(taskId);
  }
}
