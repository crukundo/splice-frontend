import asyncComponentLoader from '@/lib/loader';

import { Pages, Routes } from './types';
import { ArrowDownRightIcon, ArrowUpRightIcon, WalletIcon } from 'lucide-react';

const routes: Routes = {
  [Pages.Welcome]: {
    component: asyncComponentLoader(() => import('@/pages/Welcome')),
    path: '/',
  },
  [Pages.CreateNewWallet]: {
    component: asyncComponentLoader(() => import('@/pages/CreateWallet')),
    path: '/create-wallet',
  },
  [Pages.Wallet]: {
    component: asyncComponentLoader(() => import('@/pages/Wallet')),
    path: '/wallet',
    title: 'Wallet',
    icon: WalletIcon,
  },
  [Pages.Send]: {
    component: asyncComponentLoader(() => import('@/pages/Send')),
    path: '/send',
    title: 'Send',
    icon: ArrowUpRightIcon,
  },
  [Pages.Receive]: {
    component: asyncComponentLoader(() => import('@/pages/Receive')),
    path: '/claim',
    title: 'Claim Payment',
    icon: ArrowDownRightIcon,
  },
};

export { routes };
