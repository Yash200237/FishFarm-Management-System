import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import MenuItem from '@mui/material/MenuItem'
import { assignSchema, type AssignSchema } from "../schemas/workerSchemas";
import ButtonGroup from "@mui/material/ButtonGroup";
import { updateWorkerToFarm } from "../apis/wokersApis";
import { useQuery } from "react-query";
import { fetchWorkerToFarm } from "../apis/wokersApis";
import CircularProgress from "@mui/material/CircularProgress";

export const WorkerAssignEditPage = () => {
    const {workerId} = useParams<{workerId: string}>();
    const {farmId} = useParams<{farmId: string}>();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [assignWorker, setAssignWorker] = useState<AssignSchema | null>(null);
    const {isLoading,isError,data:assignWorkerData,error} = useQuery(['FarmWorker',workerId, farmId],() => fetchWorkerToFarm(workerId!, farmId!),{
            enabled: !!workerId && !!farmId ,
            refetchOnMount:true,
            onSuccess: (fw) => {
            setAssignWorker({
                WorkerId: fw.workerId ?? "",
                FarmId: fw.farmId ?? "",
                Role: fw.role,
                CertifiedUntil: fw.certifiedUntil ? new Date(fw.certifiedUntil).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            });
        }
        }
        );
    
    const updateAssignmentMutation = useMutation(updateWorkerToFarm, {
        onSuccess: () => {
            navigate(-1)
        },
    })  

if (!workerId || !farmId) return <Alert severity="warning">Missing worker id or farm id</Alert>
    if(isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if(isError) return <Alert severity="error">{error instanceof Error ? error.message : 'An error occurred'}</Alert>;
    if(!assignWorkerData) return <Alert severity="info">No data available</Alert>;
    if (!assignWorker) return <Alert severity="info">Preparing form...</Alert>;

    const handleOnClick = () => {
        const result = assignSchema.safeParse(assignWorker);
        if(result.success){
            updateAssignmentMutation.mutate(result.data)}
        else {
            setErrorMessage(result.error.issues[0].path + " : " + result.error.issues[0].message);
        }
    }

  return (
    <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Assign Worker to Farm
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>

                {errorMessage && (
                    <Alert severity="error">
                        {errorMessage}
                    </Alert>
                )}

                <TextField
                    select
                    label="Role"
                    value={assignWorker.Role}
                    onChange={(e) =>
                        setAssignWorker((prev) => prev ? { ...prev, Role: e.target.value as AssignSchema["Role"] } : null)
                    }
                    fullWidth
                >
                    <MenuItem value="CEO">CEO</MenuItem>
                    <MenuItem value="Captain">Captain</MenuItem>
                    <MenuItem value="Worker">Worker</MenuItem>
                </TextField>

                <TextField
                    type="date"
                    label="Certified Until"
                    value={assignWorker.CertifiedUntil}
                    onChange={(e) =>
                        setAssignWorker((prev) => prev ? { ...prev, CertifiedUntil: e.target.value } : null)
                    }
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                <ButtonGroup fullWidth>
                        <Button 
                            variant="contained"
                            disabled={!assignWorker.FarmId || updateAssignmentMutation.isLoading}
                            onClick={() => {
                                handleOnClick();
                            }
                            }
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            {updateAssignmentMutation.isLoading ? 'Updating...' : 'Update Assignment'}
                        </Button>
                        <Button type="button" variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                </ButtonGroup>
            </Box>
        </Paper>
    </Container>
    )
}

