import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '../contexts/ThemeHook';
import {
  StyledAppBar,
  StyledToolbar,
  NavContainer,
  NavButton,
  ThemeToggleButton,
  MainContent,
} from '../styles/Layout.styles';
import { useAuth } from '../contexts/AuthProviderHook';
import AnchorIcon from '@mui/icons-material/Anchor';
import Box from '@mui/material/Box';
import { ProtectedWrapper } from './ProtectedWrapper';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar, Popover } from '@mui/material';


interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();
  const { token, handleLogout,currentUser } = useAuth();
  const [selected, setSelected] = useState<"farms" | "workers" | "users" | "organizations">();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

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
                <NavButton variant={selected === "organizations" ? "contained" : "text"} onClick={() => {
                  setSelected("organizations");
                  navigate('/orgs')}}>Organizations</NavButton>
              </ProtectedWrapper>

              <ProtectedWrapper allowedRoles={['OrgAdmin', 'OrgUser']}>
                <NavButton 
                  variant={selected === "farms" ? "contained" : "text"} 
                  onClick={() => {
                    setSelected("farms");
                    navigate('/farms')}}>Farms</NavButton>
                <NavButton 
                  variant={selected === "workers" ? "contained" : "text"} 
                  onClick={() => {
                    setSelected("workers");
                    navigate('/workers')}}>Workers</NavButton>
                </ProtectedWrapper>
                <ProtectedWrapper allowedRoles={['OrgAdmin']}>
                <NavButton 
                  variant={selected === "users" ? "contained" : "text"} 
                  onClick={() => {
                    setSelected("users");
                    navigate('/users')}}>Users</NavButton>
              </ProtectedWrapper>

              <Avatar sx={{ width: 32, height: 32 }} onClick={handleClick}>{currentUser?.userName.charAt(0).toUpperCase()}</Avatar>

              {currentUser && (
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <Box sx={{ p: 2 }}>
                  <Typography variant='body2'><strong>{currentUser?.userName}</strong></Typography>
                  <Typography variant='body2'>{currentUser?.email}</Typography>
                  </Box>
              </Popover>
                )}

              {token == null ? (
                <NavButton onClick={() => navigate('/login')}>
                  <LoginIcon/>
                </NavButton>
              ) : (
                <NavButton onClick={() => {
                  handleLogout()
                  navigate('/login')}}>
                  <LogoutIcon/>
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
