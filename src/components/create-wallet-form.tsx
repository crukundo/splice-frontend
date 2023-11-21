"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CreateWalletRequestBody, CreateWalletResponse } from "@/types"
import { useForm } from "react-hook-form"
import PhoneInput from "react-phone-input-2"

import { CountryType, allowedCountries } from "@/lib/countries"
import { formatPhoneNumber } from "@/lib/format"
import sleep from "@/lib/sleep"
import { cn } from "@/lib/utils"
import useLocalStorage from "@/hooks/use-local-storage"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Icons } from "@/components/icons"

import { Avatar, AvatarImage } from "./ui/avatar"
import { Input } from "./ui/input"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"

interface CreateWalletFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CreateWalletForm({
  className,
  ...props
}: CreateWalletFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [mobileNumber, setMobileNumber] = React.useState("")
  const [withdrawFee, setWithdrawFee] = React.useState(0)
  const [selectedCountry, setSelectedCountry] =
    React.useState<CountryType | null>(null)
  const [isValidMobile, setIsValidMobile] = React.useState(false)
  const form = useForm()
  const router = useRouter()
  const [value, setValue] = useLocalStorage(
    process.env.NEXT_PUBLIC_SPLICE_WALLET,
    ""
  )

  const onPressContinue = async () => {
    setIsLoading(true)
    const formattedNumber = formatPhoneNumber(
      mobileNumber,
      selectedCountry?.phone
    )
    const payload: CreateWalletRequestBody = {
      phoneNumber: formattedNumber,
      withdrawalFee: withdrawFee,
      preferredFiatCurrency: selectedCountry?.currency || "", // @todo handle undefined better
    }

    try {
      await sleep(2000) // first pash
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SPLICE_API}/wallets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )

      if (!response.ok) {
        // show as an alert or notification
        throw new Error("Failed to create wallet")
      }
      await sleep(2000) // first pash
      await response.json().then((data: CreateWalletResponse) => {
        console.log("createWalletRes: ", data)

        const walletData = {
          id: data.id,
          lightning_address: data.lightning_address,
          withdrawal_fee: data.withdrawal_fee.toString(),
          preferred_fiat_currency: data.preferred_fiat_currency,
        }

        const serializedWalletData = JSON.stringify(walletData)
        setValue(serializedWalletData)
      })
      setIsLoading(false)
      router.refresh()
      router.push("/dashboard")
    } catch (error: any) {
      console.log("Error creating wallet: ", error.message)
    }
  }

  // Create the valueToCountryMap by mapping the array
  const valueToCountryMap = allowedCountries.reduce((acc, country) => {
    acc[country.code] = country
    return acc
  }, {})

  const handleChosenCountry = (value) => {
    const chosen = valueToCountryMap[value]
    setSelectedCountry(chosen)
  }

  const handleMobileNumber = (value) => {
    setMobileNumber(value)
  }

  const handleWithdrawFee = (event: any) => {
    const inputFee = event.target.value
    setWithdrawFee(inputFee)
  }

  return (
    <div className={cn("grid", className)} {...props}>
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
                  className="grid max-w-md grid-cols-2 gap-8 pt-2"
                >
                  {allowedCountries.map((country) => (
                    <FormItem key={country.code}>
                      <FormLabel className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <FormControl>
                          <RadioGroupItem
                            value={country.code}
                            className="sr-only cursor-pointer"
                          />
                        </FormControl>
                        <Avatar className="mb-2">
                          <AvatarImage
                            src={`https://flagcdn.com/56x42/${country.code.toLowerCase()}.png`}
                            alt={country.label}
                          />
                        </Avatar>
                        {country.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
                <FormDescription>My country is not listed</FormDescription>
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

          <div className="grid gap-2">
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
    </div>
  )
}
