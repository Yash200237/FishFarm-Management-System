import { styled } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import { alpha } from '@mui/material/styles';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.info.main, 0.2),
  fontWeight: 'bold',
  color: theme.palette.primary.main,
  textAlign: 'left',
}));
  
