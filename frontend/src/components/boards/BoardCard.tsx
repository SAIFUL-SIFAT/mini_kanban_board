'use client';

import React from 'react';
import Link from 'next/link';
import { Board } from '../../types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Badge } from '../ui/badge';
import { AvatarInitials } from '../common/AvatarInitials';
import { ArrowRight, Users, Columns, CheckSquare } from 'lucide-react';

interface BoardCardProps {
  board: Board;
  currentUserId?: string;
}

export const BoardCard: React.FC<BoardCardProps> = ({ board, currentUserId }) => {
  const memberCount = board.members?.length || 1;
  const columnCount = board.columns?.length || 0;
  const totalTasks = board.columns?.reduce((acc, col) => acc + (col.tasks?.length || 0), 0) || 0;
  const isOwner = board.ownerId ? board.ownerId === currentUserId : true;

  return (
    <Link href={`/boards/${board.id}`} className="block h-full">
      <Card hoverable className="h-full flex flex-col justify-between group cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="group-hover:text-[#15803D] transition-colors line-clamp-1">
              {board.title}
            </CardTitle>
            <Badge variant={isOwner ? 'default' : 'secondary'}>
              {isOwner ? 'OWNER' : 'SHARED'}
            </Badge>
          </div>
          {board.description && (
            <CardDescription className="line-clamp-2 mt-1">
              {board.description}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="py-4">
          <div className="flex items-center gap-4 text-xs font-bold font-heading text-zinc-600">
            <div className="flex items-center gap-1.5 bg-[#FAF6F0] px-2 py-1 border border-[#18181B]">
              <Columns className="h-3.5 w-3.5 text-[#15803D]" />
              <span>{columnCount} COLUMNS</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#FAF6F0] px-2 py-1 border border-[#18181B]">
              <CheckSquare className="h-3.5 w-3.5 text-[#D97706]" />
              <span>{totalTasks} TASKS</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between mt-auto">
          {/* Member Avatar Stack */}
          <div className="flex items-center -space-x-2 overflow-hidden">
            {board.members && board.members.length > 0 ? (
              board.members.slice(0, 4).map((member) => (
                <AvatarInitials
                  key={member.id}
                  name={member.user?.name}
                  email={member.user?.email}
                  id={member.userId}
                  size="sm"
                  shape="circle"
                  className="border-2 border-[#18181B]"
                />
              ))
            ) : (
              <div className="flex items-center gap-1 text-xs font-bold text-zinc-500">
                <Users className="h-3.5 w-3.5" /> {memberCount} member
              </div>
            )}
            {board.members && board.members.length > 4 && (
              <div className="h-7 w-7 rounded-full bg-[#18181B] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
                +{board.members.length - 4}
              </div>
            )}
          </div>

          <div className="flex items-center text-xs font-bold font-heading uppercase text-[#18181B] group-hover:text-[#15803D] group-hover:translate-x-1 transition-all">
            OPEN <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
