import Box from '@mui/material/Box';
import { styled } from '@mui/system';

const FlexBox = styled(Box)({
  display: 'flex',
});

const CenteredFlexBox = styled(FlexBox)({
  justifyContent: 'center',
  alignItems: 'center',
});

const ATopFlexBox = styled(FlexBox)({
  justifyContent: 'center',
  alignItems: 'start',
});

const FullSizeCenteredFlexBox = styled(CenteredFlexBox)({
  width: '100%',
  height: '100%',
});

const FullSizeAtopFlexBox = styled(ATopFlexBox)({
  width: '100%',
  height: '100%',
});

export { FlexBox, CenteredFlexBox, FullSizeCenteredFlexBox, FullSizeAtopFlexBox };
