import { useEffect, useState } from 'react';

import Meta from '@/components/Meta';
import SpliceQrCode from '@/components/QRCode';
import { apiUrl } from '@/config';
import { GenerateRampInvoiceBody, GenerateRampInvoiceResponse } from '@/lib/interfaces';
import { DashboardShell } from '@/components/shell';
import { DashboardHeader } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { CopyIcon, Share2Icon } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

function Receive() {
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState(0);
  const [generatedInvoice, setGeneratedInvoice] = useState('');

  const form = useForm()

  const handleAmount = (event: any) => {
    const inputAmount = event.target.value;
    setInvoiceAmount(inputAmount);
  };

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(generatedInvoice);
    return toast({
      title: "Copied",
      description: "Invoice is on your clipboard",
    })
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

    async function generateRampInvoice(){
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
          return toast({
            title: "Something went wrong.",
            description: "Your invoice was not created. Please try again.",
            variant: "destructive",
          })
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
      generateRampInvoice()
    } else {
      setGeneratedInvoice('');
    }
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
                    render={({ field }) => (
                      <FormItem>
                        <FormMessage />
                          <div className="relative rounded-lg shadow-lg">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-3xl text-gray-500 dark:text-black-500">BTC</span>
                            </span>
                            <input
                              type="text"
                              className="block w-full text-gray-500 dark:text-black-500 py-4 pl-24 pr-4 text-3xl leading-8 rounded-lg transition duration-150 ease-in-out focus:outline-none"
                              placeholder="0.00"
                              onChange={handleAmount}
                            />
                          </div>
                        {invoiceAmount > 0 && <FormDescription>{`Also equivalent to ${(invoiceAmount * 100000000).toLocaleString()} sats`}</FormDescription>}
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
                  {isLoading && <Icons.spinner className='h-4 w-4 animate-spin' />}
                </div>
                <CardDescription>{!isLoading && generatedInvoice ? 'Show this QR code to a Splice agent near you' : 'Enter an amount to generate an invoice'}</CardDescription>
              </CardHeader>
              <CardContent className='items-center space-x-1 text-sm text-muted-foreground'>
                {!isLoading && generatedInvoice && (
                  <><SpliceQrCode
                  invoice={generatedInvoice}
                  amount={invoiceAmount}
                  currency="BTC"
                  size={250} /><div className="flex space-x-2 mt-4">
                    <Input value={generatedInvoice} readOnly />
                    <Button size="sm" variant="secondary" className="shrink-0" onClick={handleCopyInvoice}>
                      <CopyIcon className="mr-2 h-4 w-4" /> Copy invoice
                    </Button>
                    <Button size="sm" variant="secondary" className="shrink-0" onClick={handleShareInvoice}>
                    <Share2Icon className="mr-2 h-4 w-4" /> Share
                    </Button>
                  </div></>
                                )}
              </CardContent>
            </Card>
          </div>
      </DashboardShell>
    </>
  );
}

export default Receive;
