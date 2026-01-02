import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles';

export const HomePage = () => {
  const theme = useTheme();
  return (
    <Container maxWidth="md" >
      <Box sx={{ textAlign: 'center', mb: 4, backgroundColor: theme.palette.background.paper, padding: 3, borderRadius: 2,border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ alignItems: 'center', mt: 8 }}>
          Fish Farm Management System
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img 
            src="/img/logo.png" 
            alt="Fish Farm Logo" 
            style={{ width: '250px', height: '250px' }} 
          />
        </Box>
        <Typography variant="h6" color="text.secondary">
          Efficiently manage your fish farming operations with ease.
        </Typography>
      </Box>
    </Container>
  )
}
