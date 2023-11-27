import * as React from 'react';
import { Link } from 'react-router-dom';

import { MainNavItem, SidebarNavItem } from '@/lib/interfaces';
import { cn } from '@/lib/utils';

import { Icons } from '@/components/icons';
import { MobileNav } from '@/components/mobile-nav';

import { title } from '@/config';

interface MainNavProps {
  items?: MainNavItem[];
  mobileLinks?: SidebarNavItem[];
  children?: React.ReactNode;
}

export function MainNav({ items, mobileLinks, children }: MainNavProps) {
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  return (
    <div className="flex gap-6 md:gap-10">
      <Link to="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo />
        <span className="hidden font-bold sm:inline-block">{title}</span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map((item, index) => (
            <Link
              key={index}
              to={item.disabled ? '#' : item.href}
              className={cn(
                'flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm',
                item.href.startsWith(`/wallet`) ? 'text-foreground' : 'text-foreground/60',
                item.disabled && 'cursor-not-allowed opacity-80',
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <Icons.close /> : <Icons.logo />}
      </button>
      {showMobileMenu && mobileLinks && <MobileNav items={mobileLinks}>{children}</MobileNav>}
    </div>
  );
}
