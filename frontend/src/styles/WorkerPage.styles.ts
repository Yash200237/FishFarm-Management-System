import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';

// export const PageContainer = styled(Box)({
//   maxWidth: 900,
//   margin: '0 auto',
// });

export const ProfileCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

export const ProfileHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(3),
}));

export const StyledAvatar = styled(Avatar)({
  width: 120,
  height: 120,
});

export const InfoSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const FarmListItem = styled(ListItem)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
}));
