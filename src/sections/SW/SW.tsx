import { useCallback, useEffect, useRef } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { toast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import resetApp from '@/lib/reset-app';

function SW() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const close = useCallback(() => {
    setOfflineReady(false);
    setNeedRefresh(false);

  }, [setOfflineReady, setNeedRefresh]);

  useEffect(() => {
    if (offlineReady) {
      toast({
        title: "Offline mode",
        description: "Splice is ready to work offline.",
      })
    } else if (needRefresh) {
     
      toast({
        title: "Freshly squeezed!",
        description: "Splice was just updated! Reload",
        action: (
          <ToastAction onClick={resetApp} altText="Update">Reload</ToastAction>
        ),
      })
    }
  }, [close, needRefresh, offlineReady, updateServiceWorker]);

  return null;
}

export default SW;
