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
import { StyledEditBox } from "../styles/Common.styles";
import { ErrorMessage } from "../components/ErrorMessage";

export const FarmWorkerAssignPage = () => {
    type ValidationErrorType = Partial<Record<keyof AssignSchema, string>>;
    const {farmId} = useParams<{farmId: string}>();
    const navigate = useNavigate();
  const [validationError, setValidationError] = useState<ValidationErrorType>({});
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

    const validateField = (key: keyof AssignSchema, value: AssignSchema[keyof AssignSchema]) => {
    const result = assignSchema.shape[key].safeParse(value);

    if (result.success) {
      setValidationError((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } else {
        setValidationError((prev) => ({
            ...prev,
            [key]: ErrorMessage({ path: [String(key)], message: result.error.issues[0].message }),
        }));
        }
    };

    const {isLoading,isError,data:workers,error} = useQuery(["workers_not_assigned", farmId], () => fetchWorkersNotAssigned(farmId!),{ enabled: !!farmId });
    if (!farmId) return <Alert severity="warning">Missing farm id</Alert>
    if(isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if(isError) return <Alert severity="error">{error instanceof Error ? error.message : 'An error occurred'}</Alert>; 
        
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const {name,value} = e.target;
        const key = name as keyof AssignSchema;
        setAssignWorker(prev =>({
            ...prev,
            [key]: value
        }))

        validateField(key,value as AssignSchema[keyof AssignSchema]);
    }

    const handleOnClick = () => {
        const result = assignSchema.safeParse(assignWorker);
        if(result.success){
            setValidationError({});
            createAssignmentMutation.mutate(assignWorker)}
        else {
            const errors: ValidationErrorType = {};
            for (const issue of result.error.issues) {
            const key = issue.path[0] as keyof AssignSchema;
            errors[key] = ErrorMessage({
                path: [String(key)],
                message: issue.message,
            });
            }
            setValidationError(errors);        }
    }

  return (
    <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
            <Typography variant="h4" component="h2" gutterBottom>
                Assign Worker to Farm
            </Typography>

            <StyledEditBox>

                <TextField
                    select
                    name="Role"
                    label="Role"
                    value={assignWorker.Role}
                    error={Boolean(validationError.Role)}
                    helperText={validationError.Role}
                    onChange={handleChangeInput}
                    fullWidth
                >
                    <MenuItem value="CEO">CEO</MenuItem>
                    <MenuItem value="Captain">Captain</MenuItem>
                    <MenuItem value="Worker">Worker</MenuItem>
                </TextField>

                <TextField
                    select
                    name="WorkerId"
                    label="Select Worker"
                    value={assignWorker.WorkerId}
                    onChange={handleChangeInput}
                    error={Boolean(validationError.WorkerId)}
                    helperText={validationError.WorkerId}
                    fullWidth
                    required
                >
                    <MenuItem value="" disabled>-- Select a worker --</MenuItem>
                    {workers?.map((worker: WorkerResponse) => (
                        <MenuItem key={worker.workerId} value={worker.workerId}>{worker.name}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    type="date"
                    name="CertifiedUntil"
                    label="Certified Until"
                    value={assignWorker.CertifiedUntil}
                    onChange={handleChangeInput}
                    error={Boolean(validationError.CertifiedUntil)}
                    helperText={validationError.CertifiedUntil}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                />
                <ButtonGroup fullWidth>
                        <Button 
                            variant="contained"
                            disabled={!assignWorker.WorkerId  || createAssignmentMutation.isLoading}
                            onClick={() => {
                                handleOnClick();
                            }
                            }
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            {createAssignmentMutation.isLoading ? 'Assigning...' : 'Assign to Farm'}
                        </Button>
                        <Button type="button" variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate(`/farms/${farmId}`)}>
                            Skip for later
                        </Button>
                </ButtonGroup>
            </StyledEditBox>
        </Paper>
    </Container>
    )
}

