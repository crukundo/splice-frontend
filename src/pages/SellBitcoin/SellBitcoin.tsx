import React, { useEffect } from 'react';

import { CopyAll, Share } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  InputAdornment,
  LinearProgress,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';

import Meta from '@/components/Meta';
import SpliceQrCode from '@/components/QRCode';
import { FullSizeAtopFlexBox } from '@/components/styled';
import { apiUrl, storedFiatCurrency } from '@/config';
import useNotifications from '@/store/notifications';
import {
  CalculateRampBody,
  CalculateRampResponse,
  GenerateRampInvoiceBody,
  GenerateRampInvoiceResponse,
} from '@/utils/interfaces';
import sleep from '@/utils/sleep';

function SellBitcoin() {
  const [loading, setLoading] = React.useState(false);
  const [sellRate, setSellRate] = React.useState(0);
  const [btcForSale, setBtcForSale] = React.useState(0);
  const [fiatToReceive, setFiatToReceive] = React.useState(0);
  const lastUpdateTimeString = localStorage.getItem('lastUpdateTime');
  const initialLastUpdateTime = lastUpdateTimeString ? parseInt(lastUpdateTimeString) : 0;
  const [lastUpdateTime, setLastUpdateTime] = React.useState<number>(initialLastUpdateTime);
  const currentTime = Date.now();
  const timeSinceLastUpdate = currentTime - lastUpdateTime;
  const [confirmFiatAmountToReceive, setConfirmFiatAmountToReceive] = React.useState(false);
  const [saleErrorMsg, setSellErrorMessage] = React.useState('');
  const [generatedInvoice, setGeneratedInvoice] = React.useState('');
  const [, notifyActions] = useNotifications();

  const fiatCurrency = localStorage.getItem(storedFiatCurrency) || 'KES'; // @todo remove the or option. Only for testing

  const getSellRate = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${apiUrl}/rate/<source>/<destination>?source=BTC&destination=${fiatCurrency}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        // show as an alert or notification
        setSellErrorMessage("Couldn't get sell rate");
        return;
      }

      const { rate } = await response.json();
      console.log(rate);
      setSellRate(rate);
      // Update the last update time
      setLastUpdateTime(currentTime);
      localStorage.setItem('lastUpdateTime', currentTime.toString());
      setLoading(false);
    } catch (error: any) {
      console.log('Error: ', error.message);
    }
  };

  useEffect(() => {
    const timeInMilliseconds = 12 * 60 * 60 * 1000; // only calculate rate after 12 hours since last update

    if (sellRate === 0 || timeSinceLastUpdate >= timeInMilliseconds) {
      getSellRate();
    }
  });

  const handleBtcAmount = (event: any) => {
    const inputBtcAmount = event.target.value;
    setBtcForSale(inputBtcAmount);
  };

  const calculateFiatAmountOff = async () => {
    setLoading(true);
    const payload: CalculateRampBody = {
      source: 'BTC',
      destination: fiatCurrency,
      amount: btcForSale,
      rate: sellRate,
    };
    console.log('sell payload: ', payload);
    try {
      const response = await fetch(`${apiUrl}/on/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setSellErrorMessage("Couldn't resolve calculator api");
        return;
      }

      await response.json().then((data: CalculateRampResponse) => {
        console.log('calculateRampRes: ', data);
        setFiatToReceive(Math.round(data.amount)); // rounded off to a whole number to maintain fiat standard
      });
      setLoading(false);
    } catch (error: any) {
      console.log('Error calculating fiat amount: ', error.message);
      setSellErrorMessage(error.message);
    }
  };

  useEffect(() => {
    // only run this if fiat input exceeds a reasonable amount
    if (btcForSale > 0) {
      calculateFiatAmountOff();
    }
  }, [btcForSale]);

  const generateRampInvoice = async () => {
    setLoading(true);
    const payload: GenerateRampInvoiceBody = {
      amount: btcForSale,
      currency: 'BTC',
    };

    try {
      const response = await fetch(`${apiUrl}/on/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // @todo: show as an alert or notification
        throw new Error('Failed to generate invoice');
      }

      await response.json().then((data: GenerateRampInvoiceResponse) => {
        console.log('generateRampInvoiceRes: ', data);
        setGeneratedInvoice(data.destinationAddress);
      });
      setLoading(false);
    } catch (error: any) {
      setSellErrorMessage(error.message);
      console.log('Error creating ramp invoice: ', error.message);
    }
  };

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(generatedInvoice);
    notifyActions.push({
      message: 'Invoice copied to clipboard',
      dismissed: true,
      options: {
        variant: 'info',
      },
    });
  };

  const handleShareInvoice = (event: any) => {
    event.preventDefault();
    if (navigator.share) {
      navigator
        .share({
          title: `Invoice for ${btcForSale} BTC`,
          text: generatedInvoice,
        })
        .then(() => {
          console.log('Shared!');
        })
        .catch(console.error);
    }
  };

  return (
    <>
      <Meta title="Sell bitcoin" />
      <FullSizeAtopFlexBox>
        <Box width={480} sx={{ mt: 4, px: 2, pb: 5 }}>
          <Stack spacing={2}>
            {saleErrorMsg && (
              <Alert sx={{ mb: 2 }} severity="error">
                {saleErrorMsg}
              </Alert>
            )}
            <TextField
              required
              tabIndex={0}
              id="fiat-amount"
              label="If you send"
              type="number"
              onChange={handleBtcAmount}
              value={btcForSale}
              InputProps={{
                startAdornment: <InputAdornment position="start">BTC</InputAdornment>,
              }}
              disabled={loading || !!generatedInvoice}
              helperText={
                btcForSale !== 0
                  ? `Also equivalent to ${(btcForSale * 100000000).toLocaleString()} sats`
                  : ''
              }
            />
            <TextField
              tabIndex={1}
              required
              id="bitcoin-amount"
              label="You will receive"
              value={fiatToReceive.toLocaleString()}
              InputProps={{
                endAdornment: <InputAdornment position="start">{fiatCurrency}</InputAdornment>,
              }}
              disabled={true}
            />
            {fiatToReceive !== 0 && (
              <FormControlLabel
                required
                control={<Switch color="primary" />}
                label={`Seller accepts to receive ${fiatToReceive.toLocaleString()} ${fiatCurrency}`}
                labelPlacement="end"
                value={confirmFiatAmountToReceive}
                onChange={() => {
                  setConfirmFiatAmountToReceive(!confirmFiatAmountToReceive);
                }}
                disabled={loading || !!generatedInvoice}
              />
            )}
            {loading && <LinearProgress />}
            {confirmFiatAmountToReceive && (
              <>
                <Button
                  variant="contained"
                  onClick={generateRampInvoice}
                  size="large"
                  disabled={loading || !!generatedInvoice}
                >
                  {`Create invoice for ${btcForSale} BTC`}
                </Button>
                {generatedInvoice && (
                  <Stack spacing={2} sx={{ mt: 5 }}>
                    <Typography align="center" variant="subtitle2">
                      Show this QR Code to the seller
                    </Typography>
                    <SpliceQrCode
                      invoice={generatedInvoice}
                      amount={btcForSale}
                      currency="BTC"
                      size={250}
                    />
                    <Stack spacing={2} direction="row" sx={{ justifyContent: 'center' }}>
                      <Button variant="text" onClick={handleCopyInvoice} startIcon={<CopyAll />}>
                        Copy invoice
                      </Button>
                      <Button variant="text" onClick={handleShareInvoice} startIcon={<Share />}>
                        Share invoice
                      </Button>
                    </Stack>

                    <Button
                      variant="contained"
                      onClick={async () => {
                        setLoading(true);
                        await sleep(1500);
                        setGeneratedInvoice('');
                        setBtcForSale(0);
                        setFiatToReceive(0);
                      }}
                      color="success"
                      size="large"
                    >
                      Mark complete
                    </Button>
                  </Stack>
                )}
              </>
            )}
          </Stack>
        </Box>
      </FullSizeAtopFlexBox>
    </>
  );
}

export default SellBitcoin;
