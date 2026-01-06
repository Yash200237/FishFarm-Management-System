import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';

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

export const UserListItem = styled(ListItem)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
}));
