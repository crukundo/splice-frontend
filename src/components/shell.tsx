import * as React from 'react';

import { cn } from '@/lib/utils';

import { SiteFooter } from './site-footer';
import Header from '@/sections/Header';
import Sidebar from '@/sections/Sidebar';

type DashboardShellProps = React.HTMLAttributes<HTMLDivElement>;

export function DashboardShell({
  children,
  // eslint-disable-next-line react/prop-types
  className,
  ...props
}: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col space-y-6">
      <Header />
      <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
        <Sidebar />
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <div className={cn('grid items-start gap-8', className)} {...props}>
            {children}
          </div>
        </main>
      </div>
      <SiteFooter className="border-t" />
    </div>
  );
}
