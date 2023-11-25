import { atom } from 'recoil';

import { PayInvoiceResponse } from '@/lib/interfaces';
import { AtomEffectParams } from '../types';

// Track sent cross border payments for current user
const sentPaymentsStateStore = atom<PayInvoiceResponse[]>({
  key: 'sent-payments-state',
  default: [],
  effects_UNSTABLE: [synchronizeWithLocalStorage],
});


function synchronizeWithLocalStorage({ setSelf, onSet }: AtomEffectParams) {
  const storedSentPayments = localStorage.getItem('sent-payments-state');
  const existingData: PayInvoiceResponse[] = storedSentPayments ? JSON.parse(storedSentPayments) : [];

  // No timestamp so reversing the existing data array to ensure the most recent item is at the top
  existingData.reverse(); 
  setSelf(existingData);


  onSet((newValue: string) => {
    const mergedData = [...existingData, ...newValue];

    // No timestamp so reversing the existing data array to ensure the most recent item is at the top
    mergedData.reverse();
    localStorage.setItem('sent-payments-state', JSON.stringify(mergedData));
  });
}


export default sentPaymentsStateStore;
