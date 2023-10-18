import { CallReceived, Home, ReceiptLong, Send, Wallet } from '@mui/icons-material';

import asyncComponentLoader from '@/utils/loader';

import { Pages, Routes } from './types';

const routes: Routes = {
  [Pages.Welcome]: {
    component: asyncComponentLoader(() => import('@/pages/Welcome')),
    path: '/',
    title: 'Welcome',
    icon: Home,
  },
  [Pages.CreateNewWallet]: {
    component: asyncComponentLoader(() => import('@/pages/CreateWallet')),
    path: '/create',
  },
  [Pages.Wallets]: {
    component: asyncComponentLoader(() => import('@/pages/Wallets')),
    path: '/wallets',
    title: 'Wallets',
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
    icon: CallReceived,
  },
  [Pages.Transactions]: {
    component: asyncComponentLoader(() => import('@/pages/Transactions')),
    path: '/transactions',
    title: 'Transactions',
    icon: ReceiptLong,
  },
  [Pages.NotFound]: {
    component: asyncComponentLoader(() => import('@/pages/NotFound')),
    path: '*',
  },
};

export default routes;
