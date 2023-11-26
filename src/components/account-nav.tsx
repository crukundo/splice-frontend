import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Fragment } from "react"
import { WalletRequestResponse } from "@/lib/interfaces"
import { ZapIcon } from "lucide-react"
import { logout } from "@/lib/logout"
import { toast } from "./ui/use-toast"
import { useNavigate } from "react-router-dom"

interface AccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  wallet?: WalletRequestResponse
}

function AccountNav({ wallet }: AccountNavProps) {

  const navigate = useNavigate()
  
  return (
    <Fragment>
      <Badge variant="secondary" className="font-mono text-xs"><ZapIcon className="h-4 w-4 mr-2 text-orange-400" /> {wallet?.lightning_address}</Badge>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="h-8 w-8">
            <AvatarImage alt="Picture" src={`https://robohash.org/${wallet?.id}`} />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => {
            navigator.clipboard.writeText(wallet?.lightning_address!);
            toast({
              title: "Copied",
              description: "Your splice address is on your clipboard",
            })
          }} asChild>
             <span>Copy splice address</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            navigator.clipboard.writeText(wallet?.id!);
            toast({
              title: "Copied",
              description: "Your wallet id is on your clipboard",
            })
          }} asChild>
            <span>Copy wallet id</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={async (event) => {
              event.preventDefault()
              await logout()
              navigate('/')
            } }
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  )
}

export {AccountNav}