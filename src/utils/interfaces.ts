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
