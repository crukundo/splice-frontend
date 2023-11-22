import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarImage } from "./ui/avatar"
import { Wallet } from "@/lib/interfaces"
import { Link } from "react-router-dom"

export function AccountNav() {

  const wallet = JSON.parse(
    '{"id":"a1e0ac27-5cfe-40c5-835c-b302e0ecd918","lightning_address":"254721234499@splice.africa","withdrawal_fee":"100","preferred_fiat_currency":"KES"}'
  )


  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-8 w-8">
            <AvatarImage alt="Picture" src={`https://robohash.org/${wallet.id}`} />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {wallet.alias && <p className="font-medium">{wallet.alias}</p>}
            {wallet.lightning_address && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {wallet.lightning_address}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile">Copy splice address</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/billing">Copy wallet id</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/dashboard/settings">Edit profile</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault()
          }}
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
