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
import { Column } from '../../types';
import { Columns, AlertCircle } from 'lucide-react';

const columnSchema = z.object({
  title: z.string().min(1, 'Column title is required'),
});

type ColumnFormData = z.infer<typeof columnSchema>;

interface AddColumnDialogProps {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
  onColumnCreated: (column: Column) => void;
}

export const AddColumnDialog: React.FC<AddColumnDialogProps> = ({
  boardId,
  isOpen,
  onClose,
  onColumnCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ColumnFormData>({
    resolver: zodResolver(columnSchema),
    defaultValues: { title: '' },
  });

  const onSubmit = async (data: ColumnFormData) => {
    setIsSubmitting(true);
    try {
      const newCol = await api.boards.createColumn(boardId, data);
      toast.success('New column added!');
      reset();
      onColumnCreated({ ...newCol, tasks: [] });
      onClose();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create column.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Columns className="h-5 w-5 text-[#15803D]" />
            ADD NEW COLUMN
          </DialogTitle>
          <DialogDescription>
            Columns help organize workflow stages (e.g. Backlog, In Progress, Done).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold font-heading uppercase mb-1">
              Column Title *
            </label>
            <Input
              placeholder="e.g. In Review"
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

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              CANCEL
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="default">
              {isSubmitting ? 'CREATING...' : 'ADD COLUMN'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
