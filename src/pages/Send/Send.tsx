import * as React from 'react';

import Lottie from 'lottie-react';

import Meta from '@/components/Meta';
import SpliceQrCode from '@/components/QRCode';
import { FullSizeAtopFlexBox } from '@/components/styled';
import { apiUrl, storedWallet } from '@/config';
import useNotifications from '@/store/notifications';
import {
  CreateInvoiceRequestBody,
  CreateInvoiceResponse,
  PayInvoiceRequestBody,
  PayInvoiceResponse,
} from '@/lib/interfaces';

import successfulTransaction from '@/assets/lottie/success-transaction.json';
import { DashboardShell } from '@/components/shell';
import { DashboardHeader } from '@/components/header';
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import { Icons } from '@/components/icons';
import useLocalStorage from '@/hooks/use-local-storage';
import { AtSignIcon } from 'lucide-react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';

function Send() {
  const [sendAmount, setSendAmount] = React.useState(0);
  const [remoteLnAddress, setRemoteLnAddress] = React.useState('');
  const [isAddressValid, setIsAddressValid] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [invoiceResponse, setInvoiceResponse] = React.useState<CreateInvoiceResponse | null>(null);
  const [payResponse, setPayResponse] = React.useState<PayInvoiceResponse | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const form = useForm()
  const defaultWallet = {id: "95b650d2-8fa1-4b6c-a341-0e0ba2f4f041", lightning_address: "0769950599@splice.africa", preferred_fiat_currency: "KES", withdrawal_fee: 100, balances: [{amount: 2, currency: "BTC"}, {amount: 324244.4000000001, currency: "KES"}]}
  const [storedValue, ,] = useLocalStorage(storedWallet, defaultWallet)

  const validateLnAddress = (lnAddress: string) => {
    const addressRegex = /\S+@\S+\.\S+/;
    return addressRegex.test(lnAddress);
  };

  const handleLnAddress = (event: any) => {
    const inputAddress = event.target.value;
    setRemoteLnAddress(inputAddress);
  };

  const handleLnAddressBlur = () => {
    // Validate the lightning address onBlur
    setIsAddressValid(validateLnAddress(remoteLnAddress));
  };

  const handleAmount = (event: any) => {
    const inputAmount = event.target.value;
    setSendAmount(inputAmount);
  };

  const localWallet = storedValue;

  const handleRequestInvoice = async () => {
    setIsConfirmationOpen(false);
    setIsLoading(true);
    const payload: CreateInvoiceRequestBody = {
      walletId: localWallet,
      destionationAddress: remoteLnAddress,
      amount: sendAmount,
      currency: 'NGN',
    };

    try {
      const response = await fetch(`${apiUrl}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // @todo: show as an alert or notification
        throw new Error('Failed to generate invoice');
      }

      await response.json().then((data) => {
        console.log('createInvoiceRes: ', data);
        setInvoiceResponse(data);
      });
      setIsLoading(false);
    } catch (error: any) {
      console.log('Error creating wallet: ', error.message);
    }
  };

  const handleConfirmationPress = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
  };

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(invoiceResponse?.invoice || '');
    return toast({
      title: "Copied",
      description: "Invoice is on your clipboard",
    })
  };

  const handleCopyProof = () => {
    navigator.clipboard.writeText(payResponse?.proofOfPayment || '');
    return toast({
      title: "Copied",
      description: "The transaction ID is on your clipboard",
    })
  };

  const handleShareProof = (event: any) => {
    event.preventDefault();
    if (navigator.share) {
      navigator
        .share({
          title: 'Splice proof of payment',
          text: payResponse?.proofOfPayment,
        })
        .then(() => {
          console.log('Shared!');
        })
        .catch(console.error);
    }
  };

  const handlePayInvoice = async () => {
    setIsLoading(true);
    const payload: PayInvoiceRequestBody = {
      sourceAddress: localWallet.lightning_address,
      amount: invoiceResponse?.amount,
      currency: invoiceResponse?.currency,
      destinationAddress: remoteLnAddress,
      tapdAddress: invoiceResponse?.invoice,
    };

    try {
      const response = await fetch(`${apiUrl}/invoices/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        toast({
          title: "Something went wrong.",
          description: "We couldn't pay the invoice. Please refresh and try again",
          variant: "destructive",
        })
      }

      await response.json().then((data) => {
        console.log('payInvoiceRes: ', data);
        setPayResponse(data);
      });
      setIsLoading(false);
    } catch (error: any) {
      console.log('Error creating wallet: ', error.message);
    }
  };

  const getCurrencyIcon = (currency: string): JSX.Element => {
    let avatar: JSX.Element;

    switch (currency) {
      case 'BTC':
        avatar = (
          <svg className="h-10 w-10 text-muted-foreground" viewBox="0.004 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M63.04 39.741c-4.274 17.143-21.638 27.575-38.783 23.301C7.12 58.768-3.313 41.404.962 24.262 5.234 7.117 22.597-3.317 39.737.957c17.144 4.274 27.576 21.64 23.302 38.784z" fill="#f7931a"/><path d="M46.11 27.441c.636-4.258-2.606-6.547-7.039-8.074l1.438-5.768-3.512-.875-1.4 5.616c-.922-.23-1.87-.447-2.812-.662l1.41-5.653-3.509-.875-1.439 5.766c-.764-.174-1.514-.346-2.242-.527l.004-.018-4.842-1.209-.934 3.75s2.605.597 2.55.634c1.422.355 1.68 1.296 1.636 2.042l-1.638 6.571c.098.025.225.061.365.117l-.37-.092-2.297 9.205c-.174.432-.615 1.08-1.609.834.035.051-2.552-.637-2.552-.637l-1.743 4.02 4.57 1.139c.85.213 1.683.436 2.502.646l-1.453 5.835 3.507.875 1.44-5.772c.957.26 1.887.5 2.797.726L27.504 50.8l3.511.875 1.453-5.823c5.987 1.133 10.49.676 12.383-4.738 1.527-4.36-.075-6.875-3.225-8.516 2.294-.531 4.022-2.04 4.483-5.157zM38.087 38.69c-1.086 4.36-8.426 2.004-10.807 1.412l1.928-7.729c2.38.594 10.011 1.77 8.88 6.317zm1.085-11.312c-.99 3.966-7.1 1.951-9.083 1.457l1.748-7.01c1.983.494 8.367 1.416 7.335 5.553z" fill="#ffffff"/></svg>
        );
        break;
      case 'KES':
        avatar = <Avatar className="text-muted-foreground">
        <AvatarImage src="src/assets/ke.png" alt="Kenyan shillings" />
      </Avatar>;
        break;
      case 'NGN':
        avatar = <Avatar className="text-muted-foreground">
        <AvatarImage src="src/assets/ng.png" alt="Nigerian Naira" />
      </Avatar>;
        break;
      default:
        avatar = (
          <Avatar className="text-muted-foreground">
          <AvatarImage src="src/assets/gh.png" alt="Currency" />
        </Avatar>
        );
    }
    return avatar;
  };

  const iconColor = isAddressValid ? 'text-green-500 dark:text-green-500' : 'text-gray-500 dark:text-black-500'

  return (
    <>
      <Meta title="Send money" />
      <DashboardShell>
        <DashboardHeader heading="Send money" text="Send money across Africa. Lightning fast ⚡"></DashboardHeader>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Transaction details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form>
                        <FormField
                          control={form.control}
                          name="sendAmount"
                          render={({ field }) => (
                            <FormItem>
                               <FormLabel htmlFor="email">{`Amount to send in ${localWallet.preferred_fiat_currency}`}</FormLabel>
                                <div className="relative rounded-lg shadow-lg">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                  {getCurrencyIcon(localWallet.preferred_fiat_currency)}
                                  </span>
                                  <input
                                    type="text"
                                    className="block w-full text-gray-500 dark:text-black-500 py-4 pl-20 pr-4 text-3xl leading-8 rounded-lg transition duration-150 ease-in-out focus:outline-none"
                                    placeholder="0.00"
                                    onChange={handleAmount}
                                  />
                                </div>
                              {sendAmount > 0 && <FormDescription>{`Also equivalent to ${(sendAmount * 100000000).toLocaleString()} sats`}</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lnAddress"
                          render={({ field }) => (
                            <FormItem className='pt-4'>
                              <FormLabel htmlFor="email">Agent's lightning address</FormLabel>
                                <div className="relative rounded-lg shadow-lg">
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                  <AtSignIcon className={`h-8 w-8 ${iconColor}`} />
                                  </span>
                                  <input
                                    type="email"
                                    className="block w-full text-gray-500 dark:text-black-500 py-4 pl-14 pr-4 text-xl leading-8 rounded-lg transition duration-150 ease-in-out focus:outline-none"
                                    placeholder=""
                                    onChange={handleLnAddress}
                                    onBlur={handleLnAddressBlur}
                                  />
                                </div>
                              {remoteLnAddress && <FormDescription>{!isAddressValid  ? 'Invalid lightning address' : 'e.g rukundo@splice.africa'}</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid gap-2 pt-5">
                          <Button
                            variant='secondary'
                            onClick={handleConfirmationPress}
                            className={cn(buttonVariants())}
                            disabled={isLoading || !sendAmount || !remoteLnAddress || !!invoiceResponse}
                            type="submit"
                          >
                            {isLoading && (
                              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Continue
                          </Button>
                        </div>
                    </form>
                </Form>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CardTitle>QR Code</CardTitle>
                  {isLoading && <Icons.spinner className='h-4 w-4 animate-spin' />}
                </div>
                <CardDescription>Show this QR code to a Splice agent near you</CardDescription>
              </CardHeader>
              <CardContent className='items-center space-x-1 text-sm text-muted-foreground'>
                
              </CardContent>
            </Card>
          </div>
      </DashboardShell>
    </>
  );
}

export default Send;
