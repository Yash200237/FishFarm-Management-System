import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

export const DetailCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

export const InfoSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));


