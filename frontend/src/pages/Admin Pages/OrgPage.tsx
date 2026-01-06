import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query"
import { DeleteOrg, fetchOrgById } from "../../apis/orgsApis";
import { useNavigate } from "react-router-dom";
import {DeleteUser, GetAdminUsersByOrgId} from "../../apis/userApis.ts";
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { PageContainer, DetailCard, InfoSection, UserListItem } from './OrgPage.styles'
import { ProtectedWrapper } from "../../components/ProtectedWrapper.tsx";
import type { User } from "../../types/user.ts";
import Grid from '@mui/material/Grid';


export const OrgPage = () => {
    const {orgId} = useParams<{orgId: string}>();
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    console.log("Org ID:", orgId);
    const {isLoading,isError,data:org,error} = useQuery(['orgs',orgId],() => fetchOrgById(orgId!),{ enabled: !!orgId });
    const deleteOrgMutation = useMutation(DeleteOrg, {
      onSuccess: async() => {
        await queryClient.cancelQueries(["orgs", orgId])
        queryClient.removeQueries(["orgs", orgId])
        queryClient.invalidateQueries("orgs")
        navigate("/orgs")
      },
    })

    const {isLoading:isUsersLoading,isError:isUsersError,data:users} = useQuery<User[]>(['org_users',orgId],() => GetAdminUsersByOrgId(orgId!),
    { enabled: !!orgId });
    console.log("users value:", users)
    console.log("isArray:", Array.isArray(users))
    const removeUserMutation = useMutation((userId: string) => DeleteUser(userId), {
      onSuccess: () => {
        queryClient.invalidateQueries(['org_users', orgId])
      },
      onError: (error) => {
        console.error("Error removing user:", error);
      }
    })

    if (!orgId) return <Alert severity="warning">Missing org id</Alert>;
    if(isLoading || isUsersLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if(isError || isUsersError) return <Alert severity="error">{error instanceof Error ? error.message : 'An error occurred'}</Alert>;
    if(!org || !users) return <Alert severity="info">No data available</Alert>;

    return (
      <PageContainer>
        <Grid container spacing={3}>
          <Grid size={6}>
          <DetailCard>
          <Typography variant="h3" component="h1" gutterBottom>
            {org.name}
          </Typography>
        
          <InfoSection>
            <Typography variant="body1" color="text.secondary">
              {org.description}
            </Typography>
          </InfoSection>

          {org.logo && (
            <Box sx={{ mt: 2, mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img src={org.logo} alt={org.name} style={{ maxWidth:"300px", maxHeight:"300px", borderRadius: 8 }} />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

        <ProtectedWrapper allowedRoles={['GlobalAdmin']}>
          <ButtonGroup variant="contained" fullWidth>
            <Button 
              startIcon={<EditIcon />}
              onClick={() => navigate(`/orgs/${orgId}/edit`)}
            >
              Edit
            </Button>
            <Button 
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => deleteOrgMutation.mutate(orgId!)}
            >
              Delete
            </Button>
          </ButtonGroup>
        </ProtectedWrapper>
        </DetailCard>
          </Grid>

          <Grid size={6}>
            <DetailCard>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" gutterBottom>
            Admin Users
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mb: 2 }}
              onClick={() => navigate(`/orgs/${orgId}/users/create`)}
            >
              Add New Admin User
            </Button>
          </Box>

          
          {users.length === 0 ? (
            <Alert severity="info">No users assigned to this org</Alert>
          ) : (
            <List>
              {users.map((user:User) =>
                <UserListItem
                  key={user.userId}
                  secondaryAction={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        size="small" 
                        onClick={() => navigate(`/orgs/${orgId}/users/edit/${user.userId}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        disabled={removeUserMutation.isLoading}
                        onClick={ () =>
                          removeUserMutation.mutate(user.userId)
                        }
                      >
                        {removeUserMutation.isLoading ? "Removing..." : "Remove"}
                      </Button>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={user.name}
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                        <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                          <Chip label={user.userRole} size="small" color="primary" />
                          <Chip 
                            label={`${user.userName}`}
                            size="small" 
                          />
                        </Box>
                      </Box>
                    }
                  />
                </UserListItem>
              )}
            </List>
          )}

          <Divider sx={{ my: 3 }} />
            </DetailCard>

          </Grid>
        </Grid>
      </PageContainer>
    )
}
