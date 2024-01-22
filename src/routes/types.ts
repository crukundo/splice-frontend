import { FC } from 'react';
import { PathRouteProps } from 'react-router-dom';

import { LucideIcon } from 'lucide-react';

enum Pages {
  Landing,
  Welcome,
  CreateNewWallet,
  Wallet,
  Send,
  Receive,
}

type PathRouteCustomProps = {
  title?: string;
  component: FC;
  icon?: LucideIcon;
};

type Routes = Record<Pages, PathRouteProps & PathRouteCustomProps>;

export type { Routes };
export { Pages };
