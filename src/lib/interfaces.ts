import { Icons } from '@/components/icons';

import type { SnackbarProps } from 'notistack';

export interface BalanceProps {
  currency: string;
  amount: number;
}

export interface WalletRequestResponse {
  id: string;
  lightning_address: string;
  withdrawal_fee: number;
  balances: BalanceProps[];
  preferred_fiat_currency: string;
}

export interface CreateWalletRequestBody {
  phoneNumber?: string;
  withdrawalFee?: number;
  preferredFiatCurrency?: string;
}

export interface CreateWalletResponse {
  id: string;
  lightning_address: string;
  preferred_fiat_currency: string;
  withdrawal_fee: number;
  balances: BalanceProps[];
}

export interface CreateInvoiceRequestBody {
  walletId?: string;
  destionationAddress?: string;
  amount?: number;
  currency?: string;
}

export interface CreateInvoiceResponse {
  invoice: string;
  amount: number;
  currency: string;
}

export interface PayInvoiceRequestBody {
  sourceAddress?: string;
  amount?: number;
  currency?: string;
  destinationAddress?: string;
  tapdAddress?: string;
}

export interface PayInvoiceResponse {
  proofOfPayment: string;
  amount: number;
  currency: string;
  destinationAddress: string;
}

export interface CalculateRampBody {
  source: string; // currency
  destination: string; // currency
  amount?: number; // in source currency
  rate?: number;
}

export interface CalculateRampResponse {
  amount: number;
  currency: string; // BTC
}

export interface GenerateRampInvoiceBody {
  amount?: number;
  currency?: string;
}

export interface GenerateRampInvoiceResponse {
  destinationAddress: string;
}

export interface PayRampInvoiceBody {
  destinationAddress: string;
  amount?: number;
  currency?: string;
  lightningAddress?: string;
}

export interface PayRampInvoiceResponse {
  paymentId: string;
  status: string;
}

export type Wallet = {
  alias?: string;
  avatar?: string; // robohash of wallet uuid?
  id: string;
  lnAddress: string;
  fiatCurrency: string;
  withdrawFee: string;
};

export interface PaymentResponse {
  id: string;
  amount: number;
  currency: string;
  timestamp: string;
  payment_status: string; // enum actually
  sender_wallet: WalletRequestResponse;
  receiver_wallet: WalletRequestResponse;
  sent_payment: boolean;
  receive_payment: boolean;
  fees: number;
}
export interface WalletTransactionsResponse {
  payments: PaymentResponse[];
}

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SidebarNavItem = {
  title: string;
  href: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavItem[];
    }
);

export type DashboardConfig = {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
};

export type Notifications = {
  options: SnackbarProps;
  maxSnack: number;
};
