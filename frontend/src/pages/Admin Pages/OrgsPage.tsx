import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { PageContainer, StyledCard } from './OrgsPage.styles.ts'
import type { AxiosError } from "axios";
import type { OrgResponse } from "../../types/org.ts";
import { Avatar, TableContainer, Paper, Table, TableBody, TableRow, TableCell } from "@mui/material";
import { fetchOrgs } from "../../apis/orgsApis.ts";

export function OrgsPage() {
  const navigate = useNavigate();
  const {isLoading,isError,data:orgs,error} = useQuery<OrgResponse[], AxiosError>('orgs',fetchOrgs);
  
  if(isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if(isError){
     return <Alert severity="error">{error instanceof Error ? error?.response?.status === 401 ? 'Please login to continue' : error.message : 'An error occurred'}</Alert>;
  }
  
  return (
    <PageContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3" component="h1">
          Organizations
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/orgs/create')}
        >
          Create New Organization
        </Button>
      </Box>

      <Box 
        sx={{ 
          display:'inline-table'
        }}
      >
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
        {orgs?.map((org: OrgResponse) => 
        <TableRow key={org.OrgId}>
          <StyledCard>
             <TableCell >
              <CardContent>
                <Box>
                  <Avatar src={org.Logo} alt={org.Name} sx={{ width: 56, height: 56 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    {org.Name}
                  </Typography>
                </Box>
              </CardContent>
              </TableCell>
              <TableCell>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/orgs/${org.OrgId}`)}>
                  View Details
                </Button>
              </CardActions>
              </TableCell>
            </StyledCard>
        </TableRow>
        )}
              </TableBody>
        </Table>
        </TableContainer>
      </Box>

      <Fab 
        color="primary" 
        aria-label="add"
        onClick={() => navigate('/orgs/create')}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
    </PageContainer>
  )
}
