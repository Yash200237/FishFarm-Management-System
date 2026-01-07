import { useState } from "react";
import type {WorkerSchema} from "../schemas/workerSchemas";
import { useQuery,useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { EditWorker, fetchWorkerById } from "../apis/wokersApis";
import { fileToBase64, validateImageFile } from "../utils/file";
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import { workerSchema } from "../schemas/workerSchemas";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ButtonGroup from "@mui/material/ButtonGroup";

export function WorkerEditForm(){
    type FieldType = "text" | "number" | "checkbox" | "file";

    type FieldConfig = {
        key: keyof WorkerSchema;
        label:string;
        type:FieldType
    }

    const fields : FieldConfig[] = [
        {key:"Name", label:"Farm Name", type:"text"},
        {key:"Age", label:"Age", type:"number"},
        {key:"Email", label:"Email", type:"text"},
        {key:"Picture", label:"Picture", type:"file"},
        {key:"Phone", label:"Phone", type:"text"},
    ]

    const {workerId} = useParams<{workerId: string}>();
    const {isLoading,isError,data,error} = useQuery(['workers',workerId],() => fetchWorkerById(workerId!),{ enabled: !!workerId });

    const navigate = useNavigate();
    const[errorMessage, setErrorMessage] = useState<string | null>(null);

    
    const [worker, setWorker] = useState<WorkerSchema>(() => {
        if (data) {
            return {
                Name: data.name,
                Age: data.age,
                Email: data.email,
                Picture: data.picture,
                Phone: data.phone
            }
        }
        return {
            Name: "",
            Age: 0,
            Email: "",
            Picture: "",
            Phone: ""
        }
    })

    const editWorkerMutation = useMutation(EditWorker, {
        onSuccess: () => {
            navigate(`/workers/${workerId}`)
        },
    })

    if (!workerId) return <Alert severity="warning">Missing worker id</Alert>
    if(isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if(isError) return <Alert severity="error">{error instanceof Error ? error.message : 'An error occurred'}</Alert>;
    if(!data) return <Alert severity="info">No data available</Alert>;

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const {name,type,value} = e.target;
        const key = name as keyof WorkerSchema;
        setWorker(prev =>({
            ...prev,
            [key]: type === "number" ? parseInt(value) || 0 
                 : value
        }))
    }

    const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const result = workerSchema.safeParse(worker);
        if(result.success){
            editWorkerMutation.mutate({
            workerId: workerId!,
            worker: worker,
        })
        }
        else {
            if (result.error.issues[0].path[0] === "Name"){
                setErrorMessage(result.error.issues[0].message);
            }
            else{
            setErrorMessage(result.error.issues[0].path + " : " + result.error.issues[0].message);
            }
            console.error(result.error.issues);
        }
    }

    const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const err = validateImageFile(file, 2 * 1024 * 1024) // 2MB
        if (err) {
            alert(err)
            return
        }

        const base64 = await fileToBase64(file)
        setWorker(prev => ({ ...prev, Picture: base64 }))
    }

    const renderField = (field: FieldConfig) => {
        if (field.type === "file") {
            return (
                <Box key={field.key} sx={{ mb: 2 }}>
                    <Button variant="outlined" component="label" fullWidth>
                        Upload Picture
                        <input type="file" accept="image/*" onChange={handlePictureChange} hidden />
                    </Button>
                    {worker.Picture && (
                        <Box sx={{ mt: 2 }}>
                            <img
                                src={worker.Picture}
                                alt="preview"
                                style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 8 }}
                            />
                            <RemoveCircleIcon sx={{ cursor: "pointer", color: "error.main" }} onClick={() => setWorker(prev => ({ ...prev, Picture: "" }))} />

                        </Box>
                    )}
                </Box>
            );
        }

        return (
            <TextField
                key={field.key}
                type={field.type === "number" ? "number" : "text"}
                name={field.key}
                label={field.label}
                value={String(worker[field.key])}
                onChange={handleChangeInput}
                inputProps={{
                    step: field.key === "Age" ? "1" : undefined
                }}
                fullWidth
                sx={{ mb: 2 }}
            />
        );
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Edit Worker
                    </Typography>
                    {fields.map(renderField)}
                    {errorMessage && (
                        <Alert severity="error">
                            {errorMessage}
                        </Alert>
                    )}
                    <ButtonGroup fullWidth>
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                            Save Changes
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
