import { useState } from 'react';

import { CopyAll, Share } from '@mui/icons-material';
import {
  Box,
  Button,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import Meta from '@/components/Meta';
import SpliceQrCode from '@/components/QRCode';
import { FullSizeAtopFlexBox } from '@/components/styled';
import { apiUrl } from '@/config';
import useNotifications from '@/store/notifications';
import { GenerateRampInvoiceBody, GenerateRampInvoiceResponse } from '@/lib/interfaces';

function CreateInvoice() {
  const [loading, setLoading] = useState(false);
  const [invoiceAmount, setInvoiceAmount] = useState(0);
  const [generatedInvoice, setGeneratedInvoice] = useState('');
  const [, notifyActions] = useNotifications();

  const handleAmount = (event: any) => {
    const inputAmount = event.target.value;
    setInvoiceAmount(inputAmount);
  };

  const generateRampInvoice = async () => {
    setLoading(true);
    const payload: GenerateRampInvoiceBody = {
      amount: invoiceAmount,
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
          title: `Invoice for ${invoiceAmount} BTC`,
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
      <Meta title="Create an invoice" />
      <FullSizeAtopFlexBox>
        <Box width={480} sx={{ mt: 3, px: 2, pb: 5 }}>
          <Stack spacing={3}>
            <TextField
              tabIndex={1}
              required
              id="invoice-amount"
              label="Amount you wish to receive"
              type="number"
              onChange={handleAmount}
              value={invoiceAmount}
              InputProps={{
                startAdornment: <InputAdornment position="start">BTC</InputAdornment>,
              }}
              disabled={loading || !!generatedInvoice}
              helperText={
                invoiceAmount !== 0
                  ? `Also equivalent to ${(invoiceAmount * 100000000).toLocaleString()} sats`
                  : ''
              }
            />
            {loading && <LinearProgress />}
            <Button
              tabIndex={2}
              variant="contained"
              onClick={generateRampInvoice}
              size="large"
              disabled={loading || !!generatedInvoice}
            >
              {`Create Invoice for ${invoiceAmount} BTC`}
            </Button>
          </Stack>
          {generatedInvoice && (
            <Stack spacing={2} sx={{ mt: 3 }}>
              <Typography align="center" variant="subtitle2">
                Show this QR Code to an agent near you
              </Typography>
              <SpliceQrCode
                invoice={generatedInvoice}
                amount={invoiceAmount}
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
                variant="outlined"
                onClick={() => {
                  setGeneratedInvoice('');
                  setInvoiceAmount(0);
                }}
                color="error"
              >
                Cancel Invoice
              </Button>
            </Stack>
          )}
        </Box>
      </FullSizeAtopFlexBox>
    </>
  );
}

export default CreateInvoice;
