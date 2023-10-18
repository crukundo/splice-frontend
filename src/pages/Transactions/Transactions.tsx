import { Box, Paper, Stack, Typography } from '@mui/material';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';

function Transactions() {
  return (
    <>
      <Meta title="Create a new wallet" />
      <FullSizeCenteredFlexBox>
        <Box width={480}>
          <Paper sx={{ p: 5 }} elevation={3}>
            <Stack spacing={2}>
              <Typography variant="h5" component="h1" align="center">
                Transactions
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default Transactions;
