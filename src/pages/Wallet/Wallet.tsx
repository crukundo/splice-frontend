import React, { useEffect } from 'react';

import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import Meta from '@/components/Meta';
import { FullSizeAtopFlexBox } from '@/components/styled';
import { apiUrl, storedWalletId } from '@/config';
import { BalanceProps, WalletRequestResponse } from '@/utils/interfaces';

function Wallet() {
  const [userWallet, setUserWallet] = React.useState<WalletRequestResponse | null>(null);
  const [loading, setLoading] = React.useState(false);

  const WalletBalanceCard = () => {
    const balances = userWallet?.balances;
    if (!balances) {
      return;
    }
    return (
      <>
        {balances.map(({ amount, currency }: BalanceProps, index: number) => (
          <Card variant="outlined" sx={{ mb: 2 }} key={index}>
            <CardContent>
              <Typography variant="h5">{amount}</Typography>
              <Typography variant="h6">{currency}</Typography>
            </CardContent>
          </Card>
        ))}
      </>
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
          <Stack spacing={2} sx={{ m: 2 }}>
            <Typography variant="h5" component="h1" align="center">
              {loading ? (
                <Stack spacing={2} sx={{ p: 2 }}>
                  <Skeleton variant="rectangular" width={380} height={104} />
                  <Skeleton variant="rounded" width={380} height={104} />
                </Stack>
              ) : (
                <WalletBalanceCard />
              )}
            </Typography>
          </Stack>
        </Box>
      </FullSizeAtopFlexBox>
    </>
  );
}

export default Wallet;
