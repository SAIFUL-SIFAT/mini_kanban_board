'use client';

import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType, Task } from '../../types';
import { TaskCard } from './TaskCard';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Plus, MoreVertical, Edit2, Trash2, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (columnId: string) => void;
  onUpdateColumnTitle: (columnId: string, title: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onTaskClick,
  onAddTask,
  onUpdateColumnTitle,
  onDeleteColumn,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(column.title);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'Column', column },
  });

  const taskIds = tasks.map((t) => t.id);

  const handleSaveTitle = () => {
    if (titleInput.trim() && titleInput !== column.title) {
      onUpdateColumnTitle(column.id, titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex h-full w-80 shrink-0 flex-col border-2 border-[#18181B] bg-[#FAF6F0] p-3 shadow-[4px_4px_0px_0px_#000000] transition-colors',
        isOver && 'border-[#15803D] bg-[#15803D]/5 shadow-[6px_6px_0px_0px_#15803D]'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#18181B]">
        {isEditingTitle ? (
          <div className="flex items-center gap-1.5 w-full mr-2">
            <Input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              className="h-8 text-xs font-bold font-heading"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
                if (e.key === 'Escape') setIsEditingTitle(false);
              }}
            />
            <button
              onClick={handleSaveTitle}
              className="p-1 bg-[#15803D] text-white border border-[#18181B]"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setIsEditingTitle(false)}
              className="p-1 bg-white text-[#18181B] border border-[#18181B]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-[#18181B]">
              {column.title}
            </h3>
            <Badge variant="neutral" className="text-[11px] py-0 px-1.5">
              {tasks.length}
            </Badge>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            onClick={() => onAddTask(column.id)}
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            title="Add task to column"
          >
            <Plus className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditingTitle(true)}>
                <Edit2 className="h-3.5 w-3.5 mr-2" /> EDIT TITLE
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteColumn(column.id)}
                className="text-[#DC2626] focus:bg-[#DC2626]/10"
              >
                <Trash2 className="h-3.5 w-3.5 mr-2" /> DELETE COLUMN
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 min-h-[150px]">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onTaskClick={onTaskClick} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div
            onClick={() => onAddTask(column.id)}
            className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-zinc-300 hover:border-[#18181B] bg-white cursor-pointer transition-colors group"
          >
            <Plus className="h-6 w-6 text-zinc-400 group-hover:text-[#15803D] transition-colors mb-1" />
            <span className="text-xs font-bold font-heading text-zinc-400 group-hover:text-[#18181B]">
              ADD TASK HERE
            </span>
          </div>
        )}
      </div>

      {/* Column Footer: Quick Add Action */}
      <div className="pt-3 mt-3 border-t-2 border-[#18181B]">
        <Button
          onClick={() => onAddTask(column.id)}
          variant="outline"
          className="w-full text-xs"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" /> ADD TASK
        </Button>
      </div>
    </div>
  );
};
