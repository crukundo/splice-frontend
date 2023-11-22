import React from 'react';


import {dashboardConfig } from '@/config';
import { MainNav } from '@/components/main-nav';
import { AccountNav } from '@/components/account-nav';

function Header() {

  // for testing only
  const wallet = JSON.parse(
    '{"id":"a1e0ac27-5cfe-40c5-835c-b302e0ecd918","lightning_address":"254721234499@splice.africa","withdrawal_fee":"100","preferred_fiat_currency":"KES"}'
  )

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav} />
          <AccountNav
            id={wallet.id!}
            lnAddress={wallet.lightning_address!}
            fiatCurrency={wallet.fiatCurrency!}
            withdrawFee={wallet.withdrawFee!}
          />
        </div>
      </header>
  );
}

export default Header;
