import { DashboardConfig, Notifications } from '@/lib/interfaces';
import isMobile from '@/lib/is-mobile';

const title = 'Splice Africa';

const email = 'support@splice.africa';

const repository = 'https://github.com/splice-africa';

const apiUrl = 'https://splice.africa/api';

const storedWallet = 'splice-wallet';

const defaultMetaTags = {
  image: '', // add default og cover
  description: "Connecting Africa via Bitcoin's globally accessible liquidity network",
};

const loader = {
  // no more blinking in your app
  delay: 300, // if your asynchronous process is finished during 300 milliseconds you will not see the loader at all
  minimumLoading: 700, // but if it appears, it will stay for at least 700 milliseconds
};

const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: '',
      href: '/',
    },
  ],
  sidebarNav: [
    {
      title: 'Wallet',
      href: '/wallet',
      icon: 'wallet',
    },
    {
      title: 'Send',
      href: '/send',
      icon: 'send',
    },
    {
      title: 'Claim Payment',
      href: '/claim',
      icon: 'invoices',
    },
  ],
};

const notifications: Notifications = {
  options: {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'left',
    },
    autoHideDuration: 6000,
  },
  maxSnack: isMobile ? 3 : 4,
};

export {
  repository,
  email,
  title,
  defaultMetaTags,
  loader,
  apiUrl,
  storedWallet,
  dashboardConfig,
  notifications,
};
