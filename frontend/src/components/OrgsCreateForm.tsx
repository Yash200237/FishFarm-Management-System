import { useState } from "react";
import { CreateOrg } from "../apis/orgsApis";
import { useMutation, useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { StyledPaper, StyledForm } from '../styles/Common.styles'
import { orgSchema, type OrgSchema } from "../schemas/orgSchemas";
import { fileToBase64, validateImageFile } from "../utils/file";
import { ErrorMessage} from "./ErrorMessage";


export function OrgsCreateForm(){
    type FieldConfig = {
            key: keyof OrgSchema;
            label:string;
            type: string;
    }

    type ValidationErrorType = Partial<Record<keyof OrgSchema, string>>;
        

    const fields : FieldConfig[] = [
        {key:"Name", label:"Organization Name",type:"text"},
        {key:"Description", label:"Description",type:"text"},
        {key:"Logo", label:"Logo",type:"file"},

    ]
    const [org, setOrg] = useState<OrgSchema>({
        Name: "",
        Description:"",
        Logo: "",
    })

    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const [validationError, setValidationError] = useState<ValidationErrorType>({});


    const createOrgMutation = useMutation(CreateOrg, {
        onSuccess: () => {
            queryClient.invalidateQueries("orgs")
            navigate("/orgs");
        },
    })
    const validateField = (key : keyof OrgSchema, value: OrgSchema[keyof OrgSchema]) =>{
        const field = orgSchema.shape[key].safeParse(value);
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
        const {name,value} = e.target;
        const key = name as keyof OrgSchema;
        setOrg(prev =>({
            ...prev,
            [key]: value
        }))

        validateField(key,value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const result = orgSchema.safeParse(org);
        if(result.success){
            await createOrgMutation.mutateAsync(org);
            setOrg({
                Name: "",
                Description:"",
                Logo: "",
            })
            setValidationError({});
            navigate("/orgs");
        } else {
            setValidationError(prev => ({
                ...prev,
                [String(result.error.issues[0].path[0])]: ErrorMessage({path: [String(result.error.issues[0].path[0])], message: result.error.issues[0].message})
            }));

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
            console.log(base64)
            setOrg(prev => ({ ...prev, Logo: base64 }))
        }



    return (
        <StyledPaper elevation={3}>
            <StyledForm onSubmit={handleSubmit}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Create Organization
                </Typography>

                {createOrgMutation.isLoading && <CircularProgress />}

                {createOrgMutation.isError && (
                    <Alert severity="error">
                        {createOrgMutation.error instanceof Error
                            ? createOrgMutation.error.message
                            : "An error occurred"}
                    </Alert>
                )}

                {fields.map(field => {
                        if (field.type === "file") {
                            return <Box key={field.key} sx={{ mb: 2 }}>
                                <Button variant="outlined" component="label" fullWidth>
                                    Upload Logo
                                    <input type="file" accept="image/*" onChange={handlePictureChange} hidden />
                                </Button>
                                {org.Logo && (
                                    <Box sx={{ mt: 2 }}>
                                        <img
                                            src={org.Logo}
                                            alt="preview"
                                            style={{ width: 140, height: 140, objectFit: "cover", borderRadius: 8 }}
                                        />
                                        <RemoveCircleIcon sx={{ cursor: "pointer", color: "error.main" }} onClick={() => setOrg(prev => ({ ...prev, Logo: "" }))} />
                                    </Box>
                                )}
                            </Box>
                    }
                    else {
                    return <TextField
                        key={field.key}
                        name={field.key}
                        label={field.label}
                        type={field.type}
                        value={String(org[field.key])}
                        onChange={handleChangeInput}
                    fullWidth
                    error={Boolean(validationError[field.key])}
                    helperText={validationError[field.key]}
                    />
                    }
                })          
                }
                <Button type="submit" variant="contained" fullWidth>
                    Create Organization
                </Button>

        </StyledForm>
       </StyledPaper>
        )


}
