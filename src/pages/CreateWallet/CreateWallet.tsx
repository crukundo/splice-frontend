import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Meta from '@/components/Meta';
import {
  apiUrl,
  storedWallet
} from '@/config';
import { CountryType, allowedCountries } from '@/lib/countries';
import { CreateWalletRequestBody } from '@/lib/interfaces';
import useLocalStorage from '@/hooks/use-local-storage';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import { toast } from '@/components/ui/use-toast';
import { AuthShell } from '@/components/auth-shell';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface CreateNewWalletProps extends React.HTMLAttributes<HTMLDivElement> {}

function CreateNewWallet({
  className,
  ...props
}: CreateNewWalletProps) {
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [withdrawFee, setWithdrawFee] = React.useState(0);
  const [selectedCountry, setSelectedCountry] = React.useState<CountryType | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const navigate = useNavigate();
  const [, setValue] = useLocalStorage(storedWallet,"")
  const form = useForm()

  // Create the valueToCountryMap by mapping the array
  const valueToCountryMap: { [key: string]: CountryType } = allowedCountries.reduce((acc, country) => {
    acc[country.code] = country;
    return acc;
  }, {} as { [key: string]: CountryType });

  const handleChosenCountry = (value: string) => {
    const chosen = valueToCountryMap[value]
    setSelectedCountry(chosen)
  }

  const formatPhoneNumber = (
    phoneNumber: string | undefined,
    countryCode: string | undefined,
  ): string => {
    // Remove white spaces
    phoneNumber = phoneNumber?.replace(/\s/g, '');

    // Remove the country code and add '0' before '7'
    if (phoneNumber?.startsWith(`+${countryCode}`)) {
      phoneNumber = phoneNumber.replace(`+${countryCode}`, '0');
    }

    return phoneNumber as string;
  };

  const handleMobileNumber = (newNumber: string) => {
    setMobileNumber(newNumber);
  };

  const handleWithdrawFee = (event: any) => {
    const inputFee = event.target.value;
    setWithdrawFee(inputFee);
  };

  const onPressContinue = async () => {
    setIsLoading(true);
    const formattedNumber = formatPhoneNumber(mobileNumber, selectedCountry?.phone);
    const payload: CreateWalletRequestBody = {
      phoneNumber: formattedNumber,
      withdrawalFee: withdrawFee,
      preferredFiatCurrency: selectedCountry?.currency || '', // @todo handle undefined better
    };

    try {
      const response = await fetch(`${apiUrl}/wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return toast({
          title: "Something went wrong.",
          description: "Your wallet was not created. Please try again.",
          variant: "destructive",
        })
      }

      await response.json().then((data) => {
        console.log('createWalletRes: ', data);
        const walletData = {
          id: data.id,
          lightning_address: data.lightning_address,
          withdrawal_fee: data.withdrawal_fee.toString(),
          preferred_fiat_currency: data.preferred_fiat_currency,
        }

        setValue(walletData)
      });
      setIsLoading(false);
      navigate('/wallet');
    } catch (error: any) {
      console.log('Error creating wallet: ', error.message);
    }
  };

  return (
    <>
    <Meta title="Create a new wallet" />
    <AuthShell>
    <div className="grid flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="hidden h-full bg-muted lg:block" />
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <Icons.logo className="mx-auto h-6 w-6" />
            <h1 className="text-2xl font-semibold tracking-tight">
              Create a wallet
            </h1>
          </div>
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem className="my-2">
                    <FormLabel>Select Your Country</FormLabel>
                    <FormMessage />
                    <RadioGroup
                      onValueChange={handleChosenCountry}
                      className="grid max-w-md grid-cols-3 gap-3 pt-2"
                    >
                      {allowedCountries.map((country) => (
                        <FormItem key={country.code}>
                          <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            <FormControl>
                              <RadioGroupItem
                                value={country.code}
                                className="sr-only cursor-pointer"
                              />
                            </FormControl>
                            <Avatar className="mb-2">
                              <AvatarImage
                                src={`src/assets/${country.code.toLowerCase()}.png`}
                                alt={country.label}
                              />
                            </Avatar>
                            {country.label}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormItem>
                )}
              />
              {selectedCountry && (
                <FormField
                  control={form.control}
                  name="mobileNumber"
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel>Mobile number</FormLabel>
                      <FormMessage />
                      <PhoneInput
                        inputProps={{
                          required: true,
                          autoFocus: true,
                          className:
                            "flex px-3 py-2 h-10 w-full rounded-md border border-input bg-transparent w-4 shrink-0 opacity-50",
                        }}
                        value={mobileNumber}
                        country={selectedCountry?.code}
                        preferredCountries={["KE", "NG"]}
                        placeholder={`${
                          selectedCountry.code === "NG"
                            ? "234 123 457 8900"
                            : "254 701 234567"
                        }`}
                        prefix={"+"}
                        specialLabel=""
                        onChange={handleMobileNumber}
                      />
                    </FormItem>
                  )}
                />
              )}
              {mobileNumber && (
                <FormField
                  control={form.control}
                  name="withdrawFee"
                  render={({ field }) => (
                    <FormItem className="my-2">
                      <FormLabel>Withdraw fee</FormLabel>
                      <FormMessage />
                      <Input
                        id="withdrawFee"
                        type="number"
                        {...field}
                        onChange={handleWithdrawFee}
                      />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid py-4">
                <Button
                  onClick={onPressContinue}
                  className={cn(buttonVariants())}
                  disabled={
                    isLoading || !mobileNumber || !selectedCountry || !withdrawFee
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
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button className='font-normal text-sm' variant="link">I can't see my country 😥</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <p className="text-sm">We'll have an update on coverage soon</p>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
    </AuthShell>
    </>
  );
}

export default CreateNewWallet;
