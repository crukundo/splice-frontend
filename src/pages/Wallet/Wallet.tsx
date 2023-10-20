import React, { useEffect } from 'react';

import { CurrencyBitcoin } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import { BitcoinIcon } from '@bitcoin-design/bitcoin-icons-react/filled';

import Meta from '@/components/Meta';
import { FullSizeAtopFlexBox } from '@/components/styled';
import { apiUrl, storedWalletId } from '@/config';
import { BalanceProps, WalletRequestResponse } from '@/utils/interfaces';

function Wallet() {
  const [userWallet, setUserWallet] = React.useState<WalletRequestResponse | null>(null);
  const [loading, setLoading] = React.useState(false);

  const WalletBalanceCard = () => {
    const balances = userWallet?.balances;

    const AvatarIcon = (currency: string) => {
      if (currency === 'BTC') {
        return (
          <Avatar sx={{ bgcolor: '#fff' }}>
            <BitcoinIcon style={{ height: '40px', width: '40px', color: '#F7931A' }} />
          </Avatar>
        );
      } else {
        return <Avatar src={`https://flagcdn.com/w40/ke.png`} />;
      }
    };

    return (
      <List sx={{ width: '100%', maxWidth: 600 }} subheader="Wallet & balances">
        {balances?.map(({ amount, currency }: BalanceProps, index: number) => (
          <ListItem key={index} sx={{ bgcolor: 'background.paper' }} divider={true}>
            <ListItemAvatar>{AvatarIcon(currency)}</ListItemAvatar>
            <ListItemText primary={amount} secondary={currency} />
          </ListItem>
        ))}
      </List>
    );
  };

  const getUserWallet = async () => {
    const storedWallet = localStorage.getItem(storedWalletId);
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/wallets/${storedWallet}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // show as an alert or notification
        throw new Error("Couldn't get wallet");
      }

      const responseData: WalletRequestResponse = await response.json();

      setUserWallet(responseData);
      setLoading(false);
      return responseData;
    } catch (error: any) {
      console.log('Error: ', error.message);
    }

    // const response: WalletRequestResponse = {
    //   id: '766269c6-93f0-4d8b-83ee-7b51b416bc0f',
    //   lightning_address: '722814569@splice.africa',
    //   withdrawal_fee: 8,
    //   balances: [
    //     { amount: 2.0, currency: 'BTC' },
    //     { amount: 99935.19999999998, currency: 'KES' },
    //   ],
    // };
    // return response;
  };

  useEffect(() => {
    if (!userWallet) {
      getUserWallet();
    }
    console.log('Wallet: ', userWallet);
  }, [userWallet]);

  return (
    <>
      <Meta title="Wallet" />
      <FullSizeAtopFlexBox>
        <Box width={480}>
          <Stack spacing={2} sx={{ p: 1 }}>
            {loading ? (
              <Stack spacing={2}>
                <Skeleton variant="rectangular" width={380} height={104} />
                <Skeleton variant="rounded" width={380} height={104} />
              </Stack>
            ) : (
              <WalletBalanceCard />
            )}
          </Stack>
        </Box>
      </FullSizeAtopFlexBox>
    </>
  );
}

export default Wallet;
