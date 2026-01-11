import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom";
import { DeleteWorker, fetchWorkerById, removeWorkerFromFarm } from "../apis/wokersApis";
import { fetchFarmByworkerId } from "../apis/farmsApis";
import type { FarmWDetailsDto } from "../types/worker";
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
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import { ProfileCard, ProfileHeader, StyledAvatar, InfoSection, FarmListItem } from '../styles/WorkerPage.styles'
import { PageContainer} from '../styles/Common.styles'
import { useState } from "react";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";

export const WorkerPage = () => {
    const {workerId} = useParams<{workerId: string}>();
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    console.log("WorkerId ID:", workerId);
    const {isLoading,isError,data:worker,error} = useQuery(['workers',workerId],() => fetchWorkerById(workerId!),{ enabled: !!workerId });
    const deleteWorkerMutation = useMutation(DeleteWorker, {
      onSuccess: async() => {
        await queryClient.cancelQueries(["workers", workerId])
        queryClient.removeQueries(["workers", workerId])
        queryClient.invalidateQueries("workers")
        navigate("/workers")
      },
    })

    const [open,setOpen] = useState(false);
    const [openWorker,setOpenWorker] = useState(false);
    const [dialogWorkerId, setDialogWorkerId] = useState<string | null>(null);
    const [dialogFarmId, setDialogFarmId] = useState<string | null>(null);
    
    const {isLoading:isFarmsLoading,isError:isFarmsError,data:farms} = useQuery(['worker_farms',workerId],() => fetchFarmByworkerId(workerId!),{ enabled: !!workerId });

    const removeWorkerFromFarmMutation = useMutation(({workerId, farmId}: {workerId: string; farmId: string}) => removeWorkerFromFarm(workerId, farmId), {
      onSuccess: () => {
        queryClient.invalidateQueries(['worker_farms', workerId])
      },
    })
    console.log("farms raw:", farms, Array.isArray(farms))


    if (!workerId) return <Alert severity="warning">Missing worker id</Alert>;
    if(isLoading || isFarmsLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if(isError || isFarmsError) return <Alert severity="error">{error instanceof Error ? error.message : 'An error occurred'}</Alert>;
    if (!worker || !farms) return <Alert severity="info">No data available</Alert>;

    const handleClickOpen = () => {
      setOpen(true);
    }

    const handleClickOpenWorker = (workerId: string, farmId: string) => {
      setDialogWorkerId(workerId);
      setDialogFarmId(farmId);
      setOpenWorker(true);
    }

    return (
      <PageContainer>
        {DeleteAlertDialog(
          open,
          "this worker.? Worker will be removed from all assigned farms.",
          () => {
            deleteWorkerMutation.mutate(worker.workerId!);
            setOpen(false);
          },
          () => {setOpen(false);}
        )}
        {openWorker && DeleteAlertDialog(
          openWorker,
          "this farm assignment?.",
          () => {
            removeWorkerFromFarmMutation.mutate({ workerId: dialogWorkerId!, farmId: dialogFarmId! });
            setOpenWorker(false);
          },
          () => {
            setOpenWorker(false);
          }
        )}
        <ProfileCard>
          <ProfileHeader>
            <StyledAvatar src={worker.picture} alt={worker.name} />
            <Box>
              <Typography variant="h3" component="h1">
                {worker.name}
              </Typography>
              <Chip label={`Age: ${worker.age}`} sx={{ mt: 1 }} />
            </Box>
          </ProfileHeader>

          <InfoSection>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <EmailIcon color="action" />
              <Typography variant="body1">{worker.email}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon color="action" />
              <Typography variant="body1">{worker.phone}</Typography>
            </Box>
          </InfoSection>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h5" gutterBottom>
            Assigned Farms
          </Typography>

          {farms.length === 0 ? (
            <Alert severity="info">Not assigned to any farm</Alert>
          ) : (
            <List>
              {farms.map((farm:FarmWDetailsDto) =>
                <FarmListItem
                  key={farm.farmId}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        onClick={() => navigate(`/farms/${farm.farmId}/workers/${worker.workerId}/edit`)}>
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        onClick={() => navigate(`/farms/${farm.farmId}`)}
                      >
                        View Farm
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
                    primary={farm.farmName}
                    secondary={
                      <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                        <Chip label={farm.role} size="small" color="primary" />
                        <Chip 
                          label={`Until: ${farm.certifiedUntil ?? "N/A"}`}
                          size="small" 
                        />
                      </Box>
                    }
                  />
                </FarmListItem>
              )}
            </List>
          )}

          <Divider sx={{ my: 3 }} />

          <ButtonGroup variant="contained" fullWidth>
            <Button 
              startIcon={<EditIcon />}
              onClick={() => navigate(`/workers/${worker.workerId}/edit`)}
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
        </ProfileCard>
      </PageContainer>
    )
}
