import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import {ModifiedCell, PageContainer, StyledContainerBar, StyledHeading, StyledHeadingBar, StyledListItem } from '../styles/Common.styles.ts'
import { SectionContainer } from '../styles/WorkersPage.styles.ts'
import type { AxiosError } from "axios";
import { ProtectedWrapper } from "../components/ProtectedWrapper.tsx";
import type { User } from "../types/user.ts";
import { GetUsersByOrgId } from "../apis/userApis.ts";
import { useMemo } from "react";
import { useAuth } from "../contexts/AuthProviderHook.ts";
import { useMutation, useQueryClient } from "react-query"
import { DeleteUser } from "../apis/userApis.ts";
import {Table,TableHead,TableRow,TableCell,TableBody, TableContainer, List, ListItemText, Chip} from '@mui/material';
import Paper from '@mui/material/Paper';
import { useState } from "react";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { SearchBar } from "../components/SearchBar.tsx";

export function UsersPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const { currentUser } = useAuth();
  const [query, setQuery] = useState("");
  const orgId = currentUser?.orgId;
  console.log("Org ID in UsersPage:", orgId);

  const [open,setOpen] = useState(false);
  const [dialogUserId, setDialogUserId] = useState<string | null>(null);
  
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

  const filteredUsers = org_users?.filter(user => {
    const name = (user.name ?? "").toLowerCase();
    const q = query.trim().toLowerCase();
    return q === "" || name.includes(q);
  });

  if (!orgId) {
  return <Alert severity="info">Loading organization...</Alert>;
}
  if(isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if(isError){
     return <Alert severity="error">{error instanceof Error ? error?.response?.status === 401 ? 'Please login to continue' : error.message : 'An error occurred'}</Alert>;
  }

  const handleClickOpen = (userId: string) => {
      setDialogUserId(userId);
      setOpen(true);
  }

  return (
    <PageContainer>
      {DeleteAlertDialog(
        open,
        "this user.?",
        () =>{
              removeUserMutation.mutate(dialogUserId!);
              setOpen(false);
        },
        () => {
          setOpen(false);
        }
      )}
      <ProtectedWrapper allowedRoles={['OrgAdmin']}>
        <StyledHeadingBar>
          <StyledHeading variant="h4">
            Admin Users
          </StyledHeading>
        </StyledHeadingBar>
          <SectionContainer>
          <List>
            {admin_users?.map((user: User) => (
              <StyledListItem
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
              </StyledListItem>
            ))}
          </List>
        </SectionContainer>
      </ProtectedWrapper>
      <StyledHeadingBar>
          <StyledHeading variant="h4">
            Org Users
          </StyledHeading>
          <StyledContainerBar>
            <SearchBar query={query} setQuery={setQuery} />
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => navigate(`/users/create/${orgId}`)}
              disabled={!orgId}
            >
              Create New User
            </Button>
          </StyledContainerBar>
      </StyledHeadingBar>

      { filteredUsers?.length === 0 ? (
        <Alert severity="info">No users available. Please create a new user.</Alert>
      ) : (
      <TableContainer component={Paper} sx={{maxHeight: 350, mt:4}}>
            <Table aria-label="users table" stickyHeader size="small">
              <TableHead>
                <TableRow >
                  <ModifiedCell scope="col" >Name</ModifiedCell>
                  <ModifiedCell scope="col">Email</ModifiedCell>
                  <ModifiedCell scope="col">Username</ModifiedCell>
                  <ModifiedCell scope="col" align="center" >Actions</ModifiedCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers?.map((user: User) => (
                  <TableRow key={user.userId}>
                    <TableCell component="th" scope="row">
                      {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>
                    <StyledContainerBar>
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
                      onClick={() => handleClickOpen(user.userId)}
                    >
                      {removeUserMutation.isLoading ? "Removing..." : "Remove"}
                    </Button>
                  </StyledContainerBar>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </TableContainer>
      )
    }

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
