import { Box, Card, CardContent, Paper, Stack, Typography } from '@mui/material';

import Meta from '@/components/Meta';
import { FullSizeAtopFlexBox, FullSizeCenteredFlexBox } from '@/components/styled';

interface BalanceProps {
  title: string;
  balance: number;
}

const WalletBalanceCard = ({ title, balance }: BalanceProps) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body1">{balance}</Typography>
      </CardContent>
    </Card>
  );
};

function Wallet() {
  return (
    <>
      <Meta title="Your wallets" />
      <FullSizeAtopFlexBox>
        <Box width={480}>
          <Stack spacing={2} sx={{ mt: 5 }}>
            <Typography variant="h5" component="h1" align="center">
              <WalletBalanceCard title="BTC" balance={1000} />
              <WalletBalanceCard title="BTC" balance={1000} />
            </Typography>
          </Stack>
        </Box>
      </FullSizeAtopFlexBox>
    </>
  );
}

export default Wallet;
