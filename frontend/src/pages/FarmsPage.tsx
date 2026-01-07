import { useQuery } from "react-query"
import { fetchFarms } from "../apis/farmsApis";
import type {FarmResponse} from "../types/farm.ts";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { PageContainer, StyledCard } from './FarmsPage.styles'
import type { AxiosError } from "axios";
import { ProtectedWrapper } from "../components/ProtectedWrapper.tsx";

export function FarmsPage() {
  const navigate = useNavigate();
  const {isLoading,isError,data:farms,error} = useQuery<FarmResponse[], AxiosError>('farms',fetchFarms);
  
  if(isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if(isError){
     return <Alert severity="error">{error instanceof Error ? error?.response?.status === 401 ? 'Please login to continue' : error.message : 'An error occurred'}</Alert>;
  }
  
  return (
    <PageContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Farms
        </Typography>
        <ProtectedWrapper allowedRoles={['OrgAdmin']}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/farms/create')}
        >
          Create New Farm
        </Button>
        </ProtectedWrapper>
      </Box>
      {
        farms?.length === 0 &&
        <Alert severity="info">No farms available. Please create a new farm.</Alert>
      }
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          }, 
          gap: 3 
        }}
      >
        {farms?.map((farm: FarmResponse) => 
          <StyledCard key={farm.farmId}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {farm.name}
                </Typography>
                <Typography color="text.secondary">
                  Cages: {farm.noOfCages}
                </Typography>
                <Typography color="text.secondary">
                  Barge: {farm.hasBarge ? 'Yes' : 'No'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/farms/${farm.farmId}`)}>
                  View Details
                </Button>
              </CardActions>
            </StyledCard>
        )}
      </Box>

      <ProtectedWrapper allowedRoles={['OrgAdmin']}>
      <Fab 
        color="primary" 
        aria-label="add"
        onClick={() => navigate('/farms/create')}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
      </ProtectedWrapper>
    </PageContainer>
  )
}
