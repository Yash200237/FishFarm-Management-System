import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';


export const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
}));
