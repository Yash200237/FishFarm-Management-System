import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { assignWorkerToFarm, fetchWorkersNotAssigned } from "../apis/wokersApis";
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import MenuItem from '@mui/material/MenuItem'
import { assignSchema, type AssignSchema } from "../schemas/workerSchemas";
import ButtonGroup from "@mui/material/ButtonGroup";
import type { WorkerResponse } from "../types/worker";

export const FarmWorkerAssignPage = () => {
    const {farmId} = useParams<{farmId: string}>();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [assignWorker, setAssignWorker] = useState<AssignSchema>({
        WorkerId: "",
        FarmId: farmId || "",
        Role: "Worker",
        CertifiedUntil: new Date().toISOString().split('T')[0],
    });
    const createAssignmentMutation = useMutation(assignWorkerToFarm, {
        onSuccess: () => {
            navigate(`/farms/${farmId}`)

        },
    })  
    const {isLoading,isError,data:workers,error} = useQuery('workers', () => fetchWorkersNotAssigned(farmId!));
    if (!farmId) return <Alert severity="warning">Missing farm id</Alert>
    if(isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if(isError) return <Alert severity="error">{error instanceof Error ? error.message : 'An error occurred'}</Alert>;      

    const handleOnClick = () => {
        const result = assignSchema.safeParse(assignWorker);
        if(result.success){
            createAssignmentMutation.mutate(assignWorker)}
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
                        setAssignWorker((prev) => ({ ...prev, Role: e.target.value as AssignSchema["Role"] }))
                    }
                    fullWidth
                >
                    <MenuItem value="CEO">CEO</MenuItem>
                    <MenuItem value="Captain">Captain</MenuItem>
                    <MenuItem value="Worker">Worker</MenuItem>
                </TextField>

                <TextField
                    select
                    label="Select Worker"
                    value={assignWorker.WorkerId}
                    onChange={(e) =>
                        setAssignWorker((prev) => ({ ...prev, WorkerId: e.target.value }))
                    }
                    fullWidth
                    required
                >
                    <MenuItem value="">-- Select a worker --</MenuItem>
                    {workers?.map((worker: WorkerResponse) => (
                        <MenuItem key={worker.workerId} value={worker.workerId}>{worker.name}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    type="date"
                    label="Certified Until"
                    value={assignWorker.CertifiedUntil}
                    onChange={(e) =>
                        setAssignWorker((prev) => ({ ...prev, CertifiedUntil: e.target.value}))
                    }
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                <ButtonGroup fullWidth>
                        <Button 
                            variant="contained"
                            disabled={!assignWorker.FarmId || createAssignmentMutation.isLoading}
                            onClick={() => {
                                handleOnClick();
                            }
                            }
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            {createAssignmentMutation.isLoading ? 'Assigning...' : 'Assign to Farm'}
                        </Button>
                        <Button type="button" variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/workers')}>
                            Skip for later
                        </Button>
                </ButtonGroup>
            </Box>
        </Paper>
    </Container>
    )
}

