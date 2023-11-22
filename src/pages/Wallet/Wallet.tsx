import Meta from '@/components/Meta';
import { DashboardShell } from '@/components/shell';
import { DashboardHeader } from '@/components/header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useEffect, useState } from 'react';
import { BalanceProps, WalletRequestResponse, WalletTransactionsResponse } from '@/lib/interfaces';
import { apiUrl, storedWallet } from '@/config';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '@/hooks/use-local-storage';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

function Wallet() {
  const [userWallet, setUserWallet] = useState<WalletRequestResponse | null>(null);
  const [userTransactions, setUserTransactions] = useState<[] | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const defaultWallet = {id: "95b650d2-8fa1-4b6c-a341-0e0ba2f4f041", lightning_address: "0769950599@splice.africa", preferred_fiat_currency: "KES", withdrawal_fee: 100, balances: [{amount: 2, currency: "BTC"}, {amount: 324244.4000000001, currency: "KES"}]}
  const [storedValue, ,] = useLocalStorage(storedWallet, defaultWallet)
  console.log("storedValue: ", storedValue);
  useEffect(() => {
    if (!storedValue) {
      navigate('/');
      toast({
        title: "Something went wrong.",
        description: "We couldn't find your wallet. Please refresh",
        variant: "destructive",
      })
    }
  }, [storedWallet]);

  const getUserWallet = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/wallets/${storedValue.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return toast({
          title: "Something went wrong.",
          description: "We couldn't find your wallet. Please refresh.",
          variant: "destructive",
        })
      }

      const responseData: WalletRequestResponse = await response.json();
      console.log("wallet info: ", responseData)
      setUserWallet(responseData);
      setLoading(false);
      return responseData;
    } catch (error: any) {
      console.log('Error: ', error.message);
    }
  };

  const getUserTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/payments/${storedValue.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return toast({
          title: "Something went wrong.",
          description: "Having trouble getting your transactions. Please refresh.",
          variant: "destructive",
        })
      }

      const transactionsData: WalletTransactionsResponse = await response.json();
      console.log("wallet transactions: ", transactionsData.payments)
      setUserTransactions(transactionsData.payments);
      setLoading(false);
      return transactionsData;
    } catch (error: any) {
      console.log('Error: ', error.message);
    }
  };

  useEffect(() => {
    if (storedWallet) {
      getUserWallet();
      getUserTransactions();
    } else {
      navigate('/');
      toast({
        title: "Something went wrong.",
        description: "We couldn't find your wallet. Please refresh.",
        variant: "destructive",
      })
    }
  }, [storedWallet]);

  const WalletBalanceCard = () => {
    const balances = userWallet?.balances;

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

    return (
      <>
        {balances?.map(({ amount, currency }: BalanceProps, index: number) => (
          <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>
            {currency}
            </CardTitle>
            {getCurrencyIcon(currency)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold"> {amount.toLocaleString()}</div>
          </CardContent>
        </Card>
        ))}
      </>
    );
  };

  const WalletBalanceSkeleton = () => {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <div className="col-span-6 space-y-2">
        <Card>
          <CardHeader className="gap-2">
            <Skeleton className="h-5 w-1/5" />
            <Skeleton className="h-4 w-4/5" />
          </CardHeader>
          <CardContent className="h-10" />
          <CardFooter>
            <Skeleton className="h-8 w-[120px]" />
          </CardFooter>
        </Card>
        </div>
        <div className="col-span-6 space-y-2">
        <Card>
      <CardHeader className="gap-2">
        <Skeleton className="h-5 w-1/5" />
        <Skeleton className="h-4 w-4/5" />
      </CardHeader>
      <CardContent className="h-10" />
      <CardFooter>
        <Skeleton className="h-8 w-[120px]" />
      </CardFooter>
    </Card>
        </div>
    </div>
    )
  }

  return (
    <>
      <Meta title="Wallet &amp; Transactions" />
      
      <DashboardShell>
        <DashboardHeader heading="Wallet" text="Balances and transaction history"></DashboardHeader>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <div className="col-span-3">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {loading ? <WalletBalanceSkeleton /> : <WalletBalanceCard />}
              </div>
            </div>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
              {/* <div className="space-y-8">
                <div className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback>OM</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Olivia Martin</p>
                    <p className="text-sm text-muted-foreground">
                      olivia.martin@email.com
                    </p>
                  </div>
                  <div className="ml-auto font-medium">+$1,999.00</div>
                </div>
              </div> */}
              </CardContent>
            </Card>
          </div>
      </DashboardShell>
    </>
  );
}

export default Wallet;
