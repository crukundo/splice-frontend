import { atom } from 'recoil';
import { PayInvoiceResponse } from '@/lib/interfaces';
import { AtomEffectParams } from '../types';
import { GlobalStorage } from '../globalStorage';

const sentPaymentsStateStore = atom<PayInvoiceResponse[]>({
  key: 'sent-payments-state',
  default: [],
  effects_UNSTABLE: [synchronizeWithLocalForage],
});

function synchronizeWithLocalForage({ setSelf, onSet }: AtomEffectParams) {
  // Use localForage to get the data
  GlobalStorage.getItem<PayInvoiceResponse[]>('sent-payments-state')
    .then((existingData) => {
      if (existingData) {
        // Reverse the existing data array to ensure the most recent item is at the top
        existingData.reverse();
        setSelf(existingData);
      }
    })
    .catch((error) => {
      console.error('Error loading data from LocalForage:', error);
    });

  onSet((newValue: PayInvoiceResponse[]) => {
    // Reverse the newValue array to ensure the most recent item is at the top
    newValue.reverse();

    // Use localForage to set the data
    GlobalStorage.setItem('sent-payments-state', newValue)
      .catch((error) => {
        console.error('Error storing data in LocalForage:', error);
      });
  });
}

export default sentPaymentsStateStore;
