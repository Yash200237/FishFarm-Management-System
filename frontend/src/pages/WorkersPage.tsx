import { useQuery } from "react-query"
import { fetchUnassignedWorkers, fetchWorkers, fetchExpiredWorkers } from "../apis/wokersApis";
import { useNavigate } from "react-router-dom";
import type { FarmWorkerDto, WorkerResponse } from "../types/worker.ts";
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
import { PageContainer, StyledCard, StyledCardContent, StyledContainerBar, StyledGridBox, StyledHeading, StyledHeadingBar, StyledListItem } from '../styles/Common.styles.ts'
import type { AxiosError } from "axios";
import { SearchBar } from "../components/SearchBar.tsx";
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ModifiedCell } from "../styles/Common.styles.ts";
import { useMutation, useQueryClient } from "react-query"
import { removeWorkerFromFarm } from "../apis/wokersApis";


export function WorkersPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const queryClient = useQueryClient()

  const {isLoading,isError,data:workers,error} = useQuery<WorkerResponse[], AxiosError>('workers',fetchWorkers);
 const removeWorkerFromFarmMutation = useMutation(
  ({ workerId, farmId }: { workerId: string; farmId: string }) =>
    removeWorkerFromFarm(workerId, farmId),
  {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(["worker_farms", variables.workerId]);
      queryClient.invalidateQueries("workers");
      queryClient.invalidateQueries("unassigned_workers");
      queryClient.invalidateQueries("expired_workers");
    },
  }
);
  const filteredWorkers = workers?.filter(worker => {
    const name = (worker.name ?? "").toLowerCase();
    const q = query.trim().toLowerCase();
    return q === "" || name.includes(q);
  });

  const {isLoading:isUnassignedLoading,isError:isUnassignedError,data:unassignedWorkers,error:unassignedError} = useQuery<WorkerResponse[], AxiosError> ('unassigned_workers',fetchUnassignedWorkers);
  const {isLoading:isExpiredLoading,isError:isExpiredError,data:expiredWorkers,error:expiredError} = useQuery<FarmWorkerDto[], AxiosError> ('expired_workers',fetchExpiredWorkers);
  console.log("Expired Workers:", expiredWorkers);

  if(isLoading || isUnassignedLoading || isExpiredLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if(isError || isUnassignedError || isExpiredError)  
    return <Alert severity="error">
      {error instanceof Error ? error?.response?.status === 401 ? 'Please login to continue' : error.message : unassignedError instanceof Error ? unassignedError?.response?.status === 401 ? 'Please login to continue' : unassignedError.message :expiredError instanceof Error ? expiredError?.response?.status === 401 ? 'Please login to continue' : expiredError.message: 'An error occurred'}
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

      {expiredWorkers && expiredWorkers.length > 0 && (
        <SectionContainer>
          <Typography variant="h5" gutterBottom sx={{ color: theme.palette.primary.main }}>
            Expired Certifications
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{marginTop: theme.spacing(2)}}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <ModifiedCell>Worker</ModifiedCell>
                  <ModifiedCell>Farm</ModifiedCell>
                  <ModifiedCell>Role</ModifiedCell>
                  <ModifiedCell>Certified date</ModifiedCell>
                  <ModifiedCell>Action</ModifiedCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {expiredWorkers.map((worker: FarmWorkerDto) => (
                  <TableRow key={worker.workerId} hover>
                    <TableCell>
                      <Button
                        variant="text"
                        size="small"
                        sx={{ p: 0, minWidth: 0, textTransform: "none", justifyContent: "flex-start" }}
                        onClick={() => navigate(`/workers/${worker.workerId}`)}
                      >
                        {worker.workerName}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        size="small"
                        sx={{ p: 0, minWidth: 0, textTransform: "none", justifyContent: "flex-start" }}
                        onClick={() => navigate(`/farms/${worker.farmId}`)}
                      >
                        {worker.farmName}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {worker.role ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          worker.certifiedUntil?? "—"
                        }
                        color="error" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <StyledContainerBar>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() =>
                          navigate(`/farms/${worker.farmId}/workers/${worker.workerId}/edit`)
                        }
                      >
                        Renew
                      </Button>
                      <Button
                      size="small"
                      color="error"
                      disabled={removeWorkerFromFarmMutation.isLoading}
                      onClick={() =>
                        removeWorkerFromFarmMutation.mutate({
                          workerId: worker.workerId,
                          farmId: worker.farmId,
                        })
                      }
                      >
                      {removeWorkerFromFarmMutation.isLoading ? "Removing..." : "Remove"}
                      </Button>
                      </StyledContainerBar>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
