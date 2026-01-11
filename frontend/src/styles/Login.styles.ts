import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

export const StyledPaper = styled(Paper)(({ theme }) => ({
  maxWidth: 400,
  margin: '0 auto',
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
}));
