import * as React from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';

function CreateNewWallet() {
  const [mobileNumber, setMobileNumber] = React.useState('');

  const handleMobileNumber = (newNumber: any) => {
    if (matchIsValidTel(newNumber)) {
      console.log('is valid number: ', matchIsValidTel(newNumber));
      setMobileNumber(newNumber);
    }
    setMobileNumber(newNumber);
  };

  return (
    <>
      <Meta title="Create new wallet" />
      <FullSizeCenteredFlexBox>
        <Stack spacing={2}>
          <Typography variant="h5" component="h1" align="center">
            Lets get you setup
          </Typography>
          <MuiTelInput
            value={mobileNumber}
            defaultCountry="KE"
            continents={['AF']}
            onChange={handleMobileNumber}
          />
        </Stack>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default CreateNewWallet;
