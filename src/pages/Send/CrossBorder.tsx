import * as React from 'react';

import { BoltSharp } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
} from '@mui/material';

import Meta from '@/components/Meta';
import SpliceQrCode from '@/components/QRCode';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import useNotifications from '@/store/notifications';
import sleep from '@/utils/sleep';

function CrossBorder() {
  const [sendAmount, setSendAmount] = React.useState(0);
  const [remoteLnAddress, setRemoteLnAddress] = React.useState('');
  const [isAddressValid, setIsAddressValid] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState(null);
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

  const handleRequestInvoice = async () => {
    setIsConfirmationOpen(false);
    setLoading(true);
    await sleep(5000);
    setLoading(false);
  };

  const handleConfirmationPress = () => {
    setIsConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setIsConfirmationOpen(false);
  };

  const handleCopyInvoice = () => {
    // Copy the QR string to the clipboard
    navigator.clipboard.writeText('invoice from api response');
    notifyActions.push({
      message: 'Invoice copied to clipboard',
      dismissed: true,
      options: {
        variant: 'info',
      },
    });
  };

  const handlePayInvoice = async () => {
    setLoading(true);
    await sleep(5000);
    setLoading(false);
  };

  return (
    <>
      <Meta title="Cross Border Payment" />
      <FullSizeCenteredFlexBox>
        <Box>
          <Stack spacing={2} sx={{ mt: 5 }}>
            <Divider />
            <TextField
              required
              id="send-amount"
              label="Amount to send"
              type="number"
              onChange={handleAmount}
              value={sendAmount}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">{`{{ currency }}`}</InputAdornment>
                ),
              }}
              disabled={loading}
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
              disabled={loading}
            />
            {loading ? <LinearProgress /> : null}
            <Button
              variant="contained"
              onClick={handleConfirmationPress}
              size="large"
              disabled={loading || !sendAmount || !remoteLnAddress}
            >
              Request invoice
            </Button>
            <SpliceQrCode
              // all this meta data comes from api reponse from request invoice.
              invoice="lntb1m1pjny53cpp5rm6kpu53g2uck4hzv4k34z5aly0afyqyu2t099px6u9xflkxlmzqdqqcqzzsxqyz5vqsp5lt59vtna3v3yewasnfuxs2cq7zxykwr8etv6g335zfq62lzfzyxs9qyyssqny76gfv4cp28fyeytu4zrdd4xfj2kpp5zvyhxstyqhfyr9667vgsyhxc2ta75nmvw5e4myl0kwq5pkau9m4390xccj5r4l88ngvsjqgpqz9cw8"
              amount={sendAmount}
              currency="NGN"
              size={250}
            />
            <Button variant="contained" onClick={handlePayInvoice} size="large">
              Pay with wallet
            </Button>
            <Button variant="text" onClick={handleCopyInvoice}>
              Copy invoice
            </Button>
          </Stack>
          {/* Confirmation Dialog */}
          <Dialog open={isConfirmationOpen} onClose={handleConfirmationClose} maxWidth={'sm'}>
            <DialogTitle>Review your request:</DialogTitle>
            <DialogContent>
              <div>
                {`You would like to send ${sendAmount} {{local currency }} to ${remoteLnAddress}. Is this correct?`}
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
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default CrossBorder;
