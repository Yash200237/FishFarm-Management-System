import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { PageContainer } from './OrgsPage.styles.ts'
import type { AxiosError } from "axios";
import type { OrgResponse } from "../../types/org.ts";
import { Avatar,Accordion,AccordionActions,AccordionSummary,AccordionDetails  } from "@mui/material";
import { fetchOrgs } from "../../apis/orgsApis.ts";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export function OrgsPage() {
  const navigate = useNavigate();
  const {isLoading,isError,data:orgs,error} = useQuery<OrgResponse[], AxiosError>('orgs',fetchOrgs);
  console.log(orgs);
  
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

      <Box>
      {orgs?.map((org: OrgResponse) => 
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={org.logo} alt={org.name} sx={{ width: 56, height: 56 }} />
                  <Typography variant="h5" component="h2" gutterBottom>
                    {org.name}
                  </Typography>                  
          </Box>
        </AccordionSummary>
        <AccordionDetails>
              <Typography variant="body1" component="p" gutterBottom>
                    {org.description}
                  </Typography>
        </AccordionDetails>
        <AccordionActions>
              <Button size="small" onClick={() => navigate(`/orgs/${org.orgId}`)}>
                  View Details
                </Button>
        </AccordionActions>
      </Accordion>
      )}
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
