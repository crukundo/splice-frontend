import React from 'react';
import QRCode from 'react-qr-code';

import FileCopyIcon from '@mui/icons-material/FileCopy';
import PaymentIcon from '@mui/icons-material/Payment';
import { Button, ButtonBase, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { Box } from '@mui/system';

import { FullSizeCenteredFlexBox } from '@/components/styled';
import useNotifications from '@/store/notifications';

interface Props {
  size?: number; // px (square)
  invoice: string;
  amount: number;
  currency: string;
}

function SpliceQrCode({ invoice, amount, currency, size }: Props) {
  const [, notifyActions] = useNotifications();

  const handleCopy = () => {
    // Copy the QR string to the clipboard
    navigator.clipboard.writeText(invoice);
    notifyActions.push({
      message: 'Invoice copied to clipboard',
      dismissed: true,
      options: {
        variant: 'info',
      },
    });
  };

  return (
    <FullSizeCenteredFlexBox>
      <Box textAlign="center">
        <Stack>
          <Typography variant="h4" gutterBottom>
            {currency} {amount}
          </Typography>
          <ButtonBase onClick={handleCopy}>
            <QRCode value={invoice} size={size} />
          </ButtonBase>
        </Stack>
      </Box>
    </FullSizeCenteredFlexBox>
  );
}

export default SpliceQrCode;
