import { useState } from "react";
import { CreateFarm } from "../apis/farmsApis";
import { useMutation, useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { StyledPaper, StyledForm } from './FarmCreateForm.styles'
import type { FarmSchema } from "../schemas/farmSchemas";
import { farmSchema } from "../schemas/farmSchemas";


export function FarmCreateForm(){
    type FieldType = "text" | "number" | "checkbox";

    type FieldConfig = {
        key: keyof FarmSchema;
        label:string;
        type:FieldType
    }

    const fields : FieldConfig[] = [
        {key:"Name", label:"Farm Name", type:"text"},
        {key:"Longitude", label:"Longitude", type:"number"},
        {key:"Latitude", label:"Latitude", type:"number"},
        {key:"NoOfCages", label:"Number of Cages", type:"number"},
        {key:"HasBarge", label:"Has Barge", type:"checkbox"},
    ]

    const [farm, setFarm] = useState<FarmSchema>({
        Name: "",
        Longitude: 0,
        Latitude: 0,
        NoOfCages: 0,
        HasBarge: false,
    })

    const round4 = (n: number) =>{
        return Math.round(n * 10000)/10000;
    }

    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const[errorMessage, setErrorMessage] = useState<string | null>(null);

    const createFarmMutation = useMutation(CreateFarm, {
        onSuccess: () => {
            queryClient.invalidateQueries("farms")
        },
    })

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const {name,type,value,checked} = e.target;
        const key = name as keyof FarmSchema;
        setFarm(prev =>({
            ...prev,
            [key]: type === "checkbox"? checked 
                 : type === "number" ? key === "NoOfCages"? parseInt(value) || 0 
                                     : key === "Longitude" || key === "Latitude" ? round4(Number(value))          
                                     : Number(value) 
                 : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const result = farmSchema.safeParse(farm);
        if(result.success){
            await createFarmMutation.mutateAsync(farm);
            setFarm({
                Name: "",
                Longitude: 0,
                Latitude: 0,
                NoOfCages: 0,
                HasBarge: false,
            })
            setErrorMessage(null);
            navigate("/farms");
        } else {
            if (result.error.issues[0].path[0] === "Name"){
                setErrorMessage(result.error.issues[0].message);
            }
            else{
            setErrorMessage(result.error.issues[0].path + " : " + result.error.issues[0].message);
            }
            console.error(result.error.issues);
        }
    }

    const renderField = (field: FieldConfig) => {
        if (field.type === "checkbox") {
            return (
                <FormControlLabel
                    key={field.key}
                    control={
                        <Checkbox
                            name={field.key}
                            checked={farm[field.key] as boolean}
                            onChange={handleChangeInput}
                        />
                    }
                    label={field.label}
                />
            );
        }

        return (
            <TextField
                key={field.key}
                type={field.type}
                name={field.key}
                label={field.label}
                value={String(farm[field.key])}
                onChange={handleChangeInput}
                inputProps={{
                    step: field.key === "Longitude" || field.key === "Latitude" ? "0.0001" : 
                          field.key === "NoOfCages" ? "1" : undefined
                }}
                fullWidth
            />
        );
    }

    return (
        <StyledPaper elevation={3}>
            <StyledForm onSubmit={handleSubmit}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Create Farm
                </Typography>

                {createFarmMutation.isLoading && <CircularProgress />}

                {createFarmMutation.isError && (
                    <Alert severity="error">
                        {createFarmMutation.error instanceof Error
                            ? createFarmMutation.error.message
                            : "An error occurred"}
                    </Alert>
                )}

                {errorMessage && (
                    <Alert severity="error">
                        {errorMessage}
                    </Alert>
                )}

                {fields.map(renderField)}
                
                <Button type="submit" variant="contained" fullWidth>
                    Create Farm
                </Button>
            </StyledForm>
        </StyledPaper>
    )
}
