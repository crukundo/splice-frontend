import {
  Receipt,
  Send,
  Wallet,
} from '@mui/icons-material';

import asyncComponentLoader from '@/lib/loader';

import { Pages, Routes } from './types';

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
    icon: Wallet,
  },
  [Pages.Send]: {
    component: asyncComponentLoader(() => import('@/pages/Send')),
    path: '/send',
    title: 'Send',
    icon: Send,
  },
  [Pages.Receive]: {
    component: asyncComponentLoader(() => import('@/pages/Receive')),
    path: '/receive',
    title: 'Receive',
    icon: Receipt,
  },
  // [Pages.NotFound]: {
  //   component: asyncComponentLoader(() => import('@/pages/NotFound')),
  //   path: '*',
  // },
};

export {routes};
