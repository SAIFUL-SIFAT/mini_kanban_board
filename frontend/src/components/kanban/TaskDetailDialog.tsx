'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Task } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AvatarInitials } from '../common/AvatarInitials';
import { api } from '../../lib/api';
import { Clock, Trash2, Edit2, Check, Calendar, AlertCircle } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDetailDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: (updatedTask: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({
  task,
  isOpen,
  onClose,
  onTaskUpdated,
  onTaskDeleted,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
      });
      setIsEditing(false);
    }
  }, [task, reset]);

  if (!task) return null;

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      const updated = await api.tasks.update(task.id, {
        title: data.title,
        description: data.description,
      });
      toast.success('Task updated!');
      onTaskUpdated(updated);
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setIsDeleting(true);
    try {
      await api.tasks.delete(task.id);
      toast.success('Task deleted');
      onTaskDeleted(task.id);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete task.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-6">
            {isEditing ? (
              <DialogTitle>EDIT TASK</DialogTitle>
            ) : (
              <DialogTitle className="leading-snug">{task.title}</DialogTitle>
            )}
          </div>
          <DialogDescription>
            Task details, assignee details, and audit history.
          </DialogDescription>
        </DialogHeader>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 my-2">
            <div>
              <label className="block text-xs font-bold font-heading uppercase mb-1">
                Title *
              </label>
              <Input error={!!errors.title} {...register('title')} />
              {errors.title && (
                <div className="mt-1.5 flex items-center gap-1.5 bg-[#DC2626] text-white text-xs font-bold px-2 py-1 border-2 border-[#18181B] shadow-[2px_2px_0px_0px_#000]">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.title.message}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold font-heading uppercase mb-1">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full border-2 border-[#18181B] bg-white p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000]"
                {...register('description')}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                CANCEL
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="default">
                <Check className="h-4 w-4 mr-1.5" />
                {isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-5 my-2">
            {/* Description section */}
            <div className="border-2 border-[#18181B] bg-white p-4 shadow-[3px_3px_0px_0px_#000]">
              <h4 className="text-xs font-bold font-heading uppercase text-zinc-500 mb-1">
                Description
              </h4>
              {task.description ? (
                <p className="text-sm font-medium text-[#18181B] whitespace-pre-wrap">
                  {task.description}
                </p>
              ) : (
                <p className="text-xs text-zinc-400 italic font-medium">
                  No description provided for this task.
                </p>
              )}
            </div>

            {/* Meta details grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="border-2 border-[#18181B] bg-[#FAF6F0] p-3 shadow-[2px_2px_0px_0px_#000]">
                <div className="text-zinc-500 font-bold uppercase mb-1 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Created Date
                </div>
                <div className="font-bold text-[#18181B]">
                  {new Date(task.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="border-2 border-[#18181B] bg-[#FAF6F0] p-3 shadow-[2px_2px_0px_0px_#000]">
                <div className="text-zinc-500 font-bold uppercase mb-1 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Last Updated
                </div>
                <div className="font-bold text-[#18181B]">
                  {new Date(task.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Assignee section */}
            <div className="flex items-center justify-between border-2 border-[#18181B] bg-white p-3 shadow-[2px_2px_0px_0px_#000]">
              <span className="text-xs font-bold font-heading uppercase text-zinc-500">Assignee</span>
              <div className="flex items-center gap-2">
                <AvatarInitials
                  name={task.assignee?.name}
                  email={task.assignee?.email}
                  id={task.assignee?.id}
                  size="sm"
                />
                <span className="text-xs font-bold text-[#18181B]">
                  {task.assignee?.name || 'Unassigned'}
                </span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={isDeleting}
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-1.5" />
            {isDeleting ? 'DELETING...' : 'DELETE TASK'}
          </Button>

          {!isEditing && (
            <Button type="button" variant="outline" onClick={() => setIsEditing(true)} size="sm">
              <Edit2 className="h-4 w-4 mr-1.5" /> EDIT TASK
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
