import { useState } from 'react';

import resetApp from '@/lib/reset-app';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { Icons } from '@/components/icons';

function AppErrorBoundaryFallback() {
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(true);

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <div className="container grid gap-8">
        <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex">
                <Icons.warning className="mr-3" />
                {`There's a problem.`}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {`Stay calm. There's nothing to worry about.`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={resetApp}>
                <span>Reload Splice</span>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default AppErrorBoundaryFallback;
