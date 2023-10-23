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
