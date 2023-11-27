import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { GenerateRampInvoiceBody, GenerateRampInvoiceResponse } from '@/lib/interfaces';
import { getCurrentWallet } from '@/lib/session';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input, SpliceAmountInput } from '@/components/ui/input';

import Meta from '@/components/Meta';
import SpliceQrCode from '@/components/QRCode';
import { DashboardHeader } from '@/components/header';
import { Icons } from '@/components/icons';
import { DashboardShell } from '@/components/shell';

import { apiUrl } from '@/config';
import useNotifications from '@/store/notifications';
import { CopyIcon, Share2Icon } from 'lucide-react';

function Receive() {
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState(0);
  const [generatedInvoice, setGeneratedInvoice] = useState('');
  const form = useForm();
  const navigate = useNavigate();
  const [, notifyActions] = useNotifications();

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

  const handleAmount = (event: any) => {
    const inputAmount = event.target.value;
    setInvoiceAmount(inputAmount);
  };

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(generatedInvoice);
    notifyActions.push({
      message: 'Invoice is on your clipboard',
      dismissed: true,
      options: {
        variant: 'info',
      },
    });
  };

  const handleShareInvoice = (event: any) => {
    event.preventDefault();
    if (navigator.share) {
      navigator
        .share({
          title: `Invoice for ${invoiceAmount} BTC`,
          text: generatedInvoice,
        })
        .then(() => {
          console.log('Shared!');
        })
        .catch(console.error);
    }
  };

  useEffect(() => {
    async function generateRampInvoice() {
      setIsLoading(true);
      const payload: GenerateRampInvoiceBody = {
        amount: invoiceAmount,
        currency: 'BTC',
      };

      try {
        const response = await fetch(`${apiUrl}/on/invoices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          notifyActions.push({
            message: 'Your invoice was not created. Please try again.',
            dismissed: true,
            options: {
              variant: 'error',
            },
          });
        }

        await response.json().then((data: GenerateRampInvoiceResponse) => {
          console.log('generateRampInvoiceRes: ', data);
          setGeneratedInvoice(data.destinationAddress);
        });
        setIsLoading(false);
      } catch (error: any) {
        console.log('Error creating ramp invoice: ', error.message);
      }
    }

    if (invoiceAmount > 0) {
      generateRampInvoice();
    } else {
      setGeneratedInvoice('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceAmount]);

  return (
    <>
      <Meta title="Receive" />
      <DashboardShell>
        <DashboardHeader heading="Receive" text="From anywhere in Africa"></DashboardHeader>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Specify amount</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form>
                  <FormField
                    control={form.control}
                    name="invoiceAmount"
                    render={() => (
                      <FormItem>
                        <FormMessage />
                        <SpliceAmountInput
                          currency="BTC"
                          value={invoiceAmount === 0 ? invoiceAmount.toFixed(2) : invoiceAmount}
                          onChange={handleAmount}
                        />
                        {invoiceAmount > 0 && (
                          <FormDescription>{`Also equivalent to ${(
                            invoiceAmount * 100000000
                          ).toLocaleString()} sats`}</FormDescription>
                        )}
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CardTitle>QR Code</CardTitle>
                {isLoading && <Icons.spinner className="h-4 w-4 animate-spin" />}
              </div>
              <CardDescription>
                {!isLoading && generatedInvoice
                  ? 'Show this QR code to a Splice agent near you'
                  : 'Enter an amount to generate an invoice'}
              </CardDescription>
            </CardHeader>
            <CardContent className="items-center space-x-1 text-sm text-muted-foreground">
              {!isLoading && generatedInvoice && (
                <>
                  <SpliceQrCode
                    invoice={generatedInvoice}
                    amount={invoiceAmount}
                    currency="BTC"
                    size={250}
                  />
                  <div className="flex space-x-2 mt-4">
                    <Input value={generatedInvoice} readOnly />
                    <Button
                      size="sm"
                      variant="secondary"
                      className="shrink-0"
                      onClick={handleCopyInvoice}
                    >
                      <CopyIcon className="mr-2 h-4 w-4" /> Copy invoice
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
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </>
  );
}

export default Receive;
