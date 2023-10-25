import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CurrencyExchange } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { BitcoinIcon } from '@bitcoin-design/bitcoin-icons-react/filled';

import Meta from '@/components/Meta';
import { FullSizeAtopFlexBox } from '@/components/styled';
import { apiUrl, storedFiatCurrency, storedWalletId } from '@/config';
import useNotifications from '@/store/notifications';
import { BalanceProps, WalletRequestResponse } from '@/utils/interfaces';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#f2f2f2',
  ...theme.typography.h5,
  padding: theme.spacing(1),
  color: theme.palette.text.primary,
}));

function Wallet() {
  const navigate = useNavigate();
  const [, notifyActions] = useNotifications();
  const storedWallet = localStorage.getItem(storedWalletId);

  useEffect(() => {
    if (!storedWallet) {
      navigate('/');
      notifyActions.push({
        message: 'No wallet found',
        dismissed: true,
        options: {
          variant: 'error',
        },
      });
    }
  }, [storedWallet]);

  const [userWallet, setUserWallet] = React.useState<WalletRequestResponse | null>(null);
  const [loading, setLoading] = React.useState(false);

  const WalletBalanceCard = () => {
    const balances = userWallet?.balances;

    const getCurrencyIcon = (currency: string): JSX.Element => {
      let avatar: JSX.Element;

      switch (currency) {
        case 'BTC':
          avatar = (
            <Avatar sx={{ bgcolor: '#fff' }}>
              <BitcoinIcon style={{ height: '40px', width: '40px', color: '#F7931A' }} />
            </Avatar>
          );
          break;
        case 'KES':
          avatar = <Avatar src={`https://flagcdn.com/w40/ke.png`} sx={{ width: 40, height: 40 }} />;
          break;
        case 'NGN':
          avatar = <Avatar src={`https://flagcdn.com/w40/ng.png`} sx={{ width: 40, height: 40 }} />;
          break;
        default:
          avatar = (
            <Avatar sx={{ width: 40, height: 40 }}>
              <CurrencyExchange />
            </Avatar>
          );
      }
      console.log(avatar);
      return avatar;
    };

    return (
      <>
        {balances?.map(({ amount, currency }: BalanceProps, index: number) => (
          <Paper
            key={index}
            sx={{
              p: 2,
              margin: 'auto',
              maxWidth: 500,
              flexGrow: 1,
              backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff'),
              borderRadius: 2,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm container alignItems="center">
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <Typography variant="h4" sx={{ fontFamily: 'monospace' }}>
                      {amount.toLocaleString()}
                    </Typography>
                    <Typography variant="subtitle2">{currency}</Typography>
                  </Grid>
                </Grid>
                <Grid item>{getCurrencyIcon(currency)}</Grid>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </>
    );
  };

  const getUserWallet = async () => {
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
  };

  useEffect(() => {
    if (storedWallet) {
      getUserWallet();
    } else {
      navigate('/');
      notifyActions.push({
        message: 'No wallet found',
        dismissed: true,
        options: {
          variant: 'error',
        },
      });
    }
  }, [storedWallet]);

  return (
    <>
      <Meta title="Wallet" />
      <FullSizeAtopFlexBox>
        <Box width={480}>
          <Stack spacing={2}>
            <Typography sx={{ pt: 2 }} variant="h5">
              Wallets
            </Typography>
            {loading ? (
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid xs={6}>
                  <Skeleton variant="rectangular" height={50} />
                </Grid>
                <Grid xs={6}>
                  <Skeleton variant="rectangular" height={50} />
                </Grid>
              </Grid>
            ) : (
              <>
                <WalletBalanceCard />
                <Typography sx={{ pt: 1 }} variant="h5">
                  Transaction history
                </Typography>
              </>
            )}
          </Stack>
        </Box>
      </FullSizeAtopFlexBox>
    </>
  );
}

export default Wallet;
