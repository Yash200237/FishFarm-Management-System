import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';

export const PageContainer = styled(Box)({
  maxWidth: 1200,
  margin: '0 auto',
});

export const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

export const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 600,
  margin: '0 auto',
  padding: theme.spacing(4),
}));

export const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

export const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

