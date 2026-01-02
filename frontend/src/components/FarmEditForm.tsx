import { useState } from "react";
import { fileToBase64 } from "../utils/file"
import {validateImageFile} from "../utils/file"
import { useQuery,useMutation } from "react-query";
import { EditFarm, fetchFarmById } from "../apis/farmsApis";
import { useNavigate, useParams } from "react-router-dom";
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import type { FarmSchema } from "../schemas/farmSchemas";
import { farmSchema } from "../schemas/farmSchemas";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';


export function FarmEditForm(){
    type FieldType = "text" | "number" | "checkbox"| "file";

    type FieldConfig = {
        key: keyof FarmSchema ;
        label:string;
        type:FieldType
    }

    const fields : FieldConfig[] = [
        {key:"Name", label:"Farm Name", type:"text"},
        {key:"Longitude", label:"Longitude", type:"number"},
        {key:"Latitude", label:"Latitude", type:"number"},
        {key:"NoOfCages", label:"Number of Cages", type:"number"},
        {key:"HasBarge", label:"Has Barge", type:"checkbox"},
        {key: "Picture", label: "Picture", type: "file" },
        {key:"Phone", label:"Phone", type:"text"},
    ]
    const round4 = (n: number) =>{
        return Math.round(n * 10000)/10000;
    }
    
    const {farmId} = useParams<{farmId: string}>();

    const {isLoading,isError,data,error} = useQuery(['farms',farmId],() => fetchFarmById(farmId!),{ enabled: !!farmId });

    const navigate = useNavigate();

    const[errorMessage, setErrorMessage] = useState<string | null>(null);

    
    const [farm, setFarm] = useState<FarmSchema>(() => {
        if (data) {
            return {
                Name: data.name,
                Longitude: data.longitude,
                Latitude: data.latitude,
                NoOfCages: data.noOfCages,
                HasBarge: data.hasBarge,
                Picture: data.picture,
                Phone: data.phone
            };
        }
        return {
            Name: "",
            Longitude: 0,
            Latitude: 0,
            NoOfCages: 0,
            HasBarge: false,
            Picture: "",
            Phone: ""
        };
    });

    const editFarmMutation = useMutation(EditFarm, {
        onSuccess: () => {
            navigate(`/farms/${farmId}`)
        },
    })
    
    if (!farmId) return <Alert severity="warning">Missing farm id</Alert>
    if(isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if(isError) return <Alert severity="error">{error instanceof Error ? error.message : 'An error occurred'}</Alert>;
    if(!data) return <Alert severity="info">No data available</Alert>;

    const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const err = validateImageFile(file, 2 * 1024 * 1024) // 2MB
        if (err) {
            alert(err)
            return
        }
        const base64 = await fileToBase64(file)
        setFarm(prev => ({ ...prev, Picture: base64 }))
    }

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

    const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const result = farmSchema.safeParse(farm);
        if(result.success){
            await editFarmMutation.mutate({
            farmId: farmId!,
            farm: farm,
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

    const renderField = (field: FieldConfig) => {
        if (field.type === "file") {
            return (
                <Box key={field.key} sx={{ mb: 2 }}>
                    <Button variant="outlined" component="label" fullWidth>
                        Upload Picture
                        <input type="file" accept="image/*" onChange={handlePictureChange} hidden />
                    </Button>
                    {farm.Picture && (
                        <Box sx={{ mt: 2 }}>
                            <img
                                src={farm.Picture}
                                alt="preview"
                                style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 8 }}
                            />
                            <RemoveCircleIcon sx={{ cursor: "pointer", color: "error.main" }} onClick={() => setFarm(prev => ({ ...prev, Picture: "" }))} />
                        </Box>
                 )}
                </Box>
            );
        }

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
                sx={{ mb: 2 }}
            />
        );
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
                <Box component="form" onSubmit={handleSubmit}>
                    <Typography variant="h4" component="h2" gutterBottom>
                        Edit Farm
                    </Typography>
                    {fields.map(renderField)}
                    {errorMessage && (
                        <Alert severity="error">
                            {errorMessage}
                        </Alert>
                    )}
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Save Changes
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}
