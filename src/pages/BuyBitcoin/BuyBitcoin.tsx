import React, { useEffect } from 'react';

import { CopyAll, Share } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  LinearProgress,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { Stack, fontSize, typography } from '@mui/system';

import Lottie from 'lottie-react';

import Meta from '@/components/Meta';
import { FullSizeAtopFlexBox } from '@/components/styled';
import { apiUrl, storedFiatCurrency, storedLnAddress } from '@/config';
import useNotifications from '@/store/notifications';
import {
  CalculateRampBody,
  CalculateRampResponse,
  PayRampInvoiceBody,
  PayRampInvoiceResponse,
} from '@/lib/interfaces';

import successfulTransaction from '../../lottie/success-transaction.json';

function BuyBitcoin() {
  const [loading, setLoading] = React.useState(false);
  const [buyRate, setBuyRate] = React.useState(0);
  const [fiatForBuy, setFiatForBuy] = React.useState(0);
  const [btcToReceive, setBtcToReceive] = React.useState(0);
  const lastUpdateTimeString = localStorage.getItem('lastUpdateTime');
  const initialLastUpdateTime = lastUpdateTimeString ? parseInt(lastUpdateTimeString) : 0;
  const [lastUpdateTime, setLastUpdateTime] = React.useState<number>(initialLastUpdateTime);
  const currentTime = Date.now();
  const timeSinceLastUpdate = currentTime - lastUpdateTime;
  const [confirmSeenBTCAmount, setConfirmSeenBTCAmount] = React.useState(false);
  const [confirmReceivedBuyerInvoice, setConfirmReceivedBuyerInvoice] = React.useState(false);
  const [lnInvoice, setLnInvoice] = React.useState('');
  const [isLnInvoiceValid, setIsLnInvoiceValid] = React.useState(true);
  const [invoiceVerified, setInvoiceVerified] = React.useState(false);
  const [buyErrorMsg, setBuyErrorMessage] = React.useState('');
  const [paymentRes, setPaymentRes] = React.useState<PayRampInvoiceResponse | null>(null);
  const [, notifyActions] = useNotifications();

  const fiatCurrency = localStorage.getItem(storedFiatCurrency) || 'KES'; // @todo remove the or option. Only for testing
  const localLnAddress = localStorage.getItem(storedLnAddress);

  const getBuyRate = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${apiUrl}/rate/<source>/<destination>?source=${fiatCurrency}&destination=BTC`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        // show as an alert or notification
        throw new Error("Couldn't get buy rate");
      }

      const { rate } = await response.json();
      console.log(rate);
      setBuyRate(rate);
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

    if (buyRate === 0 || timeSinceLastUpdate >= timeInMilliseconds) {
      getBuyRate();
    }
  });

  const handleFiatAmount = (event: any) => {
    const inputAmount = event.target.value;
    setFiatForBuy(inputAmount);
  };

  const calculateBitcoinAmountOn = async () => {
    setLoading(true);
    const payload: CalculateRampBody = {
      source: fiatCurrency,
      destination: 'BTC',
      amount: fiatForBuy,
      rate: buyRate,
    };

    try {
      const response = await fetch(`${apiUrl}/on/calculate`, {
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

      await response.json().then((data: CalculateRampResponse) => {
        console.log('calculateRampRes: ', data);
        setBtcToReceive(data.amount);
      });
      setLoading(false);
    } catch (error: any) {
      console.log('Error calculating BTC amount: ', error.message);
      setBuyErrorMessage(error.message);
    }
  };

  useEffect(() => {
    // only run this if fiat input exceeds a reasonable amount
    if (fiatForBuy >= 200) {
      calculateBitcoinAmountOn();
    }
  }, [fiatForBuy]);

  const handleLnInvoice = (event: any) => {
    const inputInvoice = event.target.value;
    setLnInvoice(inputInvoice);
  };

  const handleLnInvoiceBlur = () => {
    // Validate the lightning invoice onBlur
    setIsLnInvoiceValid(lnInvoice.includes('taprt'));
  };

  const verifyInvoice = () => {
    //@todo: endpoint to validate tap address/ invoice
    setInvoiceVerified(true);
  };

  const agentPayRampInvoice = async () => {
    setLoading(true);
    const payload: PayRampInvoiceBody = {
      destinationAddress: lnInvoice,
      amount: btcToReceive,
      currency: 'BTC',
      lightningAddress: localLnAddress!,
    };

    try {
      const response = await fetch(`${apiUrl}/on/invoices/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // @todo: show as an alert or notification
        throw new Error('Failed to pay invoice');
      }

      await response.json().then((data: PayRampInvoiceResponse) => {
        console.log('payRampInvoiceRes: ', data);
        setPaymentRes(data);
      });
      setLoading(false);
    } catch (error: any) {
      setBuyErrorMessage(error.message);
      console.log('Error paying ramp invoice: ', error.message);
    }
  };

  const DynamicInvoiceButton = () => {
    const btnText = invoiceVerified ? `Send ${btcToReceive} BTC` : 'Verify invoice';
    const btnAction = invoiceVerified ? agentPayRampInvoice : verifyInvoice;
    const btnVariation = invoiceVerified ? 'contained' : 'outlined';
    return (
      <Button variant={btnVariation} onClick={btnAction} size="large">
        {btnText}
      </Button>
    );
  };

  const handleCopyProof = () => {
    navigator.clipboard.writeText(paymentRes?.paymentId || '');
    notifyActions.push({
      message: 'Proof of payment copied to clipboard',
      dismissed: true,
      options: {
        variant: 'info',
      },
    });
  };

  const handleShareProof = (event: any) => {
    event.preventDefault();
    if (navigator.share) {
      navigator
        .share({
          title: 'BTC Transaction ID',
          text: paymentRes?.paymentId,
        })
        .then(() => {
          console.log('Shared!');
        })
        .catch(console.error);
    }
  };

  return (
    <>
      <Meta title="Buy bitcoin" />
      <FullSizeAtopFlexBox>
        <Box width={480} sx={{ mt: 4, px: 2, pb: 5 }}>
          <Stack spacing={2}>
            {buyErrorMsg && (
              <Alert sx={{ mb: 2 }} severity="error">
                {buyErrorMsg}
              </Alert>
            )}
            <TextField
              required
              tabIndex={0}
              id="fiat-amount"
              label="If you pay"
              type="number"
              onChange={handleFiatAmount}
              value={fiatForBuy}
              InputProps={{
                startAdornment: <InputAdornment position="start">{fiatCurrency}</InputAdornment>,
              }}
              disabled={loading || confirmSeenBTCAmount || confirmReceivedBuyerInvoice}
              error={fiatForBuy < 200}
              helperText={
                fiatForBuy < 200 ? `Please enter amount equal or more than 200 ${fiatCurrency}` : ''
              }
            />
            <TextField
              tabIndex={1}
              required
              id="bitcoin-amount"
              label="You will receive"
              value={btcToReceive}
              InputProps={{
                endAdornment: <InputAdornment position="start">{'BTC'}</InputAdornment>,
              }}
              disabled={true}
              helperText={
                btcToReceive !== 0
                  ? `Also equivalent to ${(btcToReceive * 100000000).toLocaleString()} sats`
                  : ''
              }
            />
            {btcToReceive !== 0 && !paymentRes && (
              <FormGroup>
                <FormControlLabel
                  required
                  control={<Switch />}
                  label="Buyer has agreed to BTC amount"
                  labelPlacement="end"
                  value={confirmSeenBTCAmount}
                  onChange={() => {
                    setConfirmSeenBTCAmount(!confirmSeenBTCAmount);
                  }}
                />
                <FormControlLabel
                  required
                  control={<Switch />}
                  label="Buyer has shared an invoice with me"
                  labelPlacement="end"
                  value={confirmReceivedBuyerInvoice}
                  onChange={() => {
                    setConfirmReceivedBuyerInvoice(!confirmReceivedBuyerInvoice);
                  }}
                />
              </FormGroup>
            )}
            {confirmSeenBTCAmount && confirmReceivedBuyerInvoice && !paymentRes && (
              <>
                <TextField
                  tabIndex={3}
                  required
                  id="buyer-invoice"
                  label="Invoice from buyer"
                  onChange={handleLnInvoice}
                  onBlur={handleLnInvoiceBlur}
                  value={lnInvoice}
                  multiline={true}
                  minRows={8}
                  disabled={loading || invoiceVerified}
                  error={!isLnInvoiceValid}
                  helperText={
                    !isLnInvoiceValid
                      ? 'Invalid invoice'
                      : `Request buyer for an invoice matching ${btcToReceive} BTC / ${(
                          btcToReceive * 100000000
                        ).toLocaleString()} sats`
                  }
                />
                {invoiceVerified && <Alert severity="success">Invoice verified!</Alert>}
                {lnInvoice && <DynamicInvoiceButton />}
              </>
            )}
            {loading && <LinearProgress />}
            {paymentRes && (
              <Box
                sx={{
                  width: 480,
                  maxWidth: '100%',
                }}
              >
                <Stack spacing={3}>
                  <Lottie
                    animationData={successfulTransaction}
                    loop={false}
                    style={{ height: 250 }}
                  />
                  <Card>
                    <CardContent>
                      <Typography align="center" variant="body1" sx={{ pb: 1 }} color="green">
                        {`${btcToReceive} BTC is on its way.`}
                      </Typography>
                      <TextField
                        value={paymentRes.paymentId}
                        fullWidth
                        multiline
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography color="green">Transaction ID:</Typography>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Typography sx={{ pt: 1 }} variant="subtitle2">
                        Status: {paymentRes?.status}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
                      <Button
                        onClick={handleCopyProof}
                        variant="text"
                        size="small"
                        sx={{ textAlign: 'center' }}
                        startIcon={<CopyAll />}
                      >
                        Copy Transaction ID
                      </Button>
                      <Button
                        onClick={handleShareProof}
                        variant="text"
                        size="small"
                        sx={{ textAlign: 'center' }}
                        startIcon={<Share />}
                      >
                        Share
                      </Button>
                    </CardActions>
                  </Card>
                  <Button
                    onClick={() => {
                      setPaymentRes(null);
                      setLnInvoice('');
                      setInvoiceVerified(false);
                      setBtcToReceive(0);
                      setFiatForBuy(0);
                      // ? navigate to wallet screen?
                    }}
                    color="primary"
                    size="large"
                    variant="contained"
                  >
                    Done
                  </Button>
                </Stack>
              </Box>
            )}
          </Stack>
        </Box>
      </FullSizeAtopFlexBox>
    </>
  );
}

export default BuyBitcoin;
