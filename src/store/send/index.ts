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
   // Retrieve existing data from localStorage
  const storedSentPayments = localStorage.getItem('sent-payments-state');
  const existingData: PayInvoiceResponse[] = storedSentPayments ? JSON.parse(storedSentPayments) : [];

  // Set the Recoil state with the existing data
  setSelf(existingData);

  // Use onSet to store updates back to localStorage
  onSet((newValue: string) => {
    // Merge the new value into the existing data
    const mergedData = [...existingData, ...newValue];

    // Stringify and store the merged data in localStorage
    localStorage.setItem('sent-payments-state', JSON.stringify(mergedData));
  });
}


export default sentPaymentsStateStore;
