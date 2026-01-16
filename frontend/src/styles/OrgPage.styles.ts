import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

export const PageContainer = styled(Box)({
  maxWidth: "100%",
  margin: '0 auto',
  paddingLeft: '24px',
  paddingRight: '24px',
});

export const DetailCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  height: '80vh', 
  overflow: 'auto',
  scrollbarWidth: "none",

}));

export const InfoSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const LogoImage = styled('img')(() => ({
  maxWidth: "300px",
  maxHeight: "300px",
  borderRadius: 8,
}));
