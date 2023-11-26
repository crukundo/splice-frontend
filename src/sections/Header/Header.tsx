import React, { useEffect, useState } from 'react';


import {dashboardConfig } from '@/config';
import { MainNav } from '@/components/main-nav';
import { AccountNav } from '@/components/account-nav';
import { useNavigate } from 'react-router-dom';
import { getCurrentWallet } from '@/lib/session';
import { WalletRequestResponse } from '@/lib/interfaces';

function Header() {

  const [foundWallet, setFoundWallet] = useState<WalletRequestResponse | null>(null)
  const navigate = useNavigate();

  useEffect(() => {
    async function checkWallet() {
      try {
        const wallet = await getCurrentWallet();
        if (!wallet) {
          navigate('/login')
        } else {
          setFoundWallet(wallet as WalletRequestResponse)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }

    checkWallet()
  }, [navigate])

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <MainNav items={dashboardConfig.mainNav} />
          <AccountNav
            wallet={foundWallet!}
          />
        </div>
      </header>
  );
}

export default Header;
