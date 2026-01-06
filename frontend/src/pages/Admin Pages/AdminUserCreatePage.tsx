import { UserCreateForm } from '../../components/UserCreateForm.tsx'
import Container from '@mui/material/Container'

export const AdminUserCreatePage = () => {
  return (
    <Container maxWidth="md">
      <UserCreateForm value = {"OrgAdmin"}/>
    </Container>
  )
}

