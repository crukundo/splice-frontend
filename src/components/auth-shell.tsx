import * as React from "react"

import { cn } from "@/lib/utils"

interface AuthShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AuthShell({
  children,
  className,
  ...props
}: AuthShellProps) {
  return (
    <div className={cn("min-h-screen", className)} {...props}>
      {children}
    </div>
  )
}
