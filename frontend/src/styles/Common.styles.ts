import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import { CardContent, ListItem, TableCell, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

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

export const StyledCardContent = styled(CardContent)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 1,
  marginBottom: theme.spacing(1),
  backgroundColor: alpha(theme.palette.primary.main, 0.05)
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

export const StyledBox = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`
}));

export const StyledHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.primary.main,
}));

export const StyledHeadingBar= styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  backgroundColor:alpha(theme.palette.primary.main, 0.1),
  padding: theme.spacing(2)
}));

export const StyledGridBox= styled(Box)(({ theme }) => ({
  display: 'grid', 
  gridTemplateColumns: '1fr',
  gap: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
}));

export const ChipContainer= styled(Box)(({theme}) => ({
  display: 'flex',
  marginTop: theme.spacing(0.5),
  gap: theme.spacing(1)
}));

export const StyledContainerBar= styled(Box)(({theme}) => ({
  display: 'flex',
  alignItems: 'right',
  gap: theme.spacing(2)
}));

export const ImageContainer= styled(Box)(({theme}) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  backgroundColor:alpha(theme.palette.primary.main, 0.2),
  borderRadius:2,
}));

export const StyledEditBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
})); 

export const ModifiedCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: alpha(theme.palette.primary.main, 0.1),

}));