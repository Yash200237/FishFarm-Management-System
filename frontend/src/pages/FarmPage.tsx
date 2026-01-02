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
import { PageContainer, DetailCard, InfoSection, WorkerListItem } from './FarmPage.styles'
import { ProtectedWrapper } from "../components/ProtectedWrapper";

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

    const {isLoading:isWorkersLoading,isError:isWorkersError,data:workers} = useQuery(['farm_workers',farmId],() => fetchWorkerByFarmId(farmId!),{ enabled: !!farmId });

    const removeWorkerFromFarmMutation = useMutation(({workerId, farmId}: {workerId: string; farmId: string}) => removeWorkerFromFarm(workerId, farmId), {
      onSuccess: () => {
        queryClient.invalidateQueries(['farm_workers', farmId])
      },
    })

    if (!farmId) return <Alert severity="warning">Missing farm id</Alert>;
    if(isLoading || isWorkersLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if(isError || isWorkersError) return <Alert severity="error">{error instanceof Error ? error.message : 'An error occurred'}</Alert>;
    if(!farm || !workers) return <Alert severity="info">No data available</Alert>;

    return (
      <PageContainer>
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
              <strong>Phone:</strong> {farm.phone}
            </Typography>
          </InfoSection>

          {farm.picture && (
            <Box sx={{ mt: 2, mb: 2}}>
              <img src={farm.picture} alt={farm.name} style={{ maxWidth: '100%', borderRadius: 8 }} />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom>
            Farm Workers
          </Typography>
          
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
                        onClick={() => navigate(`/workers/${worker.workerId}`)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        disabled={removeWorkerFromFarmMutation.isLoading}
                        onClick={() =>
                          removeWorkerFromFarmMutation.mutate({ workerId: worker.workerId, farmId: farm.farmId })
                        }
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
              onClick={() => deleteFarmMutation.mutate(farmId!)}
            >
              Delete
            </Button>
          </ButtonGroup>
        </ProtectedWrapper>
        </DetailCard>
      </PageContainer>
    )
}
