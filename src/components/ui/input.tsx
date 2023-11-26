import * as React from "react"
import { Avatar, AvatarImage } from "./avatar"
import { cn } from "@/lib/utils"
import { AtSignIcon, PhoneCall } from "lucide-react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

type MobileInputProps = InputProps & {
  country: string
}

const MobileInput = React.forwardRef<HTMLInputElement, MobileInputProps>(
  ({ className, country, ...props }, ref) => (
    <div className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2">
      <PhoneCall className="my-1 mr-2 h-4 w-4 shrink-0 opacity-50" />
      {country && <p>+{country}</p>}
      <input
        type="text"
        className={cn(
          "text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
)

MobileInput.displayName = "Mobile Input"

const getCurrencyIcon = (currency: string): JSX.Element => {
  let avatar: JSX.Element;

  switch (currency) {
    case 'BTC':
      avatar = (
        <svg className="h-10 w-10 text-muted-foreground" viewBox="0.004 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M63.04 39.741c-4.274 17.143-21.638 27.575-38.783 23.301C7.12 58.768-3.313 41.404.962 24.262 5.234 7.117 22.597-3.317 39.737.957c17.144 4.274 27.576 21.64 23.302 38.784z" fill="#f7931a"/><path d="M46.11 27.441c.636-4.258-2.606-6.547-7.039-8.074l1.438-5.768-3.512-.875-1.4 5.616c-.922-.23-1.87-.447-2.812-.662l1.41-5.653-3.509-.875-1.439 5.766c-.764-.174-1.514-.346-2.242-.527l.004-.018-4.842-1.209-.934 3.75s2.605.597 2.55.634c1.422.355 1.68 1.296 1.636 2.042l-1.638 6.571c.098.025.225.061.365.117l-.37-.092-2.297 9.205c-.174.432-.615 1.08-1.609.834.035.051-2.552-.637-2.552-.637l-1.743 4.02 4.57 1.139c.85.213 1.683.436 2.502.646l-1.453 5.835 3.507.875 1.44-5.772c.957.26 1.887.5 2.797.726L27.504 50.8l3.511.875 1.453-5.823c5.987 1.133 10.49.676 12.383-4.738 1.527-4.36-.075-6.875-3.225-8.516 2.294-.531 4.022-2.04 4.483-5.157zM38.087 38.69c-1.086 4.36-8.426 2.004-10.807 1.412l1.928-7.729c2.38.594 10.011 1.77 8.88 6.317zm1.085-11.312c-.99 3.966-7.1 1.951-9.083 1.457l1.748-7.01c1.983.494 8.367 1.416 7.335 5.553z" fill="#ffffff"/></svg>
      );
      break;
    case 'KES':
      avatar = <Avatar className="text-muted-foreground w-8 h-8">
      <AvatarImage src="src/assets/ke.png" alt="Kenyan shillings" />
    </Avatar>;
      break;
    case 'NGN':
      avatar = <Avatar className="text-muted-foreground">
      <AvatarImage src="src/assets/ng.png" alt="Nigerian Naira" />
    </Avatar>;
      break;
    case 'GHS':
      avatar = <Avatar className="text-muted-foreground">
      <AvatarImage src="src/assets/gh.png" alt="Nigerian Naira" />
    </Avatar>;
      break;
    default:
      avatar = (
        <Avatar className="text-muted-foreground">
        <AvatarImage src="src/assets/gh.png" alt="Ghanian Cedi" />
      </Avatar>
      );
  }
  return avatar;
};


export interface SpliceAmountInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    currency: string;
  }

const SpliceAmountInput = React.forwardRef<HTMLInputElement, SpliceAmountInputProps>(
  ({ className, type, currency, ...props }, ref) => {
    return (
      <div className="relative rounded-lg shadow-lg">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
      {getCurrencyIcon(currency)}
      </span>
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-8 pl-16 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      </div>
    )
  }
)
SpliceAmountInput.displayName = "Splice Amount Input"

export interface SpliceAddressInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    isValid?: boolean;
  }

const SpliceAddressInput = React.forwardRef<HTMLInputElement, SpliceAddressInputProps>(
  ({ className, type, isValid, ...props }, ref) => {

  let iconColor = 'text-gray-500 dark:text-black-500';

  if (!isValid) {
    iconColor = 'text-red-500 dark:text-red-500';
  } else if (isValid) {
    iconColor = 'text-green-500 dark:text-green-500';
  }

    return (
      <div className="relative rounded-lg shadow-lg">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
        <AtSignIcon className={`h-5 w-5 ${iconColor}`} />
      </span>
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-6 pl-10 text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
      </div>
    )
  }
)
SpliceAddressInput.displayName = "Splice Address Input"

export { Input, MobileInput,  SpliceAmountInput, SpliceAddressInput}