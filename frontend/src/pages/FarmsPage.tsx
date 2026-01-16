import { useQuery } from "react-query"
import { fetchFarms } from "../apis/farmsApis";
import type {FarmResponse} from "../types/farm.ts";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { PageContainer, StyledCard, StyledCardContent, StyledContainerBar, StyledGridBox, StyledHeading, StyledHeadingBar } from '../styles/Common.styles.ts'
import type { AxiosError } from "axios";
import { ProtectedWrapper } from "../components/ProtectedWrapper.tsx";
import { SearchBar } from "../components/SearchBar.tsx";
import { useState } from "react";

export function FarmsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const {isLoading,isError,data:farms,error} = useQuery<FarmResponse[], AxiosError>('farms',fetchFarms);
  
  const filteredFarms = farms?.filter(farm => {
    const name = (farm.name ?? "").toLowerCase();
    const q = query.trim().toLowerCase();
    return q === "" || name.includes(q);
  });
  if(isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if(isError){
     return <Alert severity="error">{error instanceof Error ? error?.response?.status === 401 ? 'Please login to continue' : error.message : 'An error occurred'}</Alert>;
  }
  
  return (
    <PageContainer>
      <StyledHeadingBar>
        <StyledHeading variant="h4">
          Farms
        </StyledHeading>
          <StyledContainerBar>
            <SearchBar query={query} setQuery={setQuery} />
            <ProtectedWrapper allowedRoles={['OrgAdmin']}>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => navigate('/farms/create')}
            >
              Create New Farm
            </Button>
            </ProtectedWrapper>
          </StyledContainerBar>
      </StyledHeadingBar>
      {
        farms?.length === 0 &&
        <Alert severity="info">No farms available. Please create a new farm.</Alert>
      }
      <StyledGridBox>
        {filteredFarms?.map((farm: FarmResponse) => 
          <StyledCard key={farm.farmId}>
              <StyledCardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {farm.name}
                </Typography>
                <Typography color="text.secondary">
                  Cages: {farm.noOfCages}
                </Typography>
                <Typography color="text.secondary">
                  Barge: {farm.hasBarge ? 'Yes' : 'No'}
                </Typography>
              </StyledCardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/farms/${farm.farmId}`)}>
                  View Details
                </Button>
              </CardActions>
            </StyledCard>
        )}
      </StyledGridBox>

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
