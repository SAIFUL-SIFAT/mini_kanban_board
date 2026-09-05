'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { AuthGuard } from '../../components/auth/AuthGuard';
import { BoardCard } from '../../components/boards/BoardCard';
import { CreateBoardDialog } from '../../components/boards/CreateBoardDialog';
import { EmptyState } from '../../components/common/EmptyState';
import { Skeleton } from '../../components/ui/skeleton';
import { Button } from '../../components/ui/button';
import { Board } from '../../types';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import { Plus, LayoutGrid, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function BoardsPage() {
  const { user } = useAuthStore();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchBoards = async () => {
    setIsLoading(true);
    try {
      const data = await api.boards.getAll();
      setBoards(data);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load boards.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleBoardCreated = (newBoard: Board) => {
    setBoards((prev) => [newBoard, ...prev]);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#F5F1E8] flex flex-col font-body">
        <Navbar />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8">
          {/* Dashboard Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b-2 border-[#18181B]">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase text-[#18181B] tracking-tight">
                MY BOARDS // DASHBOARD
              </h1>
              <p className="text-sm font-medium text-zinc-600 mt-1">
                Manage your owned kanban boards and shared team workspaces.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={fetchBoards} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1.5" /> REFRESH
              </Button>

              <Button onClick={() => setIsCreateOpen(true)} variant="default">
                <Plus className="h-4 w-4 mr-1.5" /> NEW BOARD
              </Button>
            </div>
          </div>

          {/* Boards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          ) : boards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* New Board Card Trigger */}
              <div
                onClick={() => setIsCreateOpen(true)}
                className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-[#18181B] bg-white hover:bg-[#FAF6F0] shadow-[4px_4px_0px_0px_#000000] cursor-pointer transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000000] group min-h-[190px]"
              >
                <div className="p-3 bg-[#15803D] text-white border-2 border-[#18181B] shadow-[2px_2px_0px_0px_#000] mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-bold text-base uppercase text-[#18181B]">
                  CREATE NEW BOARD
                </h3>
                <p className="text-xs text-zinc-500 font-medium mt-1">
                  Start a new project board
                </p>
              </div>

              {boards.map((board) => (
                <BoardCard key={board.id} board={board} currentUserId={user?.id} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="boards"
              title="NO BOARDS FOUND"
              description="You don't have any boards yet. Create your first kanban board to start organizing columns and tasks."
              actionLabel="CREATE YOUR FIRST BOARD"
              onAction={() => setIsCreateOpen(true)}
            />
          )}
        </main>

        <CreateBoardDialog
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onBoardCreated={handleBoardCreated}
        />
      </div>
    </AuthGuard>
  );
}
