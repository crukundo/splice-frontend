import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import Meta from "@/components/Meta";
import { AuthShell } from "@/components/auth-shell";
import { useState } from "react";
import { Icons } from "@/components/icons";
import { apiUrl, storedWallet } from "@/config";
import { WalletRequestResponse } from "@/lib/interfaces";
import useLocalStorage from "@/hooks/use-local-storage";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { ChevronsUpDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import isMobile from "@/lib/is-mobile";

function Welcome() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [enteredWalletId, setEnteredWalletId] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [, setValue] = useLocalStorage(storedWallet, "")
  const [isExpanded, setIsExpanded] = useState(false);
  const [isWalletIdValid, setIsWalletIdValid] = useState(true);
  const navigate = useNavigate()
  const form = useForm()


  const handleExistingWallet = async () => {
    try {
      setIsLoading(true);
      const walletsRes = await fetch(`${apiUrl}/wallets`);

      if (!walletsRes.ok) {
        toast({
          title: "Something went wrong.",
          description: "Please try again.",
          variant: "destructive",
        })
      }

      const wallets: WalletRequestResponse[] = await walletsRes.json();
      // check if id is valid first
      if(isWalletIdValid){
        // filter the response for the entered wallet id,
      const isWallet = wallets.filter((w) => w.id === enteredWalletId)[0];
      // if exists, set in localStorage, and go to wallet page.
      if (isWallet) {
        const walletData = {
          id: isWallet.id,
          lightning_address: isWallet.lightning_address,
          withdrawal_fee: isWallet.withdrawal_fee.toString(),
          preferred_fiat_currency: isWallet.preferred_fiat_currency,
        }

        setValue(walletData)
        setIsLoading(false);
        navigate('/wallet');
      } else {
        toast({
          title: "Wallet doesn't exist",
          description: "Sorry we couldn't find this wallet. Are you sure?",
          variant: "destructive",
        })
      }
      } else {
        toast({
          title: "Invalid wallet",
          description: "Please use a valid wallet ID",
          variant: "destructive",
        })
        setIsLoading(false);
      }
      
    } catch (e: any) {
      setErrorMsg('This wallet does not exist. Perhaps create a new wallet');
      console.log(errorMsg);
    }
  };

  const validateWalletId = (walletId: string) => {
    const uuidRegex = RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    );
    return uuidRegex.test(walletId);
  };

  const handleWalletId = (e: any) => {
    const inputId = e.target.value;
    setEnteredWalletId(inputId);
  };

  const handleWalletIdBlur = (e: any) => {
    setIsWalletIdValid(validateWalletId(enteredWalletId));
  };


  return (
    <>
      <Meta description="Seamless &amp; Affordable Cross-Border Remittances" />
      <AuthShell>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
            Seamless &amp; Affordable <br />Cross-Border Remittances
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-8">
            {isMobile ? `Splice is on a mission to simplify cross-border money movement in Africa with a cost-effective solution that outshines traditional banks and neobanks.` : `Splice is on a mission to simplify cross-border money movement in Africa. We leverage Bitcoin's taproot assets and the lightning network to provide a cost-effective solution that outshines traditional banks and neobanks.`}
          </p>
          
          <div className="grid flex-col items-center mt-5">
            <Button className={cn(buttonVariants({variant: "default", size:"lg"}))} onClick={() => navigate('/create-wallet')} disabled={isLoading || isExpanded}>
              Create A New Wallet
            </Button>
          </div>
          <div className="relative justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <div className="grid items-center">
          <Collapsible
            open={isExpanded}
            onOpenChange={setIsExpanded}
          >
              
              <CollapsibleTrigger asChild>
                <Button className={cn(buttonVariants({variant: "secondary", size:"lg"}))} >   
                  Use An Existing Wallet
                  <ChevronsUpDown className="h-4 w-4 ml-2" />
                </Button>
              </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-5">
            <Form {...form}>
              <form>
                <FormField
                  control={form.control}
                  name="existingWalletId"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Enter or paste wallet ID"
                          className="resize-none text-center"
                          onChange={handleWalletId}
                          onBlur={handleWalletIdBlur}
                        />
                      </FormControl>
                      <FormDescription>
                        For example: 766269c6-94f0-4d8b-82ee-7b53b416bc0f
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid py-4">
                <Button
                  onClick={handleExistingWallet}
                  className={cn(buttonVariants())}
                  disabled={
                    isLoading || !enteredWalletId
                  }
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
            </CollapsibleContent>
          </Collapsible>
          </div>
        </div>
      </section>
      </AuthShell>
    </>
  )
}

export default Welcome;