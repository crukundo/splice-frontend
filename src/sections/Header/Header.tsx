import React from 'react';


import {dashboardConfig } from '@/config';
import { MainNav } from '@/components/main-nav';

function Header() {

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav} />
          {/* <AccountNav
            id={wallet.id!}
            lnAddress={wallet.lnAddress!}
            fiatCurrency={wallet.fiatCurrency!}
            withdrawFee={wallet.withdrawFee!}
          /> */}
        </div>
      </header>
  );
}

export default Header;
