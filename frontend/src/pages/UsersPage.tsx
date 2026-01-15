import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { PageContainer } from '../styles/Common.styles.ts'
import { SectionContainer } from '../styles/WorkersPage.styles.ts'
import type { AxiosError } from "axios";
import { ProtectedWrapper } from "../components/ProtectedWrapper.tsx";
import type { User } from "../types/user.ts";
import { GetUsersByOrgId } from "../apis/userApis.ts";
import { useMemo } from "react";
import { useAuth } from "../contexts/AuthProviderHook.ts";
import { useMutation, useQueryClient } from "react-query"
import { DeleteUser } from "../apis/userApis.ts";
import {Table,TableHead,TableRow,TableCell,TableBody, TableContainer, List, ListItem, ListItemText, Chip} from '@mui/material';
import Paper from '@mui/material/Paper';
import { useState } from "react";
import { DeleteAlertDialog } from "../components/DeleteAlertDialog";
import { SearchBar } from "../components/SearchBar.tsx";
import { alpha } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { StyledTableCell } from "../styles/UsersPage.styles.ts";


export function UsersPage() {
  const navigate = useNavigate();
  const theme = useTheme();
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
          <Typography variant="h4" gutterBottom sx={{backgroundColor:alpha(theme.palette.primary.main, 0.3), padding: theme.spacing(2),fontWeight: 'bold', color: theme.palette.primary.main }}>
            Admin Users
          </Typography>
          <SectionContainer>
          <List>
            {admin_users?.map((user: User) => (
              <ListItem sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: 1, mb: 1 }}
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 ,backgroundColor:alpha(theme.palette.primary.main, 0.1), padding: theme.spacing(2)}}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            Org Users
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SearchBar query={query} setQuery={setQuery} />
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => navigate(`/users/create/${orgId}`)}
              disabled={!orgId}
            >
              Create New User
            </Button>
          </Box>
      </Box>

      { filteredUsers?.length === 0 ? (
        <Alert severity="info">No users available. Please create a new user.</Alert>
      ) : (
      <TableContainer component={Paper} sx={{maxHeight: 350, mt:4}}>
            <Table aria-label="users table" stickyHeader>
              <TableHead>
                <TableRow >
                  <StyledTableCell scope="col" >Name</StyledTableCell>
                  <StyledTableCell scope="col">Email</StyledTableCell>
                  <StyledTableCell scope="col">Username</StyledTableCell>
                  <StyledTableCell scope="col" >Actions</StyledTableCell>
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
                      onClick={() => handleClickOpen(user.userId)}
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
