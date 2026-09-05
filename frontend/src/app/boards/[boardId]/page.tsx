'use client';

import React, { useEffect, useState, use } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Navbar } from '../../../components/layout/Navbar';
import { AuthGuard } from '../../../components/auth/AuthGuard';
import { Column } from '../../../components/kanban/Column';
import { TaskCard } from '../../../components/kanban/TaskCard';
import { TaskDetailDialog } from '../../../components/kanban/TaskDetailDialog';
import { AddTaskDialog } from '../../../components/kanban/AddTaskDialog';
import { AddColumnDialog } from '../../../components/kanban/AddColumnDialog';
import { ShareBoardDialog } from '../../../components/boards/ShareBoardDialog';
import { EmptyState } from '../../../components/common/EmptyState';
import { Skeleton } from '../../../components/ui/skeleton';
import { Button } from '../../../components/ui/button';
import { AvatarInitials } from '../../../components/common/AvatarInitials';
import { Board, Column as ColumnType, Task, BoardMember } from '../../../types';
import { api } from '../../../lib/api';
import { useBoardStore } from '../../../store/useBoardStore';
import { Plus, UserPlus, Columns, Layers } from 'lucide-react';
import { toast } from 'sonner';

export default function BoardDetailPage({ params }: { params: Promise<{ boardId: string }> }) {
  const { boardId } = use(params);

  const {
    currentBoard,
    setBoard,
    snapshotCurrentState,
    rollbackState,
    moveTaskOptimistic,
    addColumnOptimistic,
    updateColumnOptimistic,
    deleteColumnOptimistic,
    addTaskOptimistic,
    updateTaskOptimistic,
    deleteTaskOptimistic,
  } = useBoardStore();

  const [isLoading, setIsLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);

  // Dialog states
  const [addTaskColumnId, setAddTaskColumnId] = useState<string | null>(null);
  const [addColumnOpen, setAddColumnOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Mobile active column selector
  const [activeMobileColumnId, setActiveMobileColumnId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchBoard = async () => {
    setIsLoading(true);
    try {
      const data = await api.boards.getById(boardId);
      setBoard(data);
      if (data.columns && data.columns.length > 0) {
        setActiveMobileColumnId(data.columns[0].id);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load board.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (boardId) {
      fetchBoard();
    }
  }, [boardId]);

  // Helper to find column containing a task
  const findColumnOfTask = (taskId: string): ColumnType | undefined => {
    if (!currentBoard?.columns) return undefined;
    return currentBoard.columns.find((col) => col.tasks?.some((t) => t.id === taskId));
  };

  // Drag Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id as string;
    
    // Find task object
    for (const col of currentBoard?.columns || []) {
      const found = col.tasks?.find((t) => t.id === taskId);
      if (found) {
        setActiveTask(found);
        break;
      }
    }
    snapshotCurrentState();
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findColumnOfTask(activeId);
    if (!activeColumn) return;

    // Find over column (over could be a column id or another task id)
    let overColumn = currentBoard?.columns?.find((c) => c.id === overId);
    if (!overColumn) {
      overColumn = findColumnOfTask(overId);
    }

    if (!overColumn) return;

    if (activeColumn.id === overColumn.id) {
      if (activeId !== overId) {
        const activeIndex = activeColumn.tasks?.findIndex((t) => t.id === activeId) ?? -1;
        const overIndex = activeColumn.tasks?.findIndex((t) => t.id === overId) ?? -1;
        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
          moveTaskOptimistic(activeId, activeColumn.id, activeColumn.id, overIndex);
        }
      }
      return;
    }

    // Cross-column movement in local active state during drag over
    const overTasks = overColumn.tasks || [];
    const overTaskIndex = overTasks.findIndex((t) => t.id === overId);
    const newIndex = overTaskIndex >= 0 ? overTaskIndex : overTasks.length;

    moveTaskOptimistic(activeId, activeColumn.id, overColumn.id, newIndex);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findColumnOfTask(activeId);
    if (!activeColumn) return;

    let overColumn = currentBoard?.columns?.find((c) => c.id === overId);
    if (!overColumn) {
      overColumn = findColumnOfTask(overId);
    }

    if (!overColumn) return;

    const targetTasks = overColumn.tasks || [];
    const targetIndex = targetTasks.findIndex((t) => t.id === activeId);
    if (targetIndex < 0) return;

    // Calculate beforeTaskId and afterTaskId for precision backend reordering
    // In targetTasks (ordered ascending by order):
    // beforeTaskId is task preceding activeId in list (index - 1)
    // afterTaskId is task succeeding activeId in list (index + 1)
    const beforeTask = targetIndex > 0 ? targetTasks[targetIndex - 1] : undefined;
    const afterTask = targetIndex < targetTasks.length - 1 ? targetTasks[targetIndex + 1] : undefined;

    try {
      await api.tasks.move(activeId, {
        targetColumnId: overColumn.id,
        beforeTaskId: beforeTask?.id,
        afterTaskId: afterTask?.id,
      });
    } catch (err: any) {
      toast.error(err?.message || 'Failed to move task position.');
      rollbackState();
    }
  };

  // Column Actions
  const handleUpdateColumnTitle = async (columnId: string, title: string) => {
    updateColumnOptimistic(columnId, title);
    try {
      await api.columns.update(columnId, { title });
      toast.success('Column updated');
    } catch (err: any) {
      toast.error('Failed to update column title.');
      fetchBoard();
    }
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (!confirm('Are you sure you want to delete this column and all its tasks?')) return;
    deleteColumnOptimistic(columnId);
    try {
      await api.columns.delete(columnId);
      toast.success('Column deleted');
    } catch (err: any) {
      toast.error('Failed to delete column.');
      fetchBoard();
    }
  };

  // Task Actions
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    updateTaskOptimistic(updatedTask.id, updatedTask.title, updatedTask.description);
  };

  const handleTaskDeleted = (taskId: string) => {
    deleteTaskOptimistic(taskId);
  };

  const handleMemberAdded = (newMember: BoardMember) => {
    if (currentBoard) {
      const members = [...(currentBoard.members || []), newMember];
      setBoard({ ...currentBoard, members });
    }
  };

  return (
    <AuthGuard>
      <div className="h-screen bg-[#F5F1E8] flex flex-col font-body overflow-hidden">
        <Navbar boardTitle={currentBoard?.title} />

        {/* Board Header Bar */}
        <div className="border-b-2 border-[#18181B] bg-white px-4 py-3 shadow-[0px_2px_0px_0px_#000]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-xl sm:text-2xl font-black uppercase text-[#18181B] truncate max-w-md">
                {currentBoard?.title || 'BOARD VIEW'}
              </h1>
              {currentBoard?.description && (
                <span className="hidden md:inline text-xs font-medium text-zinc-500 truncate max-w-xs border-l-2 border-zinc-300 pl-3">
                  {currentBoard.description}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Member avatar stack */}
              <div className="hidden sm:flex items-center -space-x-2">
                {currentBoard?.members?.slice(0, 3).map((m) => (
                  <AvatarInitials
                    key={m.id}
                    name={m.user?.name}
                    email={m.user?.email}
                    id={m.userId}
                    size="sm"
                    shape="circle"
                  />
                ))}
              </div>

              <Button
                onClick={() => setShareOpen(true)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <UserPlus className="h-4 w-4 mr-1.5" /> SHARE
              </Button>

              <Button
                onClick={() => setAddColumnOpen(true)}
                variant="default"
                size="sm"
                className="text-xs"
              >
                <Plus className="h-4 w-4 mr-1.5" /> ADD COLUMN
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Column Switcher Bar */}
        {currentBoard?.columns && currentBoard.columns.length > 0 && (
          <div className="md:hidden border-b-2 border-[#18181B] bg-[#FAF6F0] p-2 flex gap-2 overflow-x-auto">
            {currentBoard.columns.map((col) => (
              <button
                key={col.id}
                onClick={() => setActiveMobileColumnId(col.id)}
                className={`px-3 py-1.5 text-xs font-heading font-bold uppercase border-2 border-[#18181B] whitespace-nowrap transition-all ${
                  activeMobileColumnId === col.id
                    ? 'bg-[#15803D] text-white shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-white text-[#18181B]'
                }`}
              >
                {col.title} ({col.tasks?.length || 0})
              </button>
            ))}
          </div>
        )}

        {/* Main Drag-and-Drop Workspace */}
        <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
          {isLoading ? (
            <div className="flex gap-6 h-full">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-full w-80 shrink-0" />
              ))}
            </div>
          ) : currentBoard?.columns && currentBoard.columns.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              {/* Desktop Multi-column view & Mobile filtered view */}
              <div className="flex h-full gap-6 items-start">
                {currentBoard.columns.map((column) => {
                  const isMobileHidden =
                    activeMobileColumnId && activeMobileColumnId !== column.id;

                  return (
                    <div
                      key={column.id}
                      className={`h-full ${isMobileHidden ? 'hidden md:block' : 'block'}`}
                    >
                      <Column
                        column={column}
                        tasks={column.tasks || []}
                        onTaskClick={handleTaskClick}
                        onAddTask={(colId) => setAddTaskColumnId(colId)}
                        onUpdateColumnTitle={handleUpdateColumnTitle}
                        onDeleteColumn={handleDeleteColumn}
                      />
                    </div>
                  );
                })}

                {/* Add Column End Card */}
                <div
                  onClick={() => setAddColumnOpen(true)}
                  className="flex h-full w-80 shrink-0 flex-col items-center justify-center p-6 border-2 border-dashed border-[#18181B] bg-white hover:bg-[#FAF6F0] shadow-[4px_4px_0px_0px_#000] cursor-pointer transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 group min-h-[300px]"
                >
                  <div className="p-3 bg-[#15803D] text-white border-2 border-[#18181B] shadow-[2px_2px_0px_0px_#000] mb-2 group-hover:scale-110 transition-transform">
                    <Columns className="h-6 w-6" />
                  </div>
                  <span className="font-heading font-bold text-sm uppercase text-[#18181B]">
                    ADD NEW COLUMN
                  </span>
                </div>
              </div>

              {/* Drag Overlay preview during active drag */}
              <DragOverlay>
                {activeTask ? (
                  <TaskCard task={activeTask} onTaskClick={() => {}} isOverlay />
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <EmptyState
              icon="tasks"
              title="NO COLUMNS YET"
              description="This board doesn't have any columns yet. Create a column like 'To Do', 'In Progress', or 'Done' to start adding tasks."
              actionLabel="ADD FIRST COLUMN"
              onAction={() => setAddColumnOpen(true)}
              className="max-w-md mx-auto my-12"
            />
          )}
        </main>

        {/* Dialogs */}
        <AddTaskDialog
          columnId={addTaskColumnId}
          isOpen={!!addTaskColumnId}
          onClose={() => setAddTaskColumnId(null)}
          onTaskCreated={(newTask) => {
            if (addTaskColumnId) {
              addTaskOptimistic(addTaskColumnId, newTask);
            }
          }}
        />

        <AddColumnDialog
          boardId={boardId}
          isOpen={addColumnOpen}
          onClose={() => setAddColumnOpen(false)}
          onColumnCreated={(newCol) => addColumnOptimistic(newCol)}
        />

        {currentBoard && (
          <ShareBoardDialog
            isOpen={shareOpen}
            onClose={() => setShareOpen(false)}
            boardId={currentBoard.id}
            boardTitle={currentBoard.title}
            members={currentBoard.members || []}
            onMemberAdded={handleMemberAdded}
          />
        )}

        <TaskDetailDialog
          task={selectedTask}
          isOpen={taskDetailOpen}
          onClose={() => {
            setTaskDetailOpen(false);
            setSelectedTask(null);
          }}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      </div>
    </AuthGuard>
  );
}
