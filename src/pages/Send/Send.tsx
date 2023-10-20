import { useNavigate } from 'react-router-dom';

import {
  AlternateEmail,
  ArrowForward,
  EmailRounded,
  Image,
  QrCodeRounded,
  SendRounded,
} from '@mui/icons-material';
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';

function Send() {
  const navigate = useNavigate();
  return (
    <>
      <Meta title="Send money" />
      <FullSizeCenteredFlexBox>
        <List sx={{ width: '100%', maxWidth: 600 }} component="nav">
          <ListItem
            sx={{ bgcolor: 'background.paper' }}
            divider={true}
            secondaryAction={
              <IconButton aria-label="send">
                <ArrowForward />
              </IconButton>
            }
            onClick={() => navigate('/send/cross')}
          >
            <ListItemIcon>
              <SendRounded />
            </ListItemIcon>
            <ListItemText
              primary="Send money across borders"
              secondary="Transfer money quickly across 54 african countries."
            />
          </ListItem>
          <ListItem
            sx={{ bgcolor: 'background.paper' }}
            divider={true}
            secondaryAction={
              <IconButton aria-label="send">
                <ArrowForward />
              </IconButton>
            }
            onClick={() => navigate('/send-lnurl')}
          >
            <ListItemIcon>
              <AlternateEmail />
            </ListItemIcon>
            <ListItemText
              primary="Send to lightning address"
              secondary="e.g africa@splice.africa"
            />
          </ListItem>
          <ListItem
            sx={{ bgcolor: 'background.paper' }}
            divider={true}
            secondaryAction={
              <IconButton aria-label="send">
                <ArrowForward />
              </IconButton>
            }
            onClick={() => navigate('/send-invoice')}
          >
            <ListItemIcon>
              <QrCodeRounded />
            </ListItemIcon>
            <ListItemText
              primary="Send to lightning invoice"
              secondary="Scan or paste lightning invoice"
            />
          </ListItem>
        </List>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default Send;
