import { UserCreateForm } from '../components/UserCreateForm.tsx'
import Container from '@mui/material/Container'

export const UserCreatePage = () => {
  return (
    <Container maxWidth="md">
      <UserCreateForm value = {"OrgUser"}/>
    </Container>
  )
}

