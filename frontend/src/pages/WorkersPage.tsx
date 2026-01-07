import { useQuery } from "react-query"
import { fetchUnassignedWorkers, fetchWorkers } from "../apis/wokersApis";
import { useNavigate } from "react-router-dom";
import type { WorkerResponse } from "../types/worker.ts";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Chip from '@mui/material/Chip'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { PageContainer, StyledCard, SectionContainer } from './WorkersPage.styles'
import type { AxiosError } from "axios";

export function WorkersPage() {
  const navigate = useNavigate();
  const {isLoading,isError,data:workers,error} = useQuery<WorkerResponse[], AxiosError>('workers',fetchWorkers);
  const {isLoading:isUnassignedLoading,isError:isUnassignedError,data:unassignedWorkers,error:unassignedError} = useQuery<WorkerResponse[], AxiosError> ('unassigned_workers',fetchUnassignedWorkers);
  
  if(isLoading || isUnassignedLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if(isError || isUnassignedError) 
    return <Alert severity="error">
      {error instanceof Error ? error?.response?.status === 401 ? 'Please login to continue' : error.message : unassignedError instanceof Error ? unassignedError?.response?.status === 401 ? 'Please login to continue' : unassignedError.message : 'An error occurred'}
      </Alert>;
  
  return (
    <PageContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Workers
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/workers/create')}
        >
          Create New Worker
        </Button>
      </Box>

      {unassignedWorkers && unassignedWorkers.length > 0 && (
        <SectionContainer>
          <Typography variant="h5" gutterBottom>
            Unassigned Workers
          </Typography>
          <List>
            {unassignedWorkers.map((worker: WorkerResponse) => (
              <ListItem 
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
              </ListItem>
            ))}
          </List>
        </SectionContainer>
      )}

      <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
        All Workers
      </Typography>
      {
        workers?.length === 0 &&
        <Alert severity="info">No workers available. Please create a new worker.</Alert>
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
        {workers?.map((worker: WorkerResponse) => 
          <StyledCard key={worker.workerId}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {worker.name}
                </Typography>
                <Typography color="text.secondary">
                  Age: {worker.age}
                </Typography>
                <Typography color="text.secondary">
                  Email: {worker.email}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/workers/${worker.workerId}`)}>
                  View Details
                </Button>
              </CardActions>
            </StyledCard>
        )}
      </Box>

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
