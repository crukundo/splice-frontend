import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import Meta from "@/components/Meta";
import { AuthShell } from "@/components/auth-shell";
import { useState } from "react";
import { Icons } from "@/components/icons";


function Welcome() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const navigate = useNavigate()


  return (
    <>
      <Meta title="Welcome" />
      <AuthShell>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
            Seamless &amp; Affordable <br />Cross-Border Remittances
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg sm:leading-8">
            Splice is on a mission to simplify cross-border money movement in Africa. We leverage Bitcoin's taproot assets and the lightning network to provide a cost-effective solution that outshines traditional banks and neobanks.
          </p>
          
          <div className="grid flex-col items-center mt-5">
            <Button variant="default" size="lg" onClick={() => navigate('/create-wallet')} >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}   
              Create New Wallet
            </Button>
          </div>
          <div className="relative justify-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <div className="grid flex-col items-center">
            <Button variant="outline" size="lg" >   
              Use Existing Wallet
            </Button>
          </div>
        </div>
      </section>
      </AuthShell>
    </>
  )
}

export default Welcome;