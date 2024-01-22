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
          <div className="container flex flex-col md:flex-row max-w-[64rem] items-center text-center">
            <div className="md:w-1/2 order-2 md:order-1 max-w-[60rem] text-center md:text-left">
              <h1 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl">
                Revolutionizing Payments Infrastructure across Africa.
              </h1>
              <p className="max-w-[45rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 py-5">
                In a diverse landscape with unique currencies and multiple payment providers in each
                country, we&apos;re here to rewrite the rules and make cross-border transactions
                seamless, cost-effective, and convenient.
              </p>
              <div className="space-x-4">
                <Link to="/" className={cn(buttonVariants({ size: 'lg' }))}>
                  Talk to us
                </Link>
                <Link
                  to={'/'}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
                >
                  Request a demo
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 order-1 md:order-2 flex justify-center">
              <div className="heroContainer globe">
                <video poster="@/assets/globe-poster.jpg">
                  <source
                    src="@/assets/globe.webm"
                    type="video/webm; codecs=av01.0.12M.08.0.110.01.01.01.0"
                  />
                  <source src="@/assets/globe.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Get ahead with Splice
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 py-2">
              Splice offers a suite of powerful developer tools tailored for enterprises. Our
              solutions provide the foundation for businesses to navigate the complexities of the
              Africa payment landscape effortlessly.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="h-12 w-12 fill-current"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <div className="space-y-2">
                  <h3 className="font-bold">Developer Focused</h3>
                  <p className="text-sm text-muted-foreground">
                    Experience seamless integration with Splice&apos;s developer-friendly solutions.
                    Integration without complexity.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="h-12 w-12 fill-current"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <div className="space-y-2">
                  <h3 className="font-bold">Ironclad Security</h3>
                  <p className="text-sm text-muted-foreground">
                    We incorporate state-of-the-art security measures to safeguard your data and
                    transactions.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="h-12 w-12 fill-current"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <div className="space-y-2">
                  <h3 className="font-bold">Transparent Transactions</h3>
                  <p className="text-sm text-muted-foreground">
                    Trust is built on transparency. Monitor your financial operations in real time
                    with clarity and confidence.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="h-12 w-12 fill-current"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <div className="space-y-2">
                  <h3 className="font-bold">Uncompromising Accessibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Our inclusive design principles ensure that all users, regardless of ability,
                    can navigate our platform with ease.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="h-12 w-12 fill-current"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <div className="space-y-2">
                  <h3 className="font-bold">Customer-Centric Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Your success is our success. Our dedicated team is ready to address your queries
                    and challenges promptly.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[200px] flex-col justify-between rounded-md p-6">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="h-12 w-12 fill-current"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <div className="space-y-2">
                  <h3 className="font-bold">Reliability Redefined</h3>
                  <p className="text-sm text-muted-foreground">
                    Our robust infrastructure guarantees that your payments are always processed
                    swiftly and reliably.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="open-source" className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-2xl leading-[1.1] sm:text-2xl md:text-5xl">
              Join the Future of Payments
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Join us on our journey to reshape African payments. Embrace the future of financial
              transactions with Splice, where innovation meets accessibility.
            </p>
            <div className="space-x-4 py-2">
              <Link to="/" className={cn(buttonVariants({ size: 'lg' }))}>
                Talk to us
              </Link>
              <Link
                to={'/'}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
              >
                Request a demo
              </Link>
            </div>
          </div>
        </section>
      </AuthShell>
    </>
  );
}

export default Landing;
