import isMobile from '@/lib/is-mobile';

import { DashboardConfig, Notifications } from '@/lib/interfaces';

const title = 'Splice Africa';

const email = 'support@splice.africa';

const repository = 'https://github.com/splice-africa';

const apiUrl = 'https://splice.africa/api';

const storedWallet = 'splice-wallet';

const messages = {
  app: {
    crash: {
      title: 'Oooops... Sorry, I guess, something went wrong. You can:',
      options: {
        email: `contact us on this email - ${email}`,
        reset: 'press here to reset the application',
      },
    },
  },
  loader: {
    fail: 'Hmmmmm, there is something wrong with this component loading process... Maybe trying later would be the best idea',
  },
  images: {
    failed: 'something went wrong during image loading :(',
  },
  404: 'Hey bro? What are you looking for?',
};

const dateFormat = 'MMMM DD, YYYY';

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

const loader = {
  // no more blinking in your app
  delay: 300, // if your asynchronous process is finished during 300 milliseconds you will not see the loader at all
  minimumLoading: 700, // but if it appears, it will stay for at least 700 milliseconds
};

const defaultMetaTags = {
  image: '/cover.png',
  description: 'Starter kit for modern web applications',
};
const giphy404 = 'https://giphy.com/embed/xTiN0L7EW5trfOvEk0';

const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Welcome",
      href: "/",
    },
    {
      title: "FAQ",
      href: "/faq",
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Wallet",
      href: "/wallet",
      icon: "wallet",
    },
    {
      title: "Send",
      href: "/send",
      icon: "send",
    },
    {
      title: "Receive",
      href: "/receive",
      icon: "invoices",
    },
    {
      title: "Buy & Sell Bitcoin",
      href: "/ramp",
      icon: "bitcoin",
    },
    {
      title: "Settings",
      href: "/settings",
      icon: "settings",
    },
  ],
}


export {
  loader,
  notifications,
  dateFormat,
  messages,
  repository,
  email,
  title,
  defaultMetaTags,
  giphy404,
  apiUrl,
  storedWallet,
  dashboardConfig
};
