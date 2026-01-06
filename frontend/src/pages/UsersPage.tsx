import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { PageContainer } from './FarmsPage.styles'
import { SectionContainer } from './WorkersPage.styles.ts'
import type { AxiosError } from "axios";
import { ProtectedWrapper } from "../components/ProtectedWrapper.tsx";
import type { User } from "../types/user.ts";
import { GetUsersByOrgId } from "../apis/userApis.ts";
import { useMemo } from "react";
import { useAuth } from "../contexts/AuthProviderContext.tsx";
import { useMutation, useQueryClient } from "react-query"
import { DeleteUser } from "../apis/userApis.ts";
import {Table,TableHead,TableRow,TableCell,TableBody, TableContainer, List, ListItem, ListItemText, Chip} from '@mui/material';
import Paper from '@mui/material/Paper';


export function UsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const { currentUser } = useAuth();
  const orgId = currentUser?.orgId;
  console.log("Org ID in UsersPage:", orgId);
  
  const {isLoading,isError,data:users,error} = useQuery<User[], AxiosError>(['users', orgId], async () => 
    await GetUsersByOrgId(orgId!)
, { enabled: !!orgId } );

  const removeUserMutation = useMutation((userId: string) => DeleteUser(userId), {
    onSuccess: () => {
      queryClient.invalidateQueries(['users', orgId])
    },
  })
  
  const admin_users = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    return users.filter(user => user.userRole === 'OrgAdmin');
  }, [users]);

  const org_users = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    return users.filter(user => user.userRole !== 'OrgAdmin');
  }, [users]);

  if (!orgId) {
  return <Alert severity="info">Loading organization...</Alert>;
}
  if(isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if(isError){
     return <Alert severity="error">{error instanceof Error ? error?.response?.status === 401 ? 'Please login to continue' : error.message : 'An error occurred'}</Alert>;
  }

  return (
    <PageContainer>
      <ProtectedWrapper allowedRoles={['OrgAdmin']}>
          <Typography variant="h4" gutterBottom>
            Admin Users
          </Typography>
          <SectionContainer>
          <List>
            {admin_users?.map((user: User) => (
              <ListItem 
                key={user.userId}
                secondaryAction={
                <Typography color="text.secondary">
                  {user.userName}
                </Typography>
                }
              >
                <ListItemText 
                  primary={user.name}
                  secondary={
                    <>
                      <Chip label={user.email} color="warning" size="small" sx={{ mt: 0.5 }} />
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </SectionContainer>
      </ProtectedWrapper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Org Users
          </Typography>
          <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate(`/users/create/${orgId}`)}
          disabled={!orgId}
        >
          Create New User
        </Button>
      </Box>

        <TableContainer component={Paper} sx={{maxHeight: 350, mt:4}}>
            <Table aria-label="users table" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell scope="col">Name</TableCell>
                  <TableCell scope="col">Email</TableCell>
                  <TableCell scope="col">Username</TableCell>
                  <TableCell scope="col" >Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {org_users?.map((user: User) => (
                  <TableRow key={user.userId}>
                    <TableCell component="th" scope="row">
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell >
                      <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/users/${orgId}/${user.userId}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      disabled={removeUserMutation.isLoading}
                      onClick={() =>
                        removeUserMutation.mutate(user.userId)
                      }
                    >
                      {removeUserMutation.isLoading ? "Removing..." : "Remove"}
                    </Button>
                  </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </TableContainer>




      {/* <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)' 
          }, 
          gap: 3 
        }}
      >
        {users?.map((user: User) => 
          <StyledCard key={user.userId}>
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  {user.name}
                </Typography>
                <Typography color="text.secondary">
                  Cages: {user.noOfCages}
                </Typography>
                <Typography color="text.secondary">
                  Barge: {user.hasBarge ? 'Yes' : 'No'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/users/${user.userId}`)}>
                  View Details
                </Button>
              </CardActions>
            </StyledCard>
        )}
      </Box> */}

      <ProtectedWrapper allowedRoles={['OrgAdmin']}>
      <Fab 
        color="primary" 
        aria-label="add"
        onClick={() => navigate(`/users/create/${orgId}`)}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
      </ProtectedWrapper>
    </PageContainer>
  )
}
