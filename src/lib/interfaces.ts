
import type { SharedProps } from 'notistack';
import { Icons } from "@/components/icons"
export interface BalanceProps {
  currency: string;
  amount: number;
}

export interface WalletRequestResponse {
  id: string;
  lightning_address: string;
  withdrawal_fee: number;
  balances: BalanceProps[];
}

export interface CreateWalletRequestBody {
  phoneNumber?: string;
  withdrawalFee?: number;
  preferredFiatCurrency?: string;
}

export interface CreateWalletResponse {
  id: string
  lightning_address: string
  preferred_fiat_currency: string
  withdrawal_fee: number
  balances: BalanceProps[]
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
  alias?: string
  avatar?: string // robohash of wallet uuid?
  id: string
  lnAddress: string
  fiatCurrency: string
  withdrawFee: string
}


export interface WalletTransactionsResponse {
  payments: []
}

export type Notifications = {
  options: SharedProps;
  maxSnack: number;
};

export type NavItem = {
  title: string
  href: string
  disabled?: boolean
}

export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
      href: string
      items?: never
    }
  | {
      href?: string
      items: NavItem[]
    }
)


export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}