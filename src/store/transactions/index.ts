import { atom } from 'recoil';

import { WalletTransactionsResponse } from '@/lib/interfaces';
import { AtomEffectParams } from '../types';

const transactionsStateStore = atom<WalletTransactionsResponse[]>({
  key: 'transactions-state',
  default: [],
  effects_UNSTABLE: [synchronizeWithLocalStorage],
});


function synchronizeWithLocalStorage({ setSelf, onSet }: AtomEffectParams) {
  const storedHistory= localStorage.getItem('transactions-state');
  const existingData: WalletTransactionsResponse[] = storedHistory ? JSON.parse(storedHistory) : [];

  // No timestamp so reversing the existing data array to ensure the most recent item is at the top
  existingData.reverse(); 
  setSelf(existingData);


  onSet((newValue: string) => {
    const mergedData = [...existingData, ...newValue];

    // No timestamp so reversing the existing data array to ensure the most recent item is at the top
    mergedData.reverse();
    localStorage.setItem('transactions-state', JSON.stringify(mergedData));
  });
}


export default transactionsStateStore;
