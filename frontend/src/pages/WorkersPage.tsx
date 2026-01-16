import { useQuery } from "react-query"
import { fetchUnassignedWorkers, fetchWorkers } from "../apis/wokersApis";
import { useNavigate } from "react-router-dom";
import type { WorkerResponse } from "../types/worker.ts";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import Chip from '@mui/material/Chip'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { SectionContainer } from '../styles/WorkersPage.styles.ts'
import { PageContainer, StyledCard, StyledCardContent, StyledGridBox, StyledHeading, StyledHeadingBar, StyledListItem } from '../styles/Common.styles.ts'
import type { AxiosError } from "axios";
import { SearchBar } from "../components/SearchBar.tsx";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";

export function WorkersPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [query, setQuery] = useState("");

  const {isLoading,isError,data:workers,error} = useQuery<WorkerResponse[], AxiosError>('workers',fetchWorkers);
    
  const filteredWorkers = workers?.filter(worker => {
    const name = (worker.name ?? "").toLowerCase();
    const q = query.trim().toLowerCase();
    return q === "" || name.includes(q);
  });

  const {isLoading:isUnassignedLoading,isError:isUnassignedError,data:unassignedWorkers,error:unassignedError} = useQuery<WorkerResponse[], AxiosError> ('unassigned_workers',fetchUnassignedWorkers);
  
  if(isLoading || isUnassignedLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if(isError || isUnassignedError) 
    return <Alert severity="error">
      {error instanceof Error ? error?.response?.status === 401 ? 'Please login to continue' : error.message : unassignedError instanceof Error ? unassignedError?.response?.status === 401 ? 'Please login to continue' : unassignedError.message : 'An error occurred'}
      </Alert>;
  
  return (
    <PageContainer>
      <StyledHeadingBar>
        <StyledHeading variant="h4">
          Workers
        </StyledHeading>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/workers/create')}
        >
          Create New Worker
        </Button>
      </StyledHeadingBar>

      {unassignedWorkers && unassignedWorkers.length > 0 && (
        <SectionContainer>
          <Typography variant="h5" gutterBottom sx={{color: theme.palette.primary.main}}>
            Unassigned Workers
          </Typography>
          <List>
            {unassignedWorkers.map((worker: WorkerResponse) => (
              <StyledListItem
                key={worker.workerId}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/workers/${worker.workerId}`)}
                    >
                      View
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained"
                      onClick={() => navigate(`/workers/${worker.workerId}/assign`)}
                    >
                      Assign to Farm
                    </Button>
                  </Box>
                }
              >
                <ListItemText 
                  primary={worker.name}
                  secondary={
                    <>
                      <Chip label="Unassigned" color="warning" size="small" sx={{ mt: 0.5 }} />
                    </>
                  }
                />
              </StyledListItem>
            ))}
          </List>
        </SectionContainer>
      )}

      <StyledHeadingBar>
        <Typography variant="h5" sx={{color: theme.palette.primary.main }}>
          All Workers
        </Typography>
        <SearchBar query={query} setQuery={setQuery} />
      </StyledHeadingBar>

      {
        workers?.length === 0 &&
        <Alert severity="info">No workers available. Please create a new worker.</Alert>
      }
      <StyledGridBox>
        {filteredWorkers?.map((worker: WorkerResponse) => 
          <StyledCard key={worker.workerId}>
            <StyledCardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {worker.name}
                </Typography>
                <Typography color="text.secondary">
                  Age: {worker.age}
                </Typography>
                <Typography color="text.secondary">
                  Email: {worker.email}
                </Typography>
              </StyledCardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/workers/${worker.workerId}`)}>
                  View Details
                </Button>
              </CardActions>
            </StyledCard>
        )}
      </StyledGridBox>

      <Fab 
        color="primary" 
        aria-label="add"
        onClick={() => navigate('/workers/create')}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
    </PageContainer>
  )
}
