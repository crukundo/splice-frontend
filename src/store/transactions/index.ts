import { atom } from 'recoil';
import { WalletTransactionsResponse } from '@/lib/interfaces';
import { AtomEffectParams } from '../types';
import { GlobalStorage } from '../globalStorage';

const transactionsStateStore = atom<WalletTransactionsResponse[]>({
  key: 'transactions-state',
  default: [],
  effects_UNSTABLE: [synchronizeWithLocalForage],
});

function synchronizeWithLocalForage({ setSelf, onSet }: AtomEffectParams) {
  // Use localForage to get the data
  GlobalStorage.getItem<WalletTransactionsResponse>('transactions-state')
    .then((existingData) => {
      if (existingData) {
        setSelf(existingData);
      }
    })
    .catch((error) => {
      console.error('Error loading data from LocalForage:', error);
    });

  onSet((newValue: WalletTransactionsResponse) => {
    // Reverse the newValue array to ensure the most recent item is at the top
    newValue;

    // Use localForage to set the data
    GlobalStorage.setItem('transactions-state', newValue)
      .catch((error) => {
        console.error('Error storing data in LocalForage:', error);
      });
  });
}

export default transactionsStateStore;