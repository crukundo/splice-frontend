import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Collapse, LinearProgress, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeAtopFlexBox } from '@/components/styled';
import { apiUrl, storedLnAddress, storedWalletId, storedWithdrawFee } from '@/config';
import { WalletRequestResponse } from '@/utils/interfaces';

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
      <FullSizeAtopFlexBox>
        <Box>
          <Paper sx={{ p: 5 }}>
            <Stack spacing={2}>
              <Typography variant="h6" component="h1" align="center">
                Start sending money with Splice
              </Typography>
              <Typography component="h6" align="center">
                An easy-to-use wallet for sending money across Africa
              </Typography>
              {storedWallet && (
                <Button variant="contained" onClick={onPressContinue}>
                  Continue to wallet
                </Button>
              )}
            </Stack>
            {!storedWallet && (
              <Stack spacing={2} sx={{ mt: 5 }}>
                <Button variant="contained" onClick={onPressNew}>
                  Create a new wallet
                </Button>
                <Divider>OR</Divider>
                <Button variant="outlined" onClick={handleExpandClick} size="large">
                  Use existing wallet
                </Button>

                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <Stack>
                    <Typography component="h6" align="center" sx={{ mb: 2 }}>
                      Enter your wallet id below:
                    </Typography>
                    <TextField
                      required
                      id="walletId"
                      label="Wallet ID"
                      onChange={handleWalletId}
                      onBlur={handleWalletIdBlur}
                      error={!isWalletIdValid}
                      helperText={
                        !isWalletIdValid
                          ? 'Invalid wallet id'
                          : 'Enter a valid wallet id e.g 766269c6-94f0-4d8b-82ee-7b53b416bc0f'
                      }
                      value={walletId}
                      multiline={true}
                      minRows={2}
                      disabled={loading}
                    />
                    {loading && <LinearProgress sx={{ mt: 1 }} />}
                    <Button
                      sx={{ mt: 2 }}
                      variant="contained"
                      onClick={handleExistingWallet}
                      size="large"
                      disabled={loading || !isWalletIdValid}
                    >
                      Continue
                    </Button>
                  </Stack>
                </Collapse>
              </Stack>
            )}
          </Paper>
        </Box>
      </FullSizeAtopFlexBox>
    </>
  );
}

export default Welcome;
