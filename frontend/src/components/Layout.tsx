import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '../contexts/ThemeContext';
import {
  StyledAppBar,
  StyledToolbar,
  NavContainer,
  NavButton,
  ThemeToggleButton,
  MainContent,
} from './Layout.styles';
import { useAuth } from '../contexts/AuthProviderContext';
import AnchorIcon from '@mui/icons-material/Anchor';
import Box from '@mui/material/Box';
import { ProtectedWrapper } from './ProtectedWrapper';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();
  const { token, handleLogout } = useAuth();

  return (
    <>
      <StyledAppBar position="static">
        <StyledToolbar>
          <Box sx={{display:'flex', alignItems:'center', gap:1, cursor:'pointer'}} onClick={() => navigate('/')}>
            <Typography variant="h6" component="div">
            Fish Farm Management
            </Typography>
          <AnchorIcon fontSize="large" />
          </Box>
          <NavContainer>

              <ProtectedWrapper allowedRoles={['GlobalAdmin']}>
                <NavButton onClick={() => navigate('/orgs')}>Organizations</NavButton>
                <NavButton onClick={() => navigate('/users')}>Users</NavButton>
              </ProtectedWrapper>

              <ProtectedWrapper allowedRoles={['OrgAdmin', 'OrgUser']}>
                <NavButton onClick={() => navigate('/farms')}>Farms</NavButton>
                <NavButton onClick={() => navigate('/workers')}>Workers</NavButton>
              </ProtectedWrapper>

              {token == null ? (
                <NavButton onClick={() => navigate('/login')}>Login</NavButton>
              ) : (
                <NavButton onClick={() => {
                  handleLogout()
                  navigate('/login')}}>
                  Logout
                  </NavButton>
              )}

            <ThemeToggleButton aria-label="toggle theme" onClick={toggleTheme}>
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </ThemeToggleButton>
          </NavContainer>
        </StyledToolbar>
      </StyledAppBar>
      <MainContent>{children}</MainContent>
    </>

  );
};
