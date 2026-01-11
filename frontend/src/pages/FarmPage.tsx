import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query"
import { DeleteFarm, fetchFarmById } from "../apis/farmsApis";
import { useNavigate } from "react-router-dom";
import { fetchWorkerByFarmId, removeWorkerFromFarm } from "../apis/wokersApis";
import type { FarmWorkerDetails } from "../types/worker";
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { DetailCard, InfoSection, WorkerListItem } from '../styles/FarmPage.styles'
import {PageContainer} from '../styles/Common.styles'
import { ProtectedWrapper } from "../components/ProtectedWrapper";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { useState } from "react";

export const FarmPage = () => {
    const {farmId} = useParams<{farmId: string}>();
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    console.log("Farm ID:", farmId);
    const {isLoading,isError,data:farm,error} = useQuery(['farms',farmId],() => fetchFarmById(farmId!),{ enabled: !!farmId });
    const deleteFarmMutation = useMutation(DeleteFarm, {
    onSuccess: async() => {
      await queryClient.cancelQueries(["farms", farmId])
      queryClient.removeQueries(["farms", farmId])
      queryClient.invalidateQueries("farms")
      navigate("/farms")
    },
    })
    const [open,setOpen] = useState(false);
    const [openWorker,setOpenWorker] = useState(false);
    const [dialogWorkerId, setDialogWorkerId] = useState<string | null>(null);
    const [dialogFarmId, setDialogFarmId] = useState<string | null>(null);

    const {isLoading:isWorkersLoading,isError:isWorkersError,data:workers} = useQuery(['farm_workers',farmId],() => fetchWorkerByFarmId(farmId!),{ enabled: !!farmId });

    const removeWorkerFromFarmMutation = useMutation(({workerId, farmId}: {workerId: string; farmId: string}) => removeWorkerFromFarm(workerId, farmId), {
      onSuccess: () => {
        queryClient.invalidateQueries(['farm_workers', farmId])
      },
    })

    const handleClickOpen = () => {
      setOpen(true);
    }

    const handleClickOpenWorker = (workerId: string, farmId: string) => {
      setDialogWorkerId(workerId);
      setDialogFarmId(farmId);
      setOpenWorker(true);
    }

    if (!farmId) return <Alert severity="warning">Missing farm id</Alert>;
    if(isLoading || isWorkersLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if(isError || isWorkersError) return <Alert severity="error">{error instanceof Error ? error.message : 'An error occurred'}</Alert>;
    if(!farm || !workers) return <Alert severity="info">No data available</Alert>;

    return (
      <PageContainer>
        {open && DeleteAlertDialog(
          open,
          "this farm.? All associated workers of this farm will be unassigned.",
          () => {
            deleteFarmMutation.mutate(farmId);
            setOpen(false);

          },
          () => {
            setOpen(false);
          }
        )}        
        {openWorker && DeleteAlertDialog(
          openWorker,
          "this worker assignment?.",
          () => {
            removeWorkerFromFarmMutation.mutate({ workerId: dialogWorkerId!, farmId: dialogFarmId! });
            setOpenWorker(false);
          },
          () => {
            setOpenWorker(false);
          }
        )}
        <DetailCard>
          <Typography variant="h3" component="h1" gutterBottom>
            {farm.name}
          </Typography>
          
          <InfoSection>
            <Typography variant="body1" color="text.secondary">
              <strong>Location:</strong> {farm.latitude}, {farm.longitude}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>Number of Cages:</strong> {farm.noOfCages}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>Has Barge:</strong> <Chip label={farm.hasBarge ? "Yes" : "No"} color={farm.hasBarge ? "success" : "default"} size="small" />
            </Typography>
            <Typography variant="body1" color="text.secondary">
              <strong>Phone:</strong> {farm.phone ?  farm.phone : <i>Not Provided</i>}
            </Typography>
          </InfoSection>

          {farm.picture && (
            <Box sx={{ mt: 2, mb: 2}}>
              <img src={farm.picture} alt={farm.name} style={{ maxWidth: '100%', borderRadius: 8 }} />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" gutterBottom>
                Farm Workers
              </Typography>
              <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => navigate(`/farms/${farm.farmId}/workers/assign`)}
                >
                  Assign Workers
                </Button>
          </Box>

          
          {workers.length === 0 ? (
            <Alert severity="info">No workers assigned to this farm</Alert>
          ) : (
            <List>
              {workers.map((worker:FarmWorkerDetails) => 
                <WorkerListItem
                  key={worker.workerId}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        onClick={() => navigate(`/farms/${farm.farmId}/workers/${worker.workerId}/edit`)}>
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => navigate(`/workers/${worker.workerId}`)}
                      >
                        View Worker
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        disabled={removeWorkerFromFarmMutation.isLoading}
                        onClick={() =>handleClickOpenWorker(worker.workerId, farm.farmId)}
                      >
                        {removeWorkerFromFarmMutation.isLoading ? "Removing..." : "Remove"}
                      </Button>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={worker.workerName}
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {worker.workerEmail}
                        </Typography>
                        <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                          <Chip label={worker.role} size="small" color="primary" />
                          <Chip 
                            label={`Until: ${worker.certifiedUntil ?? "N/A"}`}
                            size="small" 
                          />
                        </Box>
                      </Box>
                    }
                  />
                </WorkerListItem>
              )}
            </List>
          )}

          <Divider sx={{ my: 3 }} />

        <ProtectedWrapper allowedRoles={['OrgAdmin']}>
          <ButtonGroup variant="contained" fullWidth>
            <Button 
              startIcon={<EditIcon />}
              onClick={() => navigate(`/farms/${farm.farmId}/edit`)}
            >
              Edit
            </Button>
            <Button 
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleClickOpen()}
            >
              Delete
            </Button>
          </ButtonGroup>
        </ProtectedWrapper>
        </DetailCard>
      </PageContainer>
    )
}
