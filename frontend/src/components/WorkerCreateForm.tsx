import { useState } from "react";
import { useMutation, useQueryClient } from "react-query"
import { CreateWorker } from "../apis/wokersApis";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { StyledPaper, StyledForm } from '../styles/Common.styles'
import type { WorkerSchema } from "../schemas/workerSchemas";
import { workerSchema } from "../schemas/workerSchemas";
import { ErrorMessage } from "./ErrorMessage";

export function WorkerCreateForm(){
    type FieldType = "text" | "number" | "checkbox";

    type FieldConfig = {
        key: keyof WorkerSchema;
        label:string;
        type:FieldType
    }
    type ValidationErrorType = Partial<Record<keyof WorkerSchema, string>>;

    const fields : FieldConfig[] = [
        {key:"Name", label:"Worker Name", type:"text"},
        {key:"Age", label:"Age", type:"number"},
        {key:"Email", label:"Email", type:"text"},
        {key:"Phone", label:"Phone", type:"text"},
    ]

    const [worker, setWorker] = useState<WorkerSchema>({
        Name: "",
        Age: 0,
        Email: "",
        Phone: "",
    })

    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const [validationError, setValidationError] = useState<ValidationErrorType>({});
    

    const createWorkerMutation = useMutation(CreateWorker, {
        onSuccess: (createdWorker) => {
            queryClient.invalidateQueries("workers")
            navigate(`/workers/${createdWorker.workerId}/assign`)

        },
    })
    const validateField = (key : keyof WorkerSchema, typedValue: WorkerSchema[keyof WorkerSchema]) =>{
        const field = workerSchema.shape[key].safeParse(typedValue);
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

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const {name,type,value} = e.target;
        const key = name as keyof WorkerSchema;
        const typedValue =type === "number" ? parseInt(value) || 0 
                 : value;
        setWorker(prev =>({
            ...prev,
            [key]: typedValue
        }))
        validateField(key, typedValue);

    }


    const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const result =workerSchema.safeParse(worker);
        if(result.success){
            await createWorkerMutation.mutateAsync(worker);
            setWorker({
                Name: "",
                Age: 1,
                Email: "",
                Phone: "",
            })
            setValidationError({});
        } else {
            const errors: ValidationErrorType = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof WorkerSchema;
                errors[key] = ErrorMessage({
                path: [String(key)],
                message: issue.message,
                });
            }
            setValidationError(errors);
        }
    }

    const renderField = (field: FieldConfig) =>(
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
            error={Boolean(validationError[field.key])}
            helperText={validationError[field.key]}
        />
    )

    return (
        <StyledPaper elevation={3}>
            <StyledForm onSubmit={handleSubmit}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Create Worker
                </Typography>

                {createWorkerMutation.isLoading && <CircularProgress />}

                {createWorkerMutation.isError && (
                    <Alert severity="error">
                        {createWorkerMutation.error instanceof Error
                            ? createWorkerMutation.error.message
                            : "An error occurred"}
                    </Alert>
                )}


                {fields.map(renderField)}
                
                <Button type="submit" variant="contained" fullWidth>
                    Create Worker
                </Button>
            </StyledForm>
        </StyledPaper>
    )
}
