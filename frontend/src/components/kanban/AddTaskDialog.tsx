'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { api } from '../../lib/api';
import { Task } from '../../types';
import { Plus, AlertCircle } from 'lucide-react';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface AddTaskDialogProps {
  columnId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

export const AddTaskDialog: React.FC<AddTaskDialogProps> = ({
  columnId,
  isOpen,
  onClose,
  onTaskCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: '', description: '' },
  });

  if (!columnId) return null;

  const onSubmit = async (data: TaskFormData) => {
    setIsSubmitting(true);
    try {
      const newTask = await api.columns.createTask(columnId, data);
      toast.success('Task added to column!');
      reset();
      onTaskCreated(newTask);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create task.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-[#15803D]" />
            NEW TASK
          </DialogTitle>
          <DialogDescription>
            Add a new task card to this column.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold font-heading uppercase mb-1">
              Task Title *
            </label>
            <Input
              placeholder="e.g. Implement JWT Auth refresh"
              error={!!errors.title}
              {...register('title')}
              autoFocus
            />
            {errors.title && (
              <div className="mt-1.5 flex items-center gap-1.5 bg-[#DC2626] text-white text-xs font-bold px-2 py-1 border-2 border-[#18181B] shadow-[2px_2px_0px_0px_#000]">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{errors.title.message}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold font-heading uppercase mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Add token expiration check and inline error banner [HIGH]"
              className="w-full border-2 border-[#18181B] bg-white p-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black shadow-[2px_2px_0px_0px_#000]"
              {...register('description')}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              CANCEL
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="default">
              {isSubmitting ? 'ADDING...' : 'ADD TASK'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
