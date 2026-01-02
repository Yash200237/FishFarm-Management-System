import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';

export const PageContainer = styled(Box)({
  maxWidth: 1200,
  margin: '0 auto',
});

export const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

export const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));
