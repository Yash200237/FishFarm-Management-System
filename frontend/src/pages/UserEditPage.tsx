import { UserEditForm } from "../components/UserEditForm";
import Container from '@mui/material/Container'

export const UserEditPage = () => {
  return (
    <Container maxWidth="md">
      <UserEditForm value = {"OrgUser"}/>
    </Container>
  )
}

