import {
  CallReceived,
  CurrencyBitcoin,
  CurrencyBitcoinRounded,
  CurrencyBitcoinTwoTone,
  CurrencyExchange,
  CurrencyExchangeRounded,
  Receipt,
  Send,
  Wallet,
} from '@mui/icons-material';

import asyncComponentLoader from '@/lib/loader';

import { AuthPages, Pages, Routes } from './types';

const authRoutes = {
  [AuthPages.CreateNewWallet]: {
    component: asyncComponentLoader(() => import('@/pages/CreateWallet')),
    path: '/create',
  },
}

const routes: Routes = {
  // [Pages.Welcome]: {
  //   component: asyncComponentLoader(() => import('@/pages/Welcome')),
  //   path: '/',
  //   // title: 'Welcome',
  //   // icon: Home,
  // },
  [Pages.Wallet]: {
    component: asyncComponentLoader(() => import('@/pages/Wallet')),
    path: '/wallet',
    title: 'Wallet',
    icon: Wallet,
  },
  // [Pages.Send]: {
  //   component: asyncComponentLoader(() => import('@/pages/Send')),
  //   path: '/send',
  //   title: 'Send',
  //   icon: Send,
  // },
  // [Pages.CrossBorder]: {
  //   component: asyncComponentLoader(() => import('@/pages/Send/CrossBorder')),
  //   path: '/send/cross',
  //   // title: 'Cross Border Settlement',
  //   // icon: Code,
  // },
  // [Pages.CreateInvoice]: {
  //   component: asyncComponentLoader(() => import('@/pages/CreateInvoice')),
  //   path: '/create-invoice',
  //   title: 'Create Invoice',
  //   icon: Receipt,
  // },
  // [Pages.BuyBitcoin]: {
  //   component: asyncComponentLoader(() => import('@/pages/BuyBitcoin')),
  //   path: '/buy-btc',
  //   title: 'Buy Bitcoin',
  //   icon: CurrencyBitcoin,
  // },
  // [Pages.SellBitcoin]: {
  //   component: asyncComponentLoader(() => import('@/pages/SellBitcoin')),
  //   path: '/sell-btc',
  //   title: 'Sell Bitcoin',
  //   icon: CurrencyBitcoinTwoTone,
  // },
  // [Pages.NotFound]: {
  //   component: asyncComponentLoader(() => import('@/pages/NotFound')),
  //   path: '*',
  // },
};

export {routes, authRoutes};
