import { useState } from "react"
import type { LoginUserForm } from "../types/user"
import { useNavigate } from "react-router-dom"
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import { StyledPaper, StyledForm } from './Login.styles'
import { useAuth } from "../contexts/AuthProviderHook"

export const Login = () => {
  const [user, setUser] = useState<LoginUserForm>({
    EmailUsername: "",
    Password: "",
  })

  const navigate = useNavigate()
  const { handleLogin, isLoading, isError, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const data =await handleLogin(user);
      console.log(`${data}`);
      if (data.userRole === "GlobalAdmin") {
        console.log(`${data.userRole}`);
        navigate("/orgs");
      } else {
        navigate("/farms");
      }
    } catch(error) {
      console.error("Login failed:", error);
    }
  }

  return (
    <StyledPaper elevation={3}>
      <StyledForm onSubmit={handleSubmit}>
        <Typography variant="h4" component="h2" gutterBottom>
          Login
        </Typography>

        <TextField
          label="Email or Username"
          value={user.EmailUsername}
          onChange={(e) => setUser((p) => ({ ...p, EmailUsername: e.target.value }))}
          required
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          value={user.Password}
          onChange={(e) => setUser((p) => ({ ...p, Password: e.target.value }))}
          required
          fullWidth
        />

        <Button 
          type="submit" 
          variant="contained" 
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        {isError && (
          <Alert severity="error">
            {error instanceof Error
              ? error.message
              : "Login failed"}
          </Alert>
        )}
      </StyledForm>
    </StyledPaper>
  )
}
