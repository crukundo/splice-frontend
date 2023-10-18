import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';
import useOrientation from '@/hooks/useOrientation';

function Welcome() {
  const navigate = useNavigate();
  const isPortrait = useOrientation();

  const onPressNew = () => {
    navigate('/create');
  };

  return (
    <>
      <Meta title="Welcome" />
      <FullSizeCenteredFlexBox flexDirection={isPortrait ? 'column' : 'row'}>
        <Box>
          <Paper sx={{ p: 5 }}>
            <Typography variant="h6" component="h1" align="center">
              Start sending money with Splice
            </Typography>
            <Typography component="h6" align="center">
              An easy-to-use wallet for sending money across Africa
            </Typography>
            <Stack spacing={2} sx={{ mt: 5 }}>
              <Button variant="contained" onClick={onPressNew}>
                Create a new wallet
              </Button>
              <Divider>OR</Divider>
              <Button variant="outlined" onClick={() => 0} size="large" disabled>
                Use existing wallet
              </Button>
            </Stack>
          </Paper>
        </Box>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default Welcome;
