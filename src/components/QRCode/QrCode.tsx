import QRCode from 'react-qr-code';

import { toast } from '../ui/use-toast';

interface Props {
  size?: number; // px (square)
  invoice: string;
  amount: number;
  currency: string;
}

function SpliceQrCode({ invoice, amount, currency, size }: Props) {

  const handleCopy = () => {
    // Copy the QR string to the clipboard
    navigator.clipboard.writeText(invoice);
    return toast({
      title: "Copied",
      description: "Invoice is on your clipboard",
    })
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <h3 className="font-semibold font-mono tracking-tight text-4xl my-4">{currency} {amount.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</h3>
        <QRCode className='mb-3' value={invoice} size={size} />
    </div>
  );
}

export default SpliceQrCode;
