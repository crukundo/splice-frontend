import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarImage } from "./ui/avatar"
import { Link } from "react-router-dom"
import { Badge } from "./ui/badge"
import { Fragment } from "react"
import { Wallet } from "@/lib/interfaces"
import { ZapIcon } from "lucide-react"

export function AccountNav(wallet: Wallet) {

  const fakeId = '95b650d2-8fa1-4b6c-a341-0e0ba2f4f231' 
  
  // @todo: replace fakeId with wallet.id later
  // use actual wallet id from storage

  return (
    <Fragment>
      <Badge variant="secondary"><ZapIcon className="h-4 w-4 mr-2 text-orange-400" /> 254712345678@splice.africa</Badge>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="h-8 w-8">
            <AvatarImage alt="Picture" src={`https://robohash.org/${fakeId}`} />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to="">Copy splice address</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="">Copy wallet id</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(event) => {
              event.preventDefault()
            } }
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  )
}
