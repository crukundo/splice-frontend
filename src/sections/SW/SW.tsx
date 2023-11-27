import { useCallback, useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button, buttonVariants } from '@/components/ui/button';

import useNotifications from '@/store/notifications';
import type { SnackbarKey } from 'notistack';
import { useRegisterSW } from 'virtual:pwa-register/react';

// TODO (Suren): this should be a custom hook :)
function SW() {
  const [, notificationsActions] = useNotifications();
  const notificationKey = useRef<SnackbarKey | null>(null);
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const close = useCallback(() => {
    setOfflineReady(false);
    setNeedRefresh(false);

    if (notificationKey.current) {
      notificationsActions.close(notificationKey.current);
    }
  }, [setOfflineReady, setNeedRefresh, notificationsActions]);

  useEffect(() => {
    if (offlineReady) {
      notificationsActions.push({
        options: {
          autoHideDuration: 4500,
          content: (
            <Alert>
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>Splice is ready to work offline.</AlertDescription>
            </Alert>
          ),
        },
      });
    } else if (needRefresh) {
      notificationKey.current = notificationsActions.push({
        message: 'Freshly squeezed. Click reload to update',
        options: {
          variant: 'default',
          persist: true,
          action: (
            <>
              <Button
                className={cn(buttonVariants({ variant: 'secondary', className: 'mr-2' }))}
                onClick={() => updateServiceWorker(true)}
              >
                Reload
              </Button>
              <Button className={cn(buttonVariants({ variant: 'ghost' }))} onClick={close}>
                Close
              </Button>
            </>
          ),
        },
      });
    }
  }, [close, needRefresh, offlineReady, notificationsActions, updateServiceWorker]);

  return null;
}

export default SW;
