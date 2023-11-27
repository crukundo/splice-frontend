import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';

import {
  CreateInvoiceRequestBody,
  CreateInvoiceResponse,
  PayInvoiceRequestBody,
  PayInvoiceResponse,
} from '@/lib/interfaces';
import { getCurrentWallet } from '@/lib/session';
import { cn, detectCurrencyViaPhone } from '@/lib/utils';

import useLocalStorage from '@/hooks/use-local-storage';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input, SpliceAddressInput, SpliceAmountInput } from '@/components/ui/input';

import Meta from '@/components/Meta';
import SpliceQrCode from '@/components/QRCode';
import { DashboardHeader } from '@/components/header';
import { Icons } from '@/components/icons';
import { DashboardShell } from '@/components/shell';

import successfulTransaction from '@/assets/lottie/success-transaction.json';
import { apiUrl, storedWallet } from '@/config';
import useNotifications from '@/store/notifications';
import sentPaymentsStateStore from '@/store/send';
import Lottie from 'lottie-react';
import { ArrowUpRightIcon, CopyIcon, MoreHorizontalIcon, Share2Icon } from 'lucide-react';

function Send() {
  const [sendAmount, setSendAmount] = useState(0);
  const [remoteLnAddress, setRemoteLnAddress] = useState('');
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceResponse, setInvoiceResponse] = useState<CreateInvoiceResponse | null>(null);
  const [payResponse, setPayResponse] = useState<PayInvoiceResponse | null>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const form = useForm();
  const [, notifyActions] = useNotifications();
  const [storedValue, ,] = useLocalStorage(storedWallet, {});
  const [sentPaymentsState, setSentPaymentsState] = useRecoilState(sentPaymentsStateStore);

  const navigate = useNavigate();

  useEffect(() => {
    async function checkWallet() {
      try {
        const wallet = await getCurrentWallet();
        if (!wallet) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    checkWallet();
  }, [navigate]);

  const validateLnAddress = (lnAddress: string) => {
    const addressRegex = /\S+@\S+\.\S+/;
    return addressRegex.test(lnAddress);
  };

  const handleLnAddress = (event: any) => {
    const inputAddress = event.target.value;
    setRemoteLnAddress(inputAddress);
  };

  const handleLnAddressBlur = () => {
    if (remoteLnAddress.trim() !== '') {
      // Validate the lightning address onBlur
      setIsAddressValid(validateLnAddress(remoteLnAddress));
    }
  };

  const handleAmount = (event: any) => {
    const inputAmount = event.target.value;
    setSendAmount(inputAmount);
  };

  const localWallet = storedValue;

  const remoteFiatCurrency = detectCurrencyViaPhone(remoteLnAddress.split('@')[0]);

  const handleRequestInvoice = async () => {
    setShowConfirmationDialog(false);
    setIsLoading(true);
    const payload: CreateInvoiceRequestBody = {
      walletId: localWallet.id,
      destionationAddress: remoteLnAddress,
      amount: sendAmount,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      currency: remoteFiatCurrency!,
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
        notifyActions.push({
          message: "Splice couldn't generate an invoice. Please try again.",
          dismissed: true,
          options: {
            variant: 'error',
          },
        });
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

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(invoiceResponse?.invoice || '');
    notifyActions.push({
      message: 'Invoice is on your clipboard',
      dismissed: true,
      options: {
        variant: 'info',
      },
    });
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
        notifyActions.push({
          message: 'Payment was not successful. Please refresh and try again',
          dismissed: true,
          options: {
            variant: 'error',
          },
        });
      }

      await response.json().then((data) => {
        console.log('payInvoiceRes: ', data);
        setPayResponse(data);
        setSentPaymentsState([...sentPaymentsState, data]);
      });
      setIsLoading(false);
    } catch (error: any) {
      console.log('Error creating wallet: ', error.message);
    }
  };

  const handleShareInvoice = (event: any) => {
    event.preventDefault();
    if (navigator.share) {
      navigator
        .share({
          title: `Invoice for ${sendAmount} ${invoiceResponse?.currency}`,
          text: invoiceResponse?.invoice,
        })
        .then(() => {
          console.log('Shared!');
        })
        .catch(console.error);
    }
  };

  return (
    <>
      <Meta title="Send money" />
      <DashboardShell>
        <DashboardHeader
          heading="Send money"
          text="Send money across Africa. Lightning fast"
        ></DashboardHeader>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Transaction details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <FormField
                  control={form.control}
                  name="lnAddress"
                  render={() => (
                    <FormItem>
                      <FormLabel htmlFor="lnAddress">{`Receiving agent's Splice address`}</FormLabel>
                      {/* issue here. Input unresponsive to input or theme changes */}
                      <SpliceAddressInput
                        isValid={isAddressValid}
                        onChange={handleLnAddress}
                        onBlur={handleLnAddressBlur}
                        value={remoteLnAddress}
                        disabled={isLoading || payResponse !== null}
                      />
                      {!isAddressValid && (
                        <FormDescription className="text-red-500 dark:text-red-500">
                          Invalid lightning address
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {remoteLnAddress && remoteFiatCurrency && (
                  <FormField
                    control={form.control}
                    name="sendAmount"
                    render={() => (
                      <FormItem className="pt-4">
                        <FormLabel htmlFor="email">{`Amount they should receieve in ${remoteFiatCurrency}`}</FormLabel>
                        <SpliceAmountInput
                          currency={remoteFiatCurrency}
                          onChange={handleAmount}
                          value={sendAmount === 0 ? sendAmount.toFixed(2) : sendAmount}
                          disabled={isLoading || payResponse !== null}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid gap-2 pt-5">
                  <Button
                    variant="outline"
                    onClick={handleRequestInvoice}
                    className={cn(buttonVariants())}
                    disabled={isLoading || !sendAmount || !remoteLnAddress || !!invoiceResponse}
                  >
                    {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                    Request invoice
                  </Button>
                </div>
                {invoiceResponse && payResponse === null && (
                  <div className="grid gap-2 pt-5">
                    <SpliceQrCode
                      invoice={invoiceResponse.invoice}
                      amount={invoiceResponse.amount}
                      currency={invoiceResponse.currency}
                      size={250}
                    />

                    <p className="font-xs font-mono text-center">
                      Show this quote to the sender for confirmation
                    </p>
                    <div className="flex space-x-2 mt-4">
                      <Input value={invoiceResponse.invoice} readOnly />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="shrink-0"
                        onClick={handleCopyInvoice}
                      >
                        <CopyIcon className="mr-2 h-4 w-4" /> Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="shrink-0"
                        onClick={handleShareInvoice}
                      >
                        <Share2Icon className="mr-2 h-4 w-4" /> Share
                      </Button>
                    </div>

                    <div className="grid gap-2 pt-5">
                      <Button
                        onClick={() => setShowConfirmationDialog(true)}
                        className={cn(buttonVariants())}
                        size="lg"
                      >
                        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                        Pay with wallet
                      </Button>
                      <Button
                        onClick={() => {
                          setPayResponse(null);
                          setInvoiceResponse(null);
                          setRemoteLnAddress('');
                          setSendAmount(0);
                        }}
                        variant="ghost"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                {payResponse && (
                  <div className="grid gap-2 pt-5">
                    <Lottie
                      animationData={successfulTransaction}
                      loop={false}
                      style={{ height: 200 }}
                    />
                    <h4 className="text-center py-3 text-green-500 dark:text-green-500">
                      Payment sent
                    </h4>
                    <Button
                      onClick={() => {
                        setPayResponse(null);
                        setInvoiceResponse(null);
                        setRemoteLnAddress('');
                        setSendAmount(0);
                      }}
                      variant="link"
                    >
                      Make Another Payment?
                    </Button>
                  </div>
                )}
              </Form>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Sent payments</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              {sentPaymentsState.length === 0 ? (
                <p className="text-xs">There are no payments at this time.</p>
              ) : (
                <div className="space-y-8">
                  {sentPaymentsState
                    .slice()
                    .reverse()
                    .map((tx: PayInvoiceResponse, index: any) => (
                      <div key={index} className="flex items-center">
                        <Avatar className="h-6 w-6">
                          <ArrowUpRightIcon className="text-red-500 dark:text-red-500" />
                        </Avatar>
                        <div className="ml-2 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {tx.destinationAddress}
                          </p>
                          <p className="text-sm text-muted-foreground truncate w-60">
                            {tx.proofOfPayment}
                          </p>
                        </div>
                        <div className="ml-auto font-medium">
                          {tx.amount.toLocaleString('en-GB', { maximumFractionDigits: 0 })}{' '}
                          {tx.currency}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 ml-5">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                navigator.clipboard.writeText(tx.proofOfPayment);
                                notifyActions.push({
                                  message: 'The transaction ID is on your clipboard',
                                  dismissed: true,
                                  options: {
                                    variant: 'info',
                                  },
                                });
                              }}
                            >
                              Copy proof
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <AlertDialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                {`Send ${invoiceResponse?.amount.toLocaleString('en-GB', {
                  maximumFractionDigits: 0,
                })} ${invoiceResponse?.currency} to ${remoteLnAddress}?`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handlePayInvoice}>Yes</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DashboardShell>
    </>
  );
}

export default Send;
