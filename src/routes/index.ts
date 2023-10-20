import { CallReceived, Code, ReceiptLong, Send, Wallet } from '@mui/icons-material';

import asyncComponentLoader from '@/utils/loader';

import { Pages, Routes } from './types';

const routes: Routes = {
  [Pages.Welcome]: {
    component: asyncComponentLoader(() => import('@/pages/Welcome')),
    path: '/',
    // title: 'Welcome',
    // icon: Home,
  },
  [Pages.CreateNewWallet]: {
    component: asyncComponentLoader(() => import('@/pages/CreateWallet')),
    path: '/create',
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
  [Pages.CrossBorder]: {
    component: asyncComponentLoader(() => import('@/pages/Send/CrossBorder')),
    path: '/send/cross',
    // title: 'Cross Border Settlement',
    // icon: Code,
  },
  [Pages.Receive]: {
    component: asyncComponentLoader(() => import('@/pages/Receive')),
    path: '/receive',
    title: 'Receive',
    icon: CallReceived,
  },
  [Pages.NotFound]: {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
};

export default routes;
