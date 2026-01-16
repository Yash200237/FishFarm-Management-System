import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider';
import {Container} from '@mui/material'
import Button from '@mui/material/Button'
import { ImageContainer, StyledBox } from '../styles/Common.styles';

interface DefaultHomeProps {
  isGlobalAdmin?: boolean;
}

export const DefaultHome = ({ isGlobalAdmin}: DefaultHomeProps) => {
  return (
    <Container maxWidth="md" >
      <StyledBox>
        <Typography variant="h4" component="h1" gutterBottom sx={{ alignItems: 'center', mt: 8 }}>
            <strong>Welcome to the Fish Farm Management System</strong>
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <ImageContainer>
          <img 
            src="/img/logo.png" 
            alt="Fish Farm Logo" 
            style={{ width: '200px', height: '200px' }} 
          />
        </ImageContainer>
        <Divider sx={{ my: 2 }} />
        {!isGlobalAdmin && <Button variant="contained" color="primary" href="/login" sx={{ mb: 2 }}>
          Please Login to Continue
        </Button>}
        <Typography variant="h6" color="text.secondary">
          Efficiently manage your fish farming operations with ease.
        </Typography>
        <Divider sx={{ my: 2 }} />
      </StyledBox>
      </Container>
  )
}
