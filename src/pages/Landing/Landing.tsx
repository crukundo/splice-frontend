import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

import { buttonVariants } from '@/components/ui/button';

import Meta from '@/components/Meta';
import { AuthShell } from '@/components/auth-shell';

function Landing() {
  return (
    <>
      <Meta description="Seamless &amp; Affordable Cross-Border Remittances" />
      <AuthShell>
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Revolutionizing Payments Infrastructure across Africa.
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 py-3">
              We are on a mission to build infrastructure that allows financial institutions,
              fintechs and developers to build solutions that allow africans to move money across
              borders.
            </p>
            <div className="space-x-4">
              <Link to="/" className={cn(buttonVariants({ size: 'lg' }))}>
                Request a demo today
              </Link>
            </div>
          </div>
        </section>
        <section
          id="joinUs"
          className="container space-y-6 bg-orange-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-2xl leading-[1.1] sm:text-xl md:text-5xl">
              Join the Future of Payments
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-xl sm:leading-8 ">
              Come and be a part of our efforts to establish financial infrastructure for payments
              in Africa. We&apos;re committed to addressing the current lack of financial
              infrastructure on our continent and are actively working towards its transformation.
            </p>
            <div className="space-x-4 py-2">
              <Link
                to={'/'}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
              >
                Talk to us
              </Link>
            </div>
          </div>
        </section>
      </AuthShell>
    </>
  );
}

export default Landing;
