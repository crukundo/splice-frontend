import React, { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import DefaultIcon from '@mui/icons-material/Deblur';
import ThemeIcon from '@mui/icons-material/InvertColors';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar, ButtonBase, Menu, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';

import { FlexBox } from '@/components/styled';
import { storedWalletId, title } from '@/config';
import useOrientation from '@/hooks/useOrientation';
import routes from '@/routes';
import useNotifications from '@/store/notifications';
import useSidebar from '@/store/sidebar';
import useTheme from '@/store/theme';
import sleep from '@/utils/sleep';

function Header() {
  const [, sidebarActions] = useSidebar();
  const [, themeActions] = useTheme();
  const isPortrait = useOrientation();
  const [, notifyActions] = useNotifications();
  const navigate = useNavigate();

  const storedWallet = localStorage.getItem(storedWalletId);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClickAvatar = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyId = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    navigator.clipboard.writeText(storedWallet!);
    notifyActions.push({
      message: 'Copied wallet id to clipboard',
      dismissed: true,
      options: {
        variant: 'info',
      },
    });
  };

  const handleLogout = async () => {
    await sleep(1000);
    localStorage.clear();
    notifyActions.push({
      message: 'Logged out successfully.',
      dismissed: true,
      options: {
        variant: 'info',
      },
    });
    await sleep(1000);
    navigate('/');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="transparent" elevation={3} position="static">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <FlexBox sx={{ alignItems: 'center' }}>
            <IconButton
              onClick={sidebarActions.toggle}
              size="large"
              edge="start"
              color="info"
              aria-label="menu"
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Button component={Link} to={'/'} color="info">
              {title}
            </Button>
          </FlexBox>
          {!isPortrait && (
            <FlexBox title="Middle">
              <Divider orientation="vertical" flexItem />
              {Object.values(routes)
                .filter((route) => route.title)
                .map(({ path, title, icon: Icon }) => (
                  <Fragment key={path}>
                    <Button
                      key={path}
                      component={Link}
                      to={path as string}
                      color="info"
                      startIcon={Icon ? <Icon /> : <DefaultIcon />}
                    >
                      {title}
                    </Button>
                    <Divider orientation="vertical" flexItem />
                  </Fragment>
                ))}
            </FlexBox>
          )}
          <FlexBox>
            <Divider orientation="vertical" />
            <Tooltip title="Switch theme" arrow>
              <IconButton color="info" edge="start" size="large" onClick={themeActions.toggle}>
                <ThemeIcon />
              </IconButton>
            </Tooltip>
            {storedWallet && (
              <>
                <Divider orientation="vertical" flexItem />
                <ButtonBase onClick={handleClickAvatar}>
                  <Avatar
                    src={`https://robohash.org/${storedWallet}`}
                    sx={{ width: 30, height: 30, alignSelf: 'center' }}
                  />
                </ButtonBase>
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'profile avatar button',
                  }}
                  sx={{ fontSize: 16 }}
                >
                  <MenuItem onClick={handleCopyId}>Copy wallet id</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </FlexBox>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
