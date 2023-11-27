import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getCurrentWallet } from '@/lib/session';
import sleep from '@/lib/sleep';
import { cn } from '@/lib/utils';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import Meta from '@/components/Meta';
import { DashboardHeader } from '@/components/header';
import { Icons } from '@/components/icons';
import { DashboardShell } from '@/components/shell';

import successfulTransaction from '@/assets/lottie/success-transaction.json';
import useNotifications from '@/store/notifications';
import Lottie from 'lottie-react';
import { CopyIcon } from 'lucide-react';

function Receive() {
  const [isLoading, setIsLoading] = useState(false);
  const [transactionProof, setTransactionProof] = useState('');
  const [txStatus, setTxStatus] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
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

  const handleProof = (event: any) => {
    const inputProof = event.target.value;
    setTransactionProof(inputProof);
  };

  async function checkTxStatus() {
    // setIsLoading(true);
    // const payload = {
    //   proof: transactionProof,
    // };

    // try {
    //   const response = await fetch(`${apiUrl}/proof/${transactionProof}`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(payload),
    //   });

    //   if (!response.ok) {
    //     notifyActions.push({
    //       message: 'Could not verify this transaction. Please try again.',
    //       dismissed: true,
    //       options: {
    //         variant: 'error',
    //       },
    //     });
    //   }

    //   await response.json().then((data) => {
    //     console.log('transaction claimed: ', data.su);
    //     setTxStatus(data.succeeded);
    //   });
    //   setIsLoading(false);
    // } catch (error: any) {
    //   console.log('Error creating ramp invoice: ', error.message);
    // }
    setIsLoading(true);
    sleep(2000);
    setTxStatus(true);
    setIsLoading(false);
    setOpen(true);
  }

  const handleCopyProof = () => {
    navigator.clipboard.writeText(transactionProof);
    notifyActions.push({
      message: 'Transaction proof is on your clipboard',
      dismissed: true,
      options: {
        variant: 'info',
      },
    });
  };

  return (
    <>
      <Meta title="Claim Payment" />
      <DashboardShell>
        <DashboardHeader heading="Claim Payment"></DashboardHeader>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card className="col-span-3">
            <CardContent className="pt-5 space-y-2">
              <Input
                value={transactionProof}
                onChange={handleProof}
                placeholder="Enter proof of payment"
              />
              <div className="grid py-4">
                <Button
                  onClick={checkTxStatus}
                  className={cn(buttonVariants({ variant: 'default' }))}
                  disabled={isLoading || !transactionProof}
                >
                  {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                  Verify & Claim
                </Button>
              </div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Transaction Status</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                      <Label htmlFor="link" className="sr-only">
                        Transaction proof
                      </Label>
                      <Input id="link" defaultValue={transactionProof} readOnly />
                    </div>
                    <Button onClick={handleCopyProof} size="sm" className="px-3">
                      <span className="sr-only">Copy</span>
                      <CopyIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid py-4 text-center">
                    {txStatus && (
                      <Lottie
                        animationData={successfulTransaction}
                        loop={false}
                        style={{ height: 200 }}
                      />
                    )}
                    <h4>Transaction claimed successfully</h4>
                  </div>
                  <DialogFooter className="sm:justify-center">
                    <DialogClose asChild>
                      <Button variant="secondary">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </>
  );
}

export default Receive;
