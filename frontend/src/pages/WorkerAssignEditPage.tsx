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
import { StyledEditBox } from "../styles/Common.styles";
import { ErrorMessage } from "../components/ErrorMessage";

export const WorkerAssignEditPage = () => {
    type ValidationErrorType = Partial<Record<keyof AssignSchema, string>>;

    const {workerId} = useParams<{workerId: string}>();
    const {farmId} = useParams<{farmId: string}>();
    const navigate = useNavigate();
    const [validationError, setValidationError] = useState<ValidationErrorType>({});    
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

    if (!workerId || !farmId) return <Alert severity="warning">Missing worker id or farm id</Alert>
    if(isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if(isError) return <Alert severity="error">{error instanceof Error ? error.message : 'An error occurred'}</Alert>;
    if(!assignWorkerData) return <Alert severity="info">No data available</Alert>;
    if (!assignWorker) return <Alert severity="info">Preparing form...</Alert>;

    const handleOnClick = () => {
        const result = assignSchema.safeParse(assignWorker);
        if(result.success){
            setValidationError({});
            updateAssignmentMutation.mutate(result.data)}
        else {
            const errors: ValidationErrorType = {};
                        for (const issue of result.error.issues) {
                            const key = issue.path[0] as keyof AssignSchema;
                            errors[key] = ErrorMessage({
                            path: [String(key)],
                            message: issue.message,
                            });
                        }
            setValidationError(errors); 
        }
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
                    onChange={
                        (e) => {
                            const value = e.target.value as AssignSchema["Role"];
                            setAssignWorker(prev => (prev ? { ...prev, Role: value } : null));
                            validateField("Role", value);
                        }
                    }
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
                    type="date"
                    name="CertifiedUntil"
                    label="Certified Until"
                    value={assignWorker.CertifiedUntil}
                    onChange={
                        (e) => {
                            const value = e.target.value;
                            setAssignWorker(prev => (prev ? { ...prev, CertifiedUntil: value } : null));
                            validateField("CertifiedUntil", value);
                        }
                    }
                    error={Boolean(validationError.CertifiedUntil)}
                    helperText={validationError.CertifiedUntil}
                    required
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
            </StyledEditBox>
        </Paper>
    </Container>
    )
}

