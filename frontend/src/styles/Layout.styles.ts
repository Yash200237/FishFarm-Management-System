import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

export const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const NavContainer = styled(Box)({
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
});

export const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

export const ThemeToggleButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
}));

export const MainContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  minHeight: 'calc(100vh - 100px)',
}));
