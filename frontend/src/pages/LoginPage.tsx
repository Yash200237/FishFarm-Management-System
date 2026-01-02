import { Login } from "../components/Login"
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export const LoginPage = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Fish Farm Management System
        </Typography>
      </Box>
      <Login />
    </Container>
  )
}
