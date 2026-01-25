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
import { ErrorMessage } from "./ErrorMessage";


export function UserCreateForm(userRoleProp: {value: UserRoles}){
    type FieldType = "text" | "email" | "password";
    type FieldConfig = {
            key: keyof UserSchema;
            label:string;
            type:FieldType;
    };

    const fields : FieldConfig[] = [
        {key:"Name", label:"Full Name",type:"text"},
        {key:"Email", label:"Email",type:"email"},
        {key:"UserName", label:"Username",type:"text"},
        {key:"Password", label:"Password",type:"password"},
        {key:"ConfirmPassword", label:"Confirm Password",type:"password"},
        {key:"UserRole", label:"User Role",type:"text"},
    ]

    type ValidationErrorType = Partial<Record<keyof UserSchema, string>>;

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
    const [validationError, setValidationError] = useState<ValidationErrorType>({});

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

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const key = e.target.name as keyof UserSchema;
        setUser(prev =>({
            ...prev,
            [key] : e.target.value
        }))
        validateField(key,e.target.value);
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
            value={String(User[field.key])}
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

                {fields.map(renderField)}
                
                <Button type="submit" variant="contained" fullWidth>
                    Create User
                </Button>
            </StyledForm>
        </StyledPaper>
    )
}
