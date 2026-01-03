import { useState } from "react";
import { CreateOrg } from "../apis/orgsApis";
import { useMutation, useQueryClient } from "react-query"
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { StyledPaper, StyledForm } from './FarmCreateForm.styles'
import { orgSchema, type OrgSchema } from "../schemas/orgSchemas";


export function FarmCreateForm(){
    type FieldConfig = {
            key: keyof OrgSchema;
            label:string;
    }
    const fields : FieldConfig[] = [
        {key:"Name", label:"Organization Name"},
        {key:"Description", label:"Description"},
        {key:"Logo", label:"Logo"},

    ]
    const [org, setOrg] = useState<OrgSchema>({
        Name: "",
        Description:"",
        Logo: "",
    })

    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const[errorMessage, setErrorMessage] = useState<string | null>(null);

    const createOrgMutation = useMutation(CreateOrg, {
        onSuccess: () => {
            queryClient.invalidateQueries("orgs")
        },
    })

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const {name,value} = e.target;
        const key = name as keyof OrgSchema;
        setOrg(prev =>({
            ...prev,
            [key]: value
        }))
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
            setErrorMessage(null);
            navigate("/orgs");
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

                {errorMessage && (
                    <Alert severity="error">
                        {errorMessage}
                    </Alert>
                )}

                {fields.map(field => (
                    <TextField
                        key={field.key}
                        label={field.label}
                        type={"text"}
                        value={String(org[field.key])}
                        onChange={handleChangeInput}
                    fullWidth
                    />)
            )}
                <Button type="submit" variant="contained" fullWidth>
                    Create Organization
                </Button>

        </StyledForm>
       </StyledPaper>
        )


}
