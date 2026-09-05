'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AvatarInitials } from '../common/AvatarInitials';
import { api } from '../../lib/api';
import { BoardMember, BoardMemberRole } from '../../types';
import { UserPlus, Shield, AlertCircle } from 'lucide-react';

const shareSchema = z.object({
  email: z.string().email('Please enter a valid user email address'),
  role: z.enum(['MEMBER', 'OWNER']),
});

type ShareFormData = {
  email: string;
  role: BoardMemberRole;
};

interface ShareBoardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  boardTitle: string;
  members: BoardMember[];
  onMemberAdded: (member: BoardMember) => void;
}

export const ShareBoardDialog: React.FC<ShareBoardDialogProps> = ({
  isOpen,
  onClose,
  boardId,
  boardTitle,
  members,
  onMemberAdded,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShareFormData>({
    resolver: zodResolver(shareSchema),
    defaultValues: { email: '', role: 'MEMBER' },
  });

  const onSubmit = async (data: ShareFormData) => {
    setIsSubmitting(true);
    try {
      const updatedMember = await api.boards.addMember(boardId, data);
      toast.success(`User ${data.email} added to board!`);
      reset();
      onMemberAdded(updatedMember);
    } catch (err: any) {
      toast.error(err?.message || 'Could not add user. User must be registered.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#15803D]" />
            SHARE BOARD // {boardTitle}
          </DialogTitle>
          <DialogDescription>
            Invite existing registered users to collaborate on this board.
          </DialogDescription>
        </DialogHeader>

        {/* Invite Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 my-2">
          <label className="block text-xs font-bold font-heading uppercase">
            Invite Registered User by Email
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="colleague@example.com"
                error={!!errors.email}
                {...register('email')}
              />
            </div>
            <Button type="submit" disabled={isSubmitting} variant="default">
              {isSubmitting ? 'INVITING...' : 'INVITE'}
            </Button>
          </div>
          {errors.email && (
            <div className="flex items-center gap-1.5 bg-[#DC2626] text-white text-xs font-bold px-2 py-1 border-2 border-[#18181B] shadow-[2px_2px_0px_0px_#000]">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{errors.email.message}</span>
            </div>
          )}
        </form>

        {/* Members List */}
        <div className="mt-4 border-t-2 border-[#18181B] pt-4">
          <h4 className="font-heading text-xs font-bold uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>BOARD MEMBERS ({members?.length || 0})</span>
            <Shield className="h-4 w-4 text-zinc-500" />
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {members && members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2.5 bg-white border-2 border-[#18181B] shadow-[2px_2px_0px_0px_#000]"
                >
                  <div className="flex items-center gap-2.5">
                    <AvatarInitials
                      name={member.user?.name}
                      email={member.user?.email}
                      id={member.userId}
                      size="sm"
                    />
                    <div>
                      <div className="font-bold text-xs text-[#18181B]">
                        {member.user?.name || 'Registered User'}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-medium">
                        {member.user?.email}
                      </div>
                    </div>
                  </div>
                  <Badge variant={member.role === 'OWNER' ? 'default' : 'outline'}>
                    {member.role}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-xs text-zinc-500 font-medium p-2 text-center">
                No members found.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
