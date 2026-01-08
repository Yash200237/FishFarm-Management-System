import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import {Container} from '@mui/material'
import Button from '@mui/material/Button'

interface DefaultHomeProps {
  isGlobalAdmin?: boolean;
}

export const DefaultHome = ({ isGlobalAdmin}: DefaultHomeProps) => {
  const theme = useTheme();
  return (
    <Container maxWidth="md" >
      <Box sx={{ textAlign: 'center', mb: 4, backgroundColor: theme.palette.background.paper, padding: 3, borderRadius: 2,border: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ alignItems: 'center', mt: 8 }}>
            <strong>Welcome to the Fish Farm Management System</strong>
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img 
            src="/img/logo.png" 
            alt="Fish Farm Logo" 
            style={{ width: '200px', height: '200px' }} 
          />
        </Box>
        <Divider sx={{ my: 2 }} />
        {!isGlobalAdmin && <Button variant="contained" color="primary" href="/login" sx={{ mb: 2 }}>
          Please Login to Continue
        </Button>}
        <Typography variant="h6" color="text.secondary">
          Efficiently manage your fish farming operations with ease.
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>
      </Container>
  )
}
