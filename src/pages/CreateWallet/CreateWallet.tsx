import * as React from 'react';

import {
  Autocomplete,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { MuiTelInput, MuiTelInputCountry, matchIsValidTel } from 'mui-tel-input';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import { CountryType, countries } from '@/utils/countries';

function CreateNewWallet() {
  const [mobileNumber, setMobileNumber] = React.useState('');
  const [withdrawFee, setWithdrawFee] = React.useState(0);
  const [selectedCountry, setSelectedCountry] = React.useState<CountryType | null>(null);

  const handleMobileNumber = (newNumber: string) => {
    // if (matchIsValidTel(newNumber)) {
    //   console.log('is valid number: ', matchIsValidTel(newNumber));
    //   setMobileNumber(newNumber);
    // }
    setMobileNumber(newNumber);
  };

  const handleWithdrawFee = (newFee: any) => {
    setWithdrawFee(newFee);
  };

  return (
    <>
      <Meta title="Create a new wallet" />
      <FullSizeCenteredFlexBox>
        <Box width={480}>
          <Paper sx={{ p: 5 }} elevation={3}>
            <Stack spacing={2}>
              <Typography variant="h5" component="h1" align="center">
                Lets get you setup
              </Typography>
              <Typography component="h6" align="center">
                We need some information to setup your account
              </Typography>
              <Divider />
              <Autocomplete
                sx={{ pb: 2 }}
                id="country-selector"
                options={countries}
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
                  onChange={handleMobileNumber}
                  required={true}
                  label="Mobile number"
                  helperText="We'll use this to create a lightning address"
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
                  helperText={`Fixed fee you will charge users to withdraw BTC in ${selectedCountry?.currency}?`}
                />
              )}
              <Button
                variant="contained"
                onClick={() => 0}
                size="large"
                disabled={!mobileNumber || !selectedCountry || !withdrawFee}
              >
                Continue
              </Button>
            </Stack>
          </Paper>
        </Box>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default CreateNewWallet;
