import { useState } from "react";
import { useMutation, useQueryClient } from "react-query"
import { CreateAdminUser, CreateUser } from "../apis/userApis";
import { useNavigate, useParams } from "react-router-dom";
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { StyledPaper, StyledForm } from '../styles/Common.styles'
import type { UserSchema } from "../schemas/userSchemas";
import type { UserRoles } from "../types/user";
import { userSchema } from "../schemas/userSchemas";


export function UserCreateForm(userRoleProp: {value: UserRoles}){
    type FieldConfig = {
            key: keyof UserSchema;
            label:string;
    }
    const fields : FieldConfig[] = [
        {key:"Name", label:"Full Name"},
        {key:"Email", label:"Email"},
        {key:"UserName", label:"Username"},
        {key:"Password", label:"Password"},
        {key:"ConfirmPassword", label:"Confirm Password"},
        {key:"UserRole", label:"User Role"},
    ]
    const {orgId} = useParams<{orgId: string}>();

    const [User, setUser] = useState<UserSchema>({
        Name: "",
        Email: "",
        Password: "",
        ConfirmPassword: "",
        UserName: "",
        UserRole: userRoleProp.value,
        OrgId: orgId!,
    })

    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const[errorMessage, setErrorMessage] = useState<string | null>(null);

    const createUserMutation = useMutation(
        userRoleProp.value === 'OrgAdmin' ? CreateAdminUser : CreateUser,
        {
            onSuccess: () => {
                queryClient.invalidateQueries("Users")
                if (userRoleProp.value === 'OrgAdmin') {
                    navigate(`/Orgs/${orgId}`)
                } else {
                    navigate(`/Users`)
                }
            },
        }
    )

    if (!orgId) return <Alert severity="warning">Missing organization id</Alert>

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const key = e.target.name as keyof UserSchema;
        setUser(prev =>({
            ...prev,
            [key] : e.target.value
        }))
    }

    const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const result = userSchema.safeParse(User);
        if(result.success){
            await createUserMutation.mutateAsync(User);
            setUser({
                Name: "",
                Email: "",
                Password: "",
                ConfirmPassword: "",
                UserName: "",
                UserRole: userRoleProp.value,
                OrgId: orgId,
            })
            setErrorMessage(null);
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

    const renderField = (field: FieldConfig) =>(
        <TextField
            key={field.key}
            type={"text"}
            name={field.key}
            label={field.label}
            value={String(User[field.key])}
            onChange={handleChangeInput}
            fullWidth
            disabled={field.key === "UserRole"}
        />
    )

    return (
        <StyledPaper elevation={3}>
            <StyledForm onSubmit={handleSubmit}>
                <Typography variant="h4" component="h2" gutterBottom>
                    {userRoleProp.value === 'OrgAdmin' ? (
                    "Create New Admin User"
                    ) : (
                        "Create New User"
                    )}
                </Typography>

                {createUserMutation.isLoading && <CircularProgress />}

                {createUserMutation.isError && (
                    <Alert severity="error">
                        {createUserMutation.error instanceof Error
                            ? createUserMutation.error.message
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
                    Create User
                </Button>
            </StyledForm>
        </StyledPaper>
    )
}
