import * as React from 'react';

import { BoltSharp, CopyAll, Share } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import Lottie from 'lottie-react';

import Meta from '@/components/Meta';
import SpliceQrCode from '@/components/QRCode';
import { FullSizeAtopFlexBox } from '@/components/styled';
import { apiUrl, storedFiatCurrency, storedLnAddress, storedWalletId } from '@/config';
import useNotifications from '@/store/notifications';
import {
  CreateInvoiceRequestBody,
  CreateInvoiceResponse,
  PayInvoiceRequestBody,
  PayInvoiceResponse,
} from '@/utils/interfaces';

import successfulTransaction from '../../lottie/success-transaction.json';

function CrossBorder() {
  const [sendAmount, setSendAmount] = React.useState(0);
  const [remoteLnAddress, setRemoteLnAddress] = React.useState('');
  const [isAddressValid, setIsAddressValid] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [invoiceResponse, setInvoiceResponse] = React.useState<CreateInvoiceResponse | null>(null);
  const [payResponse, setPayResponse] = React.useState<PayInvoiceResponse | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const [, notifyActions] = useNotifications();

  const validateLnAddress = (lnAddress: string) => {
    const addressRegex = /\S+@\S+\.\S+/;
    return addressRegex.test(lnAddress);
  };

  const handleLnAddress = (event: any) => {
    const inputAddress = event.target.value;
    setRemoteLnAddress(inputAddress);
  };

  const handleLnAddressBlur = () => {
    // Validate the lightning address onBlur
    setIsAddressValid(validateLnAddress(remoteLnAddress));
  };

  const handleAmount = (event: any) => {
    const inputAmount = event.target.value;
    setSendAmount(inputAmount);
  };

  const localWalletId = localStorage.getItem(storedWalletId);

  const handleRequestInvoice = async () => {
    setIsConfirmationOpen(false);
    setLoading(true);
    const payload: CreateInvoiceRequestBody = {
      walletId: localWalletId!,
      destionationAddress: remoteLnAddress,
      amount: sendAmount,
      currency: 'NGN',
    };

    try {
      const response = await fetch(`${apiUrl}/invoices`, {
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

      await response.json().then((data) => {
        console.log('createInvoiceRes: ', data);
        setInvoiceResponse(data);
      });
      setLoading(false);
    } catch (error: any) {
      console.log('Error creating wallet: ', error.message);
    }
  };

  const handleConfirmationPress = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
  };

  const fiatCurrency = localStorage.getItem(storedFiatCurrency);

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(invoiceResponse?.invoice || '');
    notifyActions.push({
      message: 'Invoice copied to clipboard',
      dismissed: true,
      options: {
        variant: 'info',
      },
    });
  };

  const handleCopyProof = () => {
    navigator.clipboard.writeText(payResponse?.proofOfPayment || '');
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
          title: 'Splice proof of payment',
          text: payResponse?.proofOfPayment,
        })
        .then(() => {
          console.log('Shared!');
        })
        .catch(console.error);
    }
  };

  const localLnAddress = localStorage.getItem(storedLnAddress);

  const handlePayInvoice = async () => {
    setLoading(true);
    const payload: PayInvoiceRequestBody = {
      sourceAddress: localLnAddress!,
      amount: invoiceResponse?.amount,
      currency: invoiceResponse?.currency,
      destinationAddress: remoteLnAddress,
      tapdAddress: invoiceResponse?.invoice,
    };

    try {
      const response = await fetch(`${apiUrl}/invoices/send`, {
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

      await response.json().then((data) => {
        console.log('payInvoiceRes: ', data);
        setPayResponse(data);
      });
      setLoading(false);
    } catch (error: any) {
      console.log('Error creating wallet: ', error.message);
    }
  };

  return (
    <>
      <Meta title="Cross Border Payment" />
      <FullSizeAtopFlexBox>
        <Box width={480} sx={{ mt: 3, px: 2, pb: 5 }}>
          <Stack spacing={2}>
            <TextField
              required
              id="send-amount"
              label="Amount to send"
              type="number"
              onChange={handleAmount}
              value={sendAmount}
              InputProps={{
                startAdornment: <InputAdornment position="start">{fiatCurrency}</InputAdornment>,
              }}
              disabled={loading || payResponse !== null}
            />
            <TextField
              required
              id="merchant-lnurl"
              label="Agent's lightning address"
              type="email"
              onChange={handleLnAddress}
              onBlur={handleLnAddressBlur}
              value={remoteLnAddress}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BoltSharp />
                  </InputAdornment>
                ),
              }}
              error={!isAddressValid}
              helperText={
                !isAddressValid
                  ? 'Invalid lightning address'
                  : 'Enter a valid lightning address e.g femi@splice.africa'
              }
              disabled={loading || payResponse !== null}
            />
            {loading ? <LinearProgress /> : null}
            <Button
              variant="contained"
              onClick={handleConfirmationPress}
              size="large"
              disabled={loading || !sendAmount || !remoteLnAddress || !!invoiceResponse}
            >
              Request invoice
            </Button>
            {invoiceResponse && payResponse === null && (
              <Stack spacing={2}>
                <SpliceQrCode
                  // all this meta data comes from api reponse from request invoice.
                  invoice={invoiceResponse.invoice}
                  amount={invoiceResponse.amount}
                  currency={invoiceResponse.currency}
                  size={250}
                />
                <Button variant="text" onClick={handleCopyInvoice}>
                  Copy invoice
                </Button>
                <Button variant="contained" onClick={handlePayInvoice} size="large">
                  Pay with wallet
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setPayResponse(null);
                    setInvoiceResponse(null);
                    setRemoteLnAddress('');
                    setSendAmount(0);
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            )}
            {payResponse && (
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
                        {`Paid to ${remoteLnAddress}`}
                      </Typography>
                      <TextField
                        value={payResponse.proofOfPayment}
                        fullWidth
                        multiline
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography color="green">Proof:</Typography>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
                      <Button
                        onClick={handleCopyProof}
                        variant="text"
                        size="small"
                        sx={{ textAlign: 'center' }}
                        startIcon={<CopyAll />}
                      >
                        Copy proof
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
                      setInvoiceResponse(null);
                      setPayResponse(null);
                      setRemoteLnAddress('');
                      setSendAmount(0);
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
          {/* Confirmation Dialog */}
          <Dialog open={isConfirmationOpen} onClose={handleConfirmationClose} maxWidth={'sm'}>
            <DialogTitle>Review your request:</DialogTitle>
            <DialogContent>
              <div>
                {`You would like to send ${sendAmount.toLocaleString()} ${fiatCurrency} to ${remoteLnAddress}. Is this correct?`}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConfirmationClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleRequestInvoice} color="primary">
                Confirm & Submit
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </FullSizeAtopFlexBox>
    </>
  );
}

export default CrossBorder;
