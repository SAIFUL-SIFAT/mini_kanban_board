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
import { Board } from '../../types';
import { AlertCircle, LayoutGrid } from 'lucide-react';

const createBoardSchema = z.object({
  title: z.string().min(2, 'Board title must be at least 2 characters'),
  description: z.string().optional(),
});

type CreateBoardFormData = z.infer<typeof createBoardSchema>;

interface CreateBoardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onBoardCreated: (board: Board) => void;
}

export const CreateBoardDialog: React.FC<CreateBoardDialogProps> = ({
  isOpen,
  onClose,
  onBoardCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBoardFormData>({
    resolver: zodResolver(createBoardSchema),
    defaultValues: { title: '', description: '' },
  });

  const onSubmit = async (data: CreateBoardFormData) => {
    setIsSubmitting(true);
    try {
      const newBoard = await api.boards.create(data);
      toast.success('New board created!');
      reset();
      onBoardCreated(newBoard);
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create board.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-[#15803D]" />
            CREATE NEW BOARD
          </DialogTitle>
          <DialogDescription>
            Give your board a clear title and description to organize tasks with your team.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold font-heading uppercase mb-1">
              Board Title *
            </label>
            <Input
              placeholder="e.g. Q4 Sprint Planning"
              error={!!errors.title}
              {...register('title')}
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
            <Input
              placeholder="e.g. Tracking features, bug fixes, and documentation"
              {...register('description')}
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              CANCEL
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="default">
              {isSubmitting ? 'CREATING...' : 'CREATE BOARD'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
