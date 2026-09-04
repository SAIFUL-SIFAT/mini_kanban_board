'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { AvatarInitials } from '../common/AvatarInitials';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { LayoutGrid, LogOut, Kanban, ChevronRight } from 'lucide-react';

interface NavbarProps {
  boardTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ boardTitle }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-[#18181B] bg-white px-4 py-3 shadow-[0px_4px_0px_0px_#000000]">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left: Brand Logo & Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            href="/boards"
            className="flex items-center gap-2 font-heading text-lg font-bold tracking-wider text-[#18181B] hover:text-[#15803D] transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center border-2 border-[#18181B] bg-[#15803D] text-white shadow-[2px_2px_0px_0px_#000]">
              <Kanban className="h-5 w-5" />
            </div>
            <span className="hidden sm:inline font-extrabold uppercase">KANBAN // RETRO</span>
          </Link>

          {boardTitle && (
            <div className="flex items-center gap-2 text-sm font-bold font-heading">
              <ChevronRight className="h-4 w-4 text-zinc-400" />
              <span className="bg-[#FAF6F0] border-2 border-[#18181B] px-2.5 py-0.5 shadow-[2px_2px_0px_0px_#000] text-[#18181B] truncate max-w-[180px] sm:max-w-xs">
                {boardTitle}
              </span>
            </div>
          )}
        </div>

        {/* Center / Right actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {pathname !== '/boards' && (
                <Link href="/boards">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    <LayoutGrid className="h-4 w-4 mr-1.5" />
                    ALL BOARDS
                  </Button>
                </Link>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none cursor-pointer group">
                    <AvatarInitials
                      name={user.name}
                      email={user.email}
                      id={user.id}
                      size="md"
                      className="group-hover:translate-x-[-1px] group-hover:translate-y-[-1px] transition-transform"
                    />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-bold text-[#18181B]">{user.name}</div>
                    <div className="text-xs text-zinc-500 font-normal normal-case truncate">
                      {user.email}
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => router.push('/boards')}>
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    MY BOARDS
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout} className="text-[#DC2626] focus:bg-[#DC2626]/10">
                    <LogOut className="h-4 w-4 mr-2" />
                    LOG OUT
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
};
