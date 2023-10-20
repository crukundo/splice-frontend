import * as React from 'react';

import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  Divider,
  InputAdornment,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { MuiTelInput, MuiTelInputCountry, matchIsValidTel } from 'mui-tel-input';

import Meta from '@/components/Meta';
import { FullSizeAtopFlexBox, FullSizeCenteredFlexBox } from '@/components/styled';
import { apiUrl } from '@/config';
import { CountryType, allowedCountries } from '@/utils/countries';

function CreateNewWallet() {
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [withdrawFee, setWithdrawFee] = React.useState(0);
  const [selectedCountry, setSelectedCountry] = React.useState<CountryType | null>(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [isValidMobile, setIsValidMobile] = React.useState(false);

  <Snackbar open={openAlert} autoHideDuration={6000} onClose={() => setOpenAlert(false)}>
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      {errorMsg}
    </Alert>
  </Snackbar>;

  const handleMobileNumber = (newNumber: string) => {
    setMobileNumber(newNumber);
  };

  const handleMobileNumberBlur = () => {
    // Validate the lightning address onBlur
    setIsValidMobile(matchIsValidTel(mobileNumber));
  };

  const handleWithdrawFee = (event: any) => {
    const inputFee = event.target.value;
    setWithdrawFee(inputFee);
  };

  interface CreateWalletRequestBody {
    phoneNumber: string;
    withdrawalFee: number;
    preferredFiatCurrency: string;
  }

  interface CreateWalletResponse {
    id: string;
    lightning_address: string;
    withdrawal_fee: number;
    balances: [];
    success: boolean;
  }

  const onPressContinue = async (): Promise<CreateWalletResponse> => {
    const payload: CreateWalletRequestBody = {
      phoneNumber: mobileNumber,
      withdrawalFee: withdrawFee,
      preferredFiatCurrency: selectedCountry?.currency || 'NGN',
    };
    try {
      const response = await fetch(`${apiUrl}/wallets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // show as an alert or notification
        throw new Error('Failed to create wallet');
      }

      // Assuming the response is JSON; modify accordingly if it's different
      const responseData = await response.json();

      // Customize the response structure based on your API's response
      return responseData;
    } catch (error: any) {
      setErrorMsg(error.message);
      setOpenAlert(true);
      throw new Error('Failed to create wallet');
    }
  };

  return (
    <>
      <Meta title="Create a new wallet" />
      <FullSizeAtopFlexBox>
        <Box width={480}>
          <Stack spacing={2} sx={{ p: 2 }}>
            <Typography component="h1" variant="h5" align="center">
              Lets setup your account
            </Typography>
            <Divider />
            <Autocomplete
              sx={{ pb: 2 }}
              id="country-selector"
              options={allowedCountries}
              autoHighlight
              getOptionLabel={(option) => option.label}
              onChange={(event, newValue) => {
                setSelectedCountry(newValue);
              }}
              value={selectedCountry}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                  <img
                    loading="lazy"
                    width="20"
                    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                    alt=""
                  />
                  {option.label} ({option.code}) +{option.phone}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose your country"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password', // disable autocomplete and autofill
                  }}
                />
              )}
            />
            {selectedCountry && (
              <MuiTelInput
                sx={{ fontSize: 20, pb: 2 }}
                value={mobileNumber}
                defaultCountry={selectedCountry?.code as MuiTelInputCountry}
                continents={['AF']}
                preferredCountries={['KE', 'NG']}
                onChange={handleMobileNumber}
                onBlur={handleMobileNumberBlur}
                required={true}
                label="Mobile number"
                error={!isValidMobile}
                helperText={
                  !isValidMobile
                    ? 'Invalid mobile number'
                    : 'We will use this to create a lightning address'
                }
              />
            )}
            {mobileNumber && (
              <TextField
                required
                id="withdraw-fees"
                label="Withdraw fee"
                type="number"
                onChange={handleWithdrawFee}
                value={withdrawFee}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">{`${selectedCountry?.currency}`}</InputAdornment>
                  ),
                }}
                helperText={`Fixed service fee you will charge users to withdraw BTC in ${selectedCountry?.currency}?`}
              />
            )}
            <Button
              variant="contained"
              onClick={onPressContinue}
              size="large"
              disabled={!mobileNumber || !selectedCountry || !withdrawFee}
            >
              Continue
            </Button>
          </Stack>
        </Box>
      </FullSizeAtopFlexBox>
    </>
  );
}

export default CreateNewWallet;
