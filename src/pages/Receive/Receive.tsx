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
                            <svg className="h-10 w-10 text-muted-foreground" viewBox="0.004 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M63.04 39.741c-4.274 17.143-21.638 27.575-38.783 23.301C7.12 58.768-3.313 41.404.962 24.262 5.234 7.117 22.597-3.317 39.737.957c17.144 4.274 27.576 21.64 23.302 38.784z" fill="#f7931a"/><path d="M46.11 27.441c.636-4.258-2.606-6.547-7.039-8.074l1.438-5.768-3.512-.875-1.4 5.616c-.922-.23-1.87-.447-2.812-.662l1.41-5.653-3.509-.875-1.439 5.766c-.764-.174-1.514-.346-2.242-.527l.004-.018-4.842-1.209-.934 3.75s2.605.597 2.55.634c1.422.355 1.68 1.296 1.636 2.042l-1.638 6.571c.098.025.225.061.365.117l-.37-.092-2.297 9.205c-.174.432-.615 1.08-1.609.834.035.051-2.552-.637-2.552-.637l-1.743 4.02 4.57 1.139c.85.213 1.683.436 2.502.646l-1.453 5.835 3.507.875 1.44-5.772c.957.26 1.887.5 2.797.726L27.504 50.8l3.511.875 1.453-5.823c5.987 1.133 10.49.676 12.383-4.738 1.527-4.36-.075-6.875-3.225-8.516 2.294-.531 4.022-2.04 4.483-5.157zM38.087 38.69c-1.086 4.36-8.426 2.004-10.807 1.412l1.928-7.729c2.38.594 10.011 1.77 8.88 6.317zm1.085-11.312c-.99 3.966-7.1 1.951-9.083 1.457l1.748-7.01c1.983.494 8.367 1.416 7.335 5.553z" fill="#ffffff"/></svg>
                            </span>
                            <input
                              type="text"
                              className="block w-full text-gray-500 dark:text-black-500 py-4 pl-20 pr-4 text-3xl leading-8 rounded-lg transition duration-150 ease-in-out focus:outline-none"
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
