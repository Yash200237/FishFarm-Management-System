import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { PageContainer } from '../../styles/Common.styles.ts'
import type { AxiosError } from "axios";
import type { OrgResponse } from "../../types/org.ts";
import { Avatar,Accordion,AccordionActions,AccordionSummary,AccordionDetails, alpha, useTheme  } from "@mui/material";
import { fetchOrgs } from "../../apis/orgsApis.ts";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";
import { SearchBar } from "../../components/SearchBar.tsx";

export function OrgsPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const {isLoading,isError,data:orgs,error} = useQuery<OrgResponse[], AxiosError>('orgs',fetchOrgs);
  const filteredOrgs = orgs?.filter(org => {
    const name = (org.name ?? "").toLowerCase();
    const q = query.trim().toLowerCase();
    return q === "" || name.includes(q);
  });
  
  if(isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if(isError){
     return <Alert severity="error">{error instanceof Error ? error?.response?.status === 401 ? 'Please login to continue' : error.message : 'An error occurred'}</Alert>;
  }
  
  return (
    <PageContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, backgroundColor:alpha(theme.palette.primary.main, 0.3), padding: theme.spacing(2)  }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
          Organizations
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <SearchBar query={query} setQuery={setQuery} />
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/orgs/create')}
        >
          Create New Organization
        </Button>
        </Box>
      </Box>

      <Box>
      {filteredOrgs?.map((org: OrgResponse) => 
      <Accordion key ={org.orgId}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar src={org.logo} alt={org.name} sx={{ width: 56, height: 56 }} />
                  <Typography variant="h6" component="h2" gutterBottom>
                    {org.name}
                  </Typography>     
          </Box>
        </AccordionSummary>
        <AccordionDetails>
              <Typography variant="body1" component="p" sx={{padding:2, backgroundColor: alpha(theme.palette.primary.main, 0.1) }} >
                    {org.description}
                  </Typography>
        </AccordionDetails>
        <AccordionActions sx={{marginRight:2, marginBottom:1}}>
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
