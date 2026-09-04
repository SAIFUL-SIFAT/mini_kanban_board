'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/useAuthStore';
import { AlertCircle, LogIn, UserPlus } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
  onSuccessRedirect?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
  onSuccessRedirect = true,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(defaultTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const res = await api.auth.login(data);
      setAuth(res.user, res.access_token);
      toast.success(`Welcome back, ${res.user.name}!`);
      onClose();
      if (onSuccessRedirect && typeof window !== 'undefined') {
        window.location.href = '/boards';
      }
    } catch (err: any) {
      toast.error(err?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit = async (data: SignupFormData) => {
    setIsSubmitting(false);
    setIsSubmitting(true);
    try {
      const res = await api.auth.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setAuth(res.user, res.access_token);
      toast.success('Account created successfully!');
      onClose();
      if (onSuccessRedirect && typeof window !== 'undefined') {
        window.location.href = '/boards';
      }
    } catch (err: any) {
      toast.error(err?.message || 'Registration failed. Email may already be registered.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>ACCOUNT ACCESS</DialogTitle>
          <DialogDescription>
            Log in to manage your boards or create a new registered user account.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'login' | 'signup')}>
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="login" className="flex items-center justify-center gap-2">
              <LogIn className="h-4 w-4" /> LOGIN
            </TabsTrigger>
            <TabsTrigger value="signup" className="flex items-center justify-center gap-2">
              <UserPlus className="h-4 w-4" /> SIGN UP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-bold font-heading uppercase mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="alex@example.com"
                  error={!!loginForm.formState.errors.email}
                  {...loginForm.register('email')}
                />
                {loginForm.formState.errors.email && (
                  <div className="mt-1.5 flex items-center gap-1.5 bg-[#DC2626] text-white text-xs font-bold px-2 py-1 border-2 border-[#18181B] shadow-[2px_2px_0px_0px_#000]">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{loginForm.formState.errors.email.message}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold font-heading uppercase mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  error={!!loginForm.formState.errors.password}
                  {...loginForm.register('password')}
                />
                {loginForm.formState.errors.password && (
                  <div className="mt-1.5 flex items-center gap-1.5 bg-[#DC2626] text-white text-xs font-bold px-2 py-1 border-2 border-[#18181B] shadow-[2px_2px_0px_0px_#000]">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{loginForm.formState.errors.password.message}</span>
                  </div>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full mt-2" variant="default">
                {isSubmitting ? 'LOGGING IN...' : 'LOG IN TO DASHBOARD'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-3">
              <div>
                <label className="block text-xs font-bold font-heading uppercase mb-1">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Saiful Alam"
                  error={!!signupForm.formState.errors.name}
                  {...signupForm.register('name')}
                />
                {signupForm.formState.errors.name && (
                  <div className="mt-1 flex items-center gap-1.5 bg-[#DC2626] text-white text-xs font-bold px-2 py-1 border-2 border-[#18181B] shadow-[2px_2px_0px_0px_#000]">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{signupForm.formState.errors.name.message}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold font-heading uppercase mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="saiful@example.com"
                  error={!!signupForm.formState.errors.email}
                  {...signupForm.register('email')}
                />
                {signupForm.formState.errors.email && (
                  <div className="mt-1 flex items-center gap-1.5 bg-[#DC2626] text-white text-xs font-bold px-2 py-1 border-2 border-[#18181B] shadow-[2px_2px_0px_0px_#000]">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{signupForm.formState.errors.email.message}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold font-heading uppercase mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  error={!!signupForm.formState.errors.password}
                  {...signupForm.register('password')}
                />
                {signupForm.formState.errors.password && (
                  <div className="mt-1 flex items-center gap-1.5 bg-[#DC2626] text-white text-xs font-bold px-2 py-1 border-2 border-[#18181B] shadow-[2px_2px_0px_0px_#000]">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{signupForm.formState.errors.password.message}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold font-heading uppercase mb-1">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  error={!!signupForm.formState.errors.confirmPassword}
                  {...signupForm.register('confirmPassword')}
                />
                {signupForm.formState.errors.confirmPassword && (
                  <div className="mt-1 flex items-center gap-1.5 bg-[#DC2626] text-white text-xs font-bold px-2 py-1 border-2 border-[#18181B] shadow-[2px_2px_0px_0px_#000]">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{signupForm.formState.errors.confirmPassword.message}</span>
                  </div>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full mt-2" variant="secondary">
                {isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
