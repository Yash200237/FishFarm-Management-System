import { useMutation, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchFarmsNotAssigned } from "../apis/farmsApis";
import type { FarmResponse } from "../types/farm";
import { useState } from "react";
import { assignWorkerToFarm } from "../apis/wokersApis";
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
import { StyledEditBox } from "../styles/Common.styles";
import { ErrorMessage } from "../components/ErrorMessage";

export const WorkerAssignPage = () => {
    type ValidationErrorType = Partial<Record<keyof AssignSchema, string>>;
    
    const {workerId} = useParams<{workerId: string}>();
    const navigate = useNavigate();
    const [validationError, setValidationError] = useState<ValidationErrorType>({});
    const [assignWorker, setAssignWorker] = useState<AssignSchema>({
        WorkerId: workerId || "",
        FarmId: "",
        Role: "Worker",
        CertifiedUntil: new Date().toISOString().split('T')[0],
    });
    const createAssignmentMutation = useMutation(assignWorkerToFarm, {
        onSuccess: () => {
            navigate(`/workers/${workerId}`)
        },
    })  

    const validateField = (key : keyof AssignSchema, value: AssignSchema[keyof AssignSchema]) =>{
        const field = assignSchema.shape[key].safeParse(value);
        if(field.success){
            setValidationError(prev => {
                const newErrors = {...prev};
                delete newErrors[key];
                return newErrors;
            });
        } else {
            setValidationError(prev => ({
                ...prev,
                [key]: ErrorMessage({path: [String(key)], message: field.error.issues[0].message})
            }));
        }
    }

    const {isLoading,isError,data:farms,error} = useQuery(['UnassignedFarms', workerId], () => fetchFarmsNotAssigned(workerId!), { enabled: !!workerId });
    if (!workerId) return <Alert severity="warning">Missing worker id</Alert>
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
                    name = "Role"
                    label="Role"
                    value={assignWorker.Role}
                    onChange={handleChangeInput}
                    error={Boolean(validationError.Role)}
                    helperText={validationError.Role}
                    required
                    fullWidth
                >
                    <MenuItem value="CEO">CEO</MenuItem>
                    <MenuItem value="Captain">Captain</MenuItem>
                    <MenuItem value="Worker">Worker</MenuItem>
                </TextField>

                <TextField
                    select
                    name = "FarmId"
                    label="Select Farm"
                    value={assignWorker.FarmId}
                    onChange={handleChangeInput}
                    fullWidth
                    error={Boolean(validationError.FarmId)}
                    helperText={validationError.FarmId}
                    required
                >
                    <MenuItem value="" disabled>-- Select a farm --</MenuItem>
                    {farms?.map((farm: FarmResponse) => (
                        <MenuItem key={farm.farmId} value={farm.farmId}>{farm.name}</MenuItem>
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
                    required
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
                        <Button type="button" variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate(-1)}>
                            Skip for later
                        </Button>
                </ButtonGroup>
            </StyledEditBox>
        </Paper>
    </Container>
    )
}

