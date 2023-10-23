import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Autocomplete,
  Box,
  Button,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
} from '@mui/material';

import { MuiTelInput, MuiTelInputCountry, matchIsValidTel } from 'mui-tel-input';

import Meta from '@/components/Meta';
import { FullSizeAtopFlexBox } from '@/components/styled';
import {
  apiUrl,
  storedFiatCurrency,
  storedLnAddress,
  storedWalletId,
  storedWithdrawFee,
} from '@/config';
import { CountryType, allowedCountries } from '@/utils/countries';
import { CreateWalletRequestBody } from '@/utils/interfaces';

function CreateNewWallet() {
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [withdrawFee, setWithdrawFee] = React.useState(0);
  const [selectedCountry, setSelectedCountry] = React.useState<CountryType | null>(null);
  const [isValidMobile, setIsValidMobile] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const formatPhoneNumber = (
    phoneNumber: string | undefined,
    countryCode: string | undefined,
  ): string => {
    // Remove white spaces
    phoneNumber = phoneNumber?.replace(/\s/g, '');

    // Remove the country code and add '0' before '7'
    if (phoneNumber?.startsWith(`+${countryCode}`)) {
      phoneNumber = phoneNumber.replace(`+${countryCode}`, '0');
    }

    return phoneNumber as string;
  };

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

  const onPressContinue = async () => {
    setLoading(true);
    const formattedNumber = formatPhoneNumber(mobileNumber, selectedCountry?.phone);
    const payload: CreateWalletRequestBody = {
      phoneNumber: formattedNumber,
      withdrawalFee: withdrawFee,
      preferredFiatCurrency: selectedCountry?.currency || '', // @todo handle undefined better
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

      await response.json().then((data) => {
        console.log('createWalletRes: ', data);
        localStorage.setItem(storedWalletId, data.id);
        localStorage.setItem(storedLnAddress, data.lightning_address);
        localStorage.setItem(storedWithdrawFee, data.withdrawal_fee.toString());
        localStorage.setItem(storedFiatCurrency, data.balances[0].currency);
      });
      setLoading(false);
      navigate('/wallet');
    } catch (error: any) {
      console.log('Error creating wallet: ', error.message);
    }
  };

  return (
    <>
      <Meta title="Create a new wallet" />
      <FullSizeAtopFlexBox>
        <Box width={480}>
          <Stack spacing={2} sx={{ p: 2 }}>
            {/* <Typography component="h1" variant="h5" align="center">
              Lets setup your account
            </Typography> */}
            <Autocomplete
              disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
              />
            )}
            {loading ? <LinearProgress /> : null}
            <Button
              variant="contained"
              onClick={onPressContinue}
              size="large"
              disabled={loading || !mobileNumber || !selectedCountry || !withdrawFee}
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
