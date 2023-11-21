import * as React from "react"
import { PhoneCall } from "lucide-react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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

export { Input, MobileInput }
