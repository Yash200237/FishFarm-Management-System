import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query"
import { EditUser, GetUsersById } from "../apis/userApis";
import { useNavigate, useParams } from "react-router-dom";
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { StyledPaper, StyledForm } from './UserCreateForm.styles'
import type { UserSchema } from "../schemas/userSchemas";
import type { UserRoles } from "../types/user";
import { userSchema } from "../schemas/userSchemas";
import Box from "@mui/material/Box";



export function UserEditForm(userRoleProp: {value: UserRoles}){
    type FieldConfig = {
            key: keyof UserSchema;
            label:string;
    }
    const fields : FieldConfig[] = [
        {key:"Name", label:"Full Name"},
        {key:"Email", label:"Email"},
        {key:"UserName", label:"Username"},
        {key:"Password", label:"New Password"},
        {key:"ConfirmPassword", label:"Confirm Password"},
        {key:"UserRole", label:"User Role"},
    ]
    const {orgId} = useParams<{orgId: string}>();
    const {userId} = useParams<{userId: string}>();

    const [user, setUser] = useState<UserSchema | null>(null);

    const {isLoading,isError,data:userData,error} = useQuery(['users',userId],() => GetUsersById(userId!),{ 
        enabled: !!orgId && !!userId,
        refetchOnMount:true,
        onSuccess: (d) => {
        setUser({
            Name: d.name ?? "",
            Email: d.email ?? "",
            Password: "",
            ConfirmPassword: "",
            UserName: d.userName ?? "",
            UserRole: userRoleProp.value as UserRoles,
            OrgId: orgId!,
        });
        }
    });

    const queryClient = useQueryClient()
    const navigate = useNavigate();
    const[errorMessage, setErrorMessage] = useState<string | null>(null);

    const editUserMutation = useMutation(EditUser,
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['users', orgId]);
                if (userRoleProp.value === 'OrgAdmin') {
                    navigate(`/Orgs/${orgId}`)
                } else {
                    navigate(`/Users`)
                }
            },
        }
    )

    if (!orgId) return <Alert severity="warning">Missing organization id</Alert>
    if(isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if(isError) return <Alert severity="error">{error instanceof Error ? error.message : 'An error occurred'}</Alert>;
    if(!userData) return <Alert severity="info">No data available</Alert>;
    if (!user) return <Alert severity="info">Preparing form...</Alert>;


    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name as keyof UserSchema;
    const value = e.target.value;

    setUser(prev => {
        if (!prev) return prev;
        return {
        ...prev,
        [key]: value,
        };
    });
    };

    const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const result = userSchema.safeParse(user);
        if(result.success){
            await editUserMutation.mutateAsync({userId: userId!, user: 
                {
                    Name: user.Name,
                    Email: user.Email,
                    PasswordHash: user.Password,
                    UserName: user.UserName,
                    UserRole: user.UserRole,
                }
            });
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
            value={String(user[field.key])}
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
                    "Update Admin User"
                    ) : (
                        "Update User"
                    )}
                </Typography>

                {editUserMutation.isLoading && <CircularProgress />}

                {editUserMutation.isError && (
                    <Alert severity="error">
                        {editUserMutation.error instanceof Error
                            ? editUserMutation.error.message
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
                    Update User
                </Button>
            </StyledForm>
        </StyledPaper>
    )
}
