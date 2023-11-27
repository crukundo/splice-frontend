import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { WalletRequestResponse } from '@/lib/interfaces';
import { getCurrentWallet } from '@/lib/session';

import { AccountNav } from '@/components/account-nav';
import { MainNav } from '@/components/main-nav';

import { dashboardConfig } from '@/config';

function Header() {
  const [foundWallet, setFoundWallet] = useState<WalletRequestResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkWallet() {
      try {
        const wallet = await getCurrentWallet();
        if (!wallet) {
          navigate('/');
        } else {
          setFoundWallet(wallet as WalletRequestResponse);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }

    checkWallet();
  }, [navigate]);

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <MainNav items={dashboardConfig.mainNav} mobileLinks={dashboardConfig.sidebarNav} />
        <AccountNav
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          wallet={foundWallet!}
        />
      </div>
    </header>
  );
}

export default Header;
