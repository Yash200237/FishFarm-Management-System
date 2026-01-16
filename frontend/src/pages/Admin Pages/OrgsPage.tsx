import { useQuery } from "react-query"
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import { PageContainer, StyledContainerBar, StyledHeading, StyledHeadingBar } from '../../styles/Common.styles.ts'
import type { AxiosError } from "axios";
import type { OrgResponse } from "../../types/org.ts";
import { Avatar,Accordion,AccordionActions,AccordionSummary,AccordionDetails  } from "@mui/material";
import { fetchOrgs } from "../../apis/orgsApis.ts";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from "react";
import { SearchBar } from "../../components/SearchBar.tsx";
import { DescriptionText } from "../../styles/OrgsPage.styles.ts";

export function OrgsPage() {
  const navigate = useNavigate();
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
      <StyledHeadingBar>
        <StyledHeading variant="h4">
          Organizations
        </StyledHeading>
        <StyledContainerBar>
        <SearchBar query={query} setQuery={setQuery} />
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/orgs/create')}
        >
          Create New Organization
        </Button>
        </StyledContainerBar>
      </StyledHeadingBar>

      <Box>
      {filteredOrgs?.map((org: OrgResponse) => 
      <Accordion key ={org.orgId}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
          <StyledContainerBar>
                  <Avatar src={org.logo} alt={org.name} sx={{ width: 56, height: 56 }} />
                  <Typography variant="h6" component="h2" gutterBottom>
                    {org.name}
                  </Typography>     
          </StyledContainerBar>
        </AccordionSummary>
        <AccordionDetails>
              <DescriptionText>
                    {org.description}
              </DescriptionText>
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
