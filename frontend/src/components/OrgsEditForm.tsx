import { useState } from "react";
import { EditOrg } from "../apis/orgsApis";
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
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchOrgById } from "../apis/orgsApis";
import ButtonGroup from "@mui/material/ButtonGroup";
import { ErrorMessage } from "./ErrorMessage";


export function OrgsEditForm(){
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
    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const {orgId} = useParams<{orgId: string}>();
    
    const {isLoading,isError,data:orgData,error} = useQuery(['orgs',orgId],() => fetchOrgById(orgId!),{ enabled: !!orgId });
    
    const [validationError, setValidationError] = useState<ValidationErrorType>({});

        
    const [org, setOrg] = useState<OrgSchema>(() => {
        if (orgData) {
            return {
                Name: orgData.name,
                Description: orgData.description,
                Logo: orgData.logo,
            };
        }
        return {
                Name:"",
                Description: "",
                Logo: "",
        };
    });

    const editOrgMutation = useMutation(EditOrg, {
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

    if (!orgId) return <Alert severity="warning">Missing org id</Alert>
    if(isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if(isError) return <Alert severity="error">{error instanceof Error ? error.message : 'An error occurred'}</Alert>;
    if(!orgData) return <Alert severity="info">No data available</Alert>;

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
            await editOrgMutation.mutateAsync(
                {
                orgId: orgId!,
                org: org,
                }
            );
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
            setOrg(prev => ({ ...prev, Logo: base64 }))
        }



    return (
        <StyledPaper elevation={3}>
            <StyledForm onSubmit={handleSubmit}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Edit Organization
                </Typography>

                {editOrgMutation.isLoading && <CircularProgress />}

                {editOrgMutation.isError && (
                    <Alert severity="error">
                        {editOrgMutation.error instanceof Error
                            ? editOrgMutation.error.message
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
                <ButtonGroup fullWidth>
                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                            Update Organization
                        </Button>
                        <Button type="button" variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                </ButtonGroup>

        </StyledForm>
       </StyledPaper>
        )


}
