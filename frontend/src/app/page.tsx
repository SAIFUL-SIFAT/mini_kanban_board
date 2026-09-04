'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';
import { AuthModal } from '../components/auth/AuthModal';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Kanban,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
} from 'lucide-react';

function LandingPageContent() {
  const { isAuthenticated, initialize } = useAuthStore();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const searchParams = useSearchParams();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    const authParam = searchParams.get('auth');
    if (authParam === 'required' || authParam === 'expired') {
      setAuthTab('login');
      setAuthModalOpen(true);
    }
  }, [searchParams]);

  const openAuth = (tab: 'login' | 'signup') => {
    setAuthTab(tab);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] flex flex-col font-body selection:bg-[#15803D] selection:text-white">
      {/* Header / Brand Topbar */}
      <header className="w-full border-b-2 border-[#18181B] bg-white px-6 py-4 shadow-[0px_4px_0px_0px_#000000]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-[#18181B] bg-[#15803D] text-white shadow-[3px_3px_0px_0px_#000]">
              <Kanban className="h-6 w-6" />
            </div>
            <span className="font-heading text-xl font-black uppercase tracking-wider text-[#18181B]">
              KANBAN // RETRO
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/boards">
                <Button variant="default" size="default">
                  GO TO BOARDS <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Button variant="outline" onClick={() => openAuth('login')}>
                  LOG IN
                </Button>
                <Button variant="default" onClick={() => openAuth('signup')}>
                  SIGN UP
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-16 px-6 border-b-2 border-[#18181B] bg-[#FAF6F0]">
          <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <Badge variant="secondary" className="px-3 py-1 text-sm">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" /> WEBBRIKS ASSESSMENT EDITION
              </Badge>

              <h1 className="font-heading text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#18181B] leading-none">
                DRAG. DROP. <br />
                <span className="bg-[#15803D] text-white px-2 py-1 inline-block shadow-[4px_4px_0px_0px_#000] my-1">
                  SHIP FASTER.
                </span>
              </h1>

              <p className="text-lg text-zinc-700 font-medium max-w-2xl">
                Organize boards, invite your team, and move tasks exactly where they belong — with precision drag-and-drop, built on NestJS, Next.js, and a distinct retro interface.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                {isAuthenticated ? (
                  <Link href="/boards">
                    <Button variant="default" size="lg" className="text-base">
                      LAUNCH DASHBOARD <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Button variant="default" size="lg" onClick={() => openAuth('signup')} className="text-base">
                      GET STARTED FREE <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => openAuth('login')} className="text-base">
                      DEMO LOGIN
                    </Button>
                  </>
                )}
              </div>

              <div className="pt-6 border-t-2 border-[#18181B]/10 grid grid-cols-3 gap-4 text-xs font-bold font-heading uppercase text-zinc-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                  <span>DND-KIT DRAG & DROP</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                  <span>MEMBER ACCESS CONTROL</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#15803D]" />
                  <span>TYPED NESTJS API</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Card Preview */}
            <div className="lg:col-span-5">
              <Card className="p-6 space-y-4 bg-white relative">
                <div className="flex items-center justify-between pb-3 border-b-2 border-[#18181B]">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-[#DC2626] border border-[#18181B]" />
                    <div className="h-3 w-3 bg-[#D97706] border border-[#18181B]" />
                    <div className="h-3 w-3 bg-[#15803D] border border-[#18181B]" />
                  </div>
                  <Badge variant="outline">LIVE DEMO PREVIEW</Badge>
                </div>

                <div className="space-y-3">
                  <div className="border-2 border-[#18181B] bg-[#FAF6F0] p-3 shadow-[3px_3px_0px_0px_#000]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-bold text-xs">BACKLOG</span>
                      <Badge variant="danger">HIGH</Badge>
                    </div>
                    <p className="text-sm font-bold">Implement Drag-and-Drop Task Reordering</p>
                    <p className="text-xs text-zinc-600 mt-1">Cross-column index recalculation and optimistic state update</p>
                  </div>

                  <div className="border-2 border-[#18181B] bg-white p-3 shadow-[3px_3px_0px_0px_#000] rotate-1 translate-x-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-bold text-xs text-[#15803D]">IN PROGRESS</span>
                      <Badge variant="secondary">MEDIUM</Badge>
                    </div>
                    <p className="text-sm font-bold">Share Board Access Control Modal</p>
                    <p className="text-xs text-zinc-600 mt-1">Invite registered users by email with RBAC permissions</p>
                  </div>
                </div>

                <div className="pt-2 text-center text-xs font-bold font-heading text-zinc-500 uppercase">
                  Click Log In / Sign Up to test full app features
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-16 px-6 mx-auto max-w-7xl">
          <h2 className="font-heading text-3xl font-black uppercase text-center mb-12 text-[#18181B]">
            CORE ARCHITECTURE FEATURES
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hoverable className="p-6 space-y-3">
              <div className="h-12 w-12 flex items-center justify-center border-2 border-[#18181B] bg-[#15803D] text-white shadow-[3px_3px_0px_0px_#000]">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold uppercase">Optimistic DND Reordering</h3>
              <p className="text-sm text-zinc-600 font-medium">
                Reorder tasks within columns or drag across columns to precise index positions with immediate local state rendering and automatic rollback.
              </p>
            </Card>

            <Card hoverable className="p-6 space-y-3">
              <div className="h-12 w-12 flex items-center justify-center border-2 border-[#18181B] bg-[#D97706] text-white shadow-[3px_3px_0px_0px_#000]">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold uppercase">Multi-User Board Sharing</h3>
              <p className="text-sm text-zinc-600 font-medium">
                Invite registered users to collaborate on boards. Strict role permissions (OWNER vs MEMBER) enforced via NestJS BoardAccessGuard.
              </p>
            </Card>

            <Card hoverable className="p-6 space-y-3">
              <div className="h-12 w-12 flex items-center justify-center border-2 border-[#18181B] bg-[#2563EB] text-white shadow-[3px_3px_0px_0px_#000]">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold uppercase">Neobrutalist Retro Tokens</h3>
              <p className="text-sm text-zinc-600 font-medium">
                Distinctive visual personality featuring 2px crisp black borders, offset hard shadows, Space Grotesk typography, and retro error chips.
              </p>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#18181B] bg-white py-6 px-6 text-center text-xs font-bold font-heading uppercase text-zinc-600">
        MINI KANBAN BOARD // WEBBRIKS TECHNICAL ASSESSMENT // BUILT WITH NEXT.JS & NESTJS
      </footer>

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authTab}
      />
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F1E8]" />}>
      <LandingPageContent />
    </Suspense>
  );
}
