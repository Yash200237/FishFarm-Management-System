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
import { StyledPaper, StyledForm } from '../styles/Common.styles'
import type { FarmSchema } from "../schemas/farmSchemas";
import { farmSchema } from "../schemas/farmSchemas";
import { MapComponent } from "../components/MapComponent";
import Box from "@mui/material/Box";
import { ErrorMessage } from "./ErrorMessage";

export function FarmCreateForm(){
    type FieldType = "text" | "number" | "checkbox";

    type FieldConfig = {
        key: keyof FarmSchema;
        label:string;
        type:FieldType
    }

    type ValidationErrorType = Partial<Record<keyof FarmSchema, string>>;

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
        NoOfCages: 1,
        HasBarge: false,
    })

    const round4 = (n: number) =>{
        return Math.round(n * 10000)/10000;
    }

    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const[validationError, setValidationError] = useState<ValidationErrorType>({});
    const createFarmMutation = useMutation(CreateFarm, {
        onSuccess: () => {
            queryClient.invalidateQueries("farms")
        },
    })

    const validateField = (key : keyof FarmSchema, typedValue: FarmSchema[keyof FarmSchema]) =>{
        const field = farmSchema.shape[key].safeParse(typedValue);
        if(field.success){
            setValidationError(prev => {
                const newErrors = {...prev};
                delete newErrors[key];
                return newErrors;
            });
        } else {
            setValidationError(prev => ({
                ...prev,
                [key]: ErrorMessage({path: [String(field.error.issues[0].path[0])], message: field.error.issues[0].message})
            }));
        }
    }

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const {name,type,value,checked} = e.target;
        const key = name as keyof FarmSchema;
        const typedValue = type === "checkbox"? checked 
                 : type === "number" ? key === "NoOfCages"? parseInt(value) || 1 
                                     : key === "Longitude" || key === "Latitude" ? round4(Number(value))          
                                     : Number(value) 
                 : value;
        setFarm(prev =>({
            ...prev,
            [key]:typedValue as FarmSchema[typeof key]
        }))
        validateField(key,typedValue);
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
                NoOfCages: 1,
                HasBarge: false,
            })
            setValidationError({});
            navigate("/farms");
        } else {
            setValidationError(prev => ({
                ...prev,
                [String(result.error.issues[0].path[0])]: ErrorMessage({path: [String(result.error.issues[0].path[0])], message: result.error.issues[0].message})
            }));
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
                          field.key === "NoOfCages" ? '1' : undefined
                }}
                fullWidth
                error={Boolean(validationError[field.key])}
                helperText={validationError[field.key]}

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

                {fields.map(renderField)}
                <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Select Farm Location
                </Typography>

                <MapComponent
                    latitude={farm.Latitude}
                    longitude={farm.Longitude}
                    mode="select"
                    onLocationChange={(lat, lng) => {
                    setFarm(prev => ({
                        ...prev,
                        Latitude: round4(lat),
                        Longitude: round4(lng),
                    }));
                    }}
                />
                </Box>
                
                <Button type="submit" variant="contained" fullWidth>
                    Create Farm
                </Button>
            </StyledForm>
        </StyledPaper>
    )
}
