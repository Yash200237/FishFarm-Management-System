import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useQuery } from 'react-query';
import { fetchOrgById } from '../apis/orgsApis';
import { useAuth } from '../contexts/AuthProviderHook';
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { DefaultHome } from '../components/DefaultHome';
import type { OrgResponse } from '../types/org';
import type { AxiosError } from 'axios';
import Divider from '@mui/material/Divider';
import { ImageContainer, StyledBox } from '../styles/Common.styles';

export const HomePage = () => {
  const {currentUser} = useAuth();
  const {isLoading,isError,data:org,error} = useQuery<OrgResponse,AxiosError>([currentUser?.orgId],() => fetchOrgById(currentUser!.orgId!),{ enabled: !!currentUser?.orgId });
  
  if(currentUser?.userRole=="GlobalAdmin" ) return <DefaultHome isGlobalAdmin={true}/>;
  if(!currentUser) return <DefaultHome isGlobalAdmin={false}/>;
  
  if(isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if(isError){
     return <Alert severity="error">{error?.response?.status === 401 ? 'Please login to continue' : error?.message || 'An error occurred'}</Alert>;
  }
  return (
    <Container maxWidth="md" >
      <StyledBox>
        <Typography variant="h3" component="h1" gutterBottom sx={{ alignItems: 'center', mt: 6 }}>
          <strong>{org?.name}</strong>
        </Typography>
        <Divider sx={{ my: 2 }} />
        <ImageContainer>
          <img 
            src={org?.logo}
            alt="Fish Farm Logo" 
            style={{ maxHeight: '250px',margin:10 }} 
          />
        </ImageContainer>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" color="text.secondary">
          {org?.description}
        </Typography>
        <Divider sx={{ my: 2 }} />
      </StyledBox>
    </Container>
  )
}
