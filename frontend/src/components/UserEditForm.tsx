import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query"
import { EditUser, GetUsersById } from "../apis/userApis";
import { useNavigate, useParams } from "react-router-dom";
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { StyledPaper, StyledForm } from '../styles/Common.styles'
import type { UserSchema } from "../schemas/userSchemas";
import type { UserRoles } from "../types/user";
import { userEditSchema, userSchema } from "../schemas/userSchemas";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import type { EditUserForm } from "../types/user";
import { ErrorMessage } from "./ErrorMessage";



export function UserEditForm(userRoleProp: {value: UserRoles}){
    type FieldType = "text" | "email" | "password";

    type FieldConfig = {
            key: keyof UserSchema;
            label:string;
            type:FieldType;
            
    }

    type ValidationErrorType = Partial<Record<keyof UserSchema, string>>;
    
    const fields : FieldConfig[] = [
        {key:"Name", label:"Full Name",type:"text"},
        {key:"Email", label:"Email",type:"email"},
        {key:"UserName", label:"Username",type:"text"},
        {key:"Password", label:"New Password",type:"password"},
        {key:"ConfirmPassword", label:"Confirm Password",type:"password"},
        {key:"UserRole", label:"User Role",type:"text"},
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
    const [validationError, setValidationError] = useState<ValidationErrorType>({});

    const editUserMutation = useMutation(EditUser,
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['users', userId]);
                if (userRoleProp.value === 'OrgAdmin') {
                    navigate(`/Orgs/${orgId}`)
                } else {
                    navigate(`/Users`)
                }
            },
        }
    )

    const validateField = (key : keyof UserSchema, typedValue: UserSchema[keyof UserSchema]) =>{
        const field = userSchema.shape[key].safeParse(typedValue);
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
        validateField(key, value);
    };

    const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const result = userEditSchema.safeParse(user);
        if(result.success){
            const parsed = result.data;
            const userPayload: EditUserForm = {
                Name: parsed.Name,
                Email: parsed.Email,
                UserName: parsed.UserName,
                UserRole: parsed.UserRole,
            };
            if (parsed.Password) {
                userPayload.PasswordHash = parsed.Password;
            }
            await editUserMutation.mutateAsync({userId: userId!, user: userPayload});
            setUser({
                Name: "",
                Email: "",
                Password: "",
                ConfirmPassword: "",
                UserName: "",
                UserRole: userRoleProp.value,
                OrgId: orgId,
            })
            setValidationError({});
        } else {
            const errors: ValidationErrorType = {};
            for (const issue of result.error.issues) {
                const key = issue.path[0] as keyof UserSchema;
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
            type={field.type}
            name={field.key}
            label={field.label}
            value={((user[field.key])??"")as string}
            onChange={handleChangeInput}
            fullWidth
            disabled={field.key === "UserRole"}
            error={Boolean(validationError[field.key])}
            helperText={validationError[field.key]}
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

                {fields.map(renderField)}
                
                <ButtonGroup fullWidth>
                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                        Update User
                    </Button>
                    <Button type="button" variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate(-1)}>
                        Cancel
                    </Button>
                </ButtonGroup>
            </StyledForm>
        </StyledPaper>
    )
}
