import EmailIcon from '@mui/icons-material/Email';
import RestartIcon from '@mui/icons-material/RestartAlt';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { FullSizeCenteredFlexBox } from '@/components/styled';
import { email, messages } from '@/config';
import resetApp from '@/lib/reset-app';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { useState } from 'react';

function AppErrorBoundaryFallback() {
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(true)

  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <div className="container grid gap-8">
      <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex'>
            <Icons.warning className='mr-3' />
              There's a problem.
            </AlertDialogTitle>
            <AlertDialogDescription>
            Stay calm. There's nothing to worry about. 
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
