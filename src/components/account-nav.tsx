"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Wallet } from "@/types"

import sleep from "@/lib/sleep"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { toast } from "./ui/use-toast"

export function AccountNav(wallet: Wallet) {
  const router = useRouter()

  const handleLogout = async () => {
    await sleep(1000)
    localStorage.clear()
    toast({
      title: "Logged out",
      description: "See you later",
    })
    await sleep(1000)
    router.refresh()
    router.push("/dashboard")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
          {wallet.avatar ? (
            <AvatarImage alt="Picture" src={wallet.avatar} />
          ) : (
            <AvatarFallback>
              <AvatarImage
                alt="Picture"
                src={`https://robohash.org/${wallet.id}`}
              />
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {wallet.alias && <p className="font-medium">{wallet.alias}</p>}
            {wallet.lnAddress && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {wallet.lnAddress}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/billing">Billing</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault()
            handleLogout
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
