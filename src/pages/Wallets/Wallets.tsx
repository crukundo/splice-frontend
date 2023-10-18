import { Box, Paper, Stack, Typography } from '@mui/material';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';

function Wallets() {
  return (
    <>
      <Meta title="Your wallets" />
      <FullSizeCenteredFlexBox>
        <Box width={480}>
          <Paper sx={{ p: 5 }} elevation={3}>
            <Stack spacing={2}>
              <Typography variant="h5" component="h1" align="center">
                Wallets
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default Wallets;
