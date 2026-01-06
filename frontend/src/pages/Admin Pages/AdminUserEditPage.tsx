import { UserEditForm } from "../../components/UserEditForm";
import Container from '@mui/material/Container'

export const AdminUserEditPage = () => {
  return (
    <Container maxWidth="md">
      <UserEditForm value = {"OrgAdmin"}/>
    </Container>
  )
}

