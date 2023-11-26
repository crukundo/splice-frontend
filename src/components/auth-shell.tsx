import * as React from "react"

import { cn } from "@/lib/utils"
import { SiteFooter } from "./site-footer"
import { Link } from "react-router-dom"
import { buttonVariants } from "./ui/button"
import { dashboardConfig } from "@/config"
import { MainNav } from "./main-nav"
import { ModeToggle } from "./mode-toggle"

interface AuthShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AuthShell({
  children,
  className,
  ...props
}: AuthShellProps) {
  return (
    <div className={cn("min-h-screen", className)} {...props}>
       <div className="flex min-h-screen flex-col">
        <header className="container z-40 bg-background">
          <div className="flex h-20 items-center justify-between py-6">
            <MainNav items={dashboardConfig.mainNav} />
            <nav>
              {/* <Link
                to="/login"
                className={cn(
                  buttonVariants({ variant: "secondary", size: "sm" }),
                  "px-4"
                )}
              >
                Login
              </Link> */}
              <ModeToggle />
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  )
}
