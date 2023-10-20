import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AlternateEmail, ArrowForward, QrCodeRounded, SendRounded } from '@mui/icons-material';
import { IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import Meta from '@/components/Meta';
import { FullSizeAtopFlexBox } from '@/components/styled';
import { storedWalletId } from '@/config';
import useNotifications from '@/store/notifications';

function Send() {
  const navigate = useNavigate();
  const [, notifyActions] = useNotifications();

  const storedWallet = localStorage.getItem(storedWalletId);

  useEffect(() => {
    if (!storedWallet) {
      navigate('/');
      notifyActions.push({
        message: 'No wallet found',
        dismissed: true,
        options: {
          variant: 'error',
        },
      });
    }
  }, []);

  return (
    <>
      <Meta title="Send money" />
      <FullSizeAtopFlexBox>
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
            onClick={() => {
              notifyActions.push({
                message: 'Coming soon',
                dismissed: true,
                options: {
                  variant: 'info',
                },
              });
            }}
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
            onClick={() => {
              notifyActions.push({
                message: 'Coming soon',
                dismissed: true,
                options: {
                  variant: 'info',
                },
              });
            }}
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
      </FullSizeAtopFlexBox>
    </>
  );
}

export default Send;
