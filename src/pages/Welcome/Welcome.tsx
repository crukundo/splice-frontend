import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Meta from '@/components/Meta';
import { Button } from '@/components/ui/button';
import { apiUrl, storedLnAddress, storedWalletId, storedWithdrawFee } from '@/config';
import { WalletRequestResponse } from '@/lib/interfaces';

function Welcome() {
  const navigate = useNavigate();
  const [walletId, setWalletId] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isWalletIdValid, setIsWalletIdValid] = useState(true);

  const storedWallet = localStorage.getItem(storedWalletId);
  console.log('storedWallet: ', storedWallet);

  const onPressNew = () => {
    navigate('/create');
  };

  const onPressContinue = () => {
    navigate('/wallet');
  };

  const validateWalletId = (walletId: string) => {
    const uuidRegex = RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    );
    return uuidRegex.test(walletId);
  };

  const handleWalletId = (e: any) => {
    const inputId = e.target.value;
    setWalletId(inputId);
  };

  const handleWalletIdBlur = (e: any) => {
    setIsWalletIdValid(validateWalletId(walletId));
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleExistingWallet = async () => {
    try {
      // get all wallets from API,
      setLoading(true);
      const walletsRes = await fetch(`${apiUrl}/wallets`);

      const wallets: WalletRequestResponse[] = await walletsRes.json();
      console.log('existing: ', wallets);
      // filter the response for the entered wallet id,
      const isWallet = wallets.filter((w) => w.id === walletId)[0];
      // if exists, set in localStorage, and go to wallet page.
      if (isWallet) {
        localStorage.setItem(storedWalletId, walletId);
        localStorage.setItem(storedLnAddress, isWallet.lightning_address);
        localStorage.setItem(storedWithdrawFee, isWallet.withdrawal_fee.toString());
        setLoading(false);
        navigate('/wallet');
      } else {
        throw new Error(errorMsg);
      }
    } catch (e: any) {
      setErrorMsg('This wallet does not exist. Perhaps create a new wallet');
      console.log(errorMsg);
    }
  };

  return (
    <>
      <Meta title="Welcome" />
      <Button onClick={handleExistingWallet} disabled={loading || !isWalletIdValid}>
        Continue
      </Button>
    </>
  );
}

export default Welcome;
