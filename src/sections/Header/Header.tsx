import { Link } from 'react-router-dom';

import DefaultIcon from '@mui/icons-material/Deblur';
import GitHubIcon from '@mui/icons-material/GitHub';
import ThemeIcon from '@mui/icons-material/InvertColors';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';

import { FlexBox } from '@/components/styled';
import { repository, title } from '@/config';
import useOrientation from '@/hooks/useOrientation';
import routes from '@/routes';
import useSidebar from '@/store/sidebar';
import useTheme from '@/store/theme';

function Header() {
  const [, sidebarActions] = useSidebar();
  const [, themeActions] = useTheme();
  const isPortrait = useOrientation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="transparent" elevation={1} position="static">
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
                  <>
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
                  </>
                ))}
            </FlexBox>
          )}
          <FlexBox>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="It's open source" arrow>
              <IconButton color="info" size="large" component="a" href={repository} target="_blank">
                <GitHubIcon />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Switch theme" arrow>
              <IconButton color="info" edge="end" size="large" onClick={themeActions.toggle}>
                <ThemeIcon />
              </IconButton>
            </Tooltip>
          </FlexBox>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
