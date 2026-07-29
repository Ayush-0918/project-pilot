'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';
import { RotateCcw, LogOut } from 'lucide-react';
import { restoreUserAccount } from '@/app/actions/user';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

export function RestoreAccountPrompt() {
  const router = useRouter();
  const { signOut } = useClerk();
  const [isRestoring, setIsRestoring] = useState(false);

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await restoreUserAccount();
      toast.success('Welcome back! Your account has been restored.');
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Failed to restore your account. Please try again.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {}
    router.push('/');
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <Card hoverEffect={false} className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Welcome back — restore your account?</CardTitle>
          <CardDescription className="text-xs">
            Your account is scheduled for deletion but is still recoverable. Accounts are
            permanently erased 30 days after deletion and cannot be restored after that.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-1">
          <Button
            variant="glow"
            className="w-full h-11 text-xs"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={handleRestore}
            disabled={isRestoring}
          >
            {isRestoring ? 'Restoring...' : 'Restore My Account'}
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 text-xs"
            leftIcon={<LogOut className="w-4 h-4" />}
            onClick={handleSignOut}
          >
            Not now, sign me out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}