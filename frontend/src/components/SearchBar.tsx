import SearchIcon from '@mui/icons-material/Search';
import { Search } from '../styles/SearchBar.styles';
import { SearchIconWrapper } from '../styles/SearchBar.styles';
import { StyledInputBase } from '../styles/SearchBar.styles';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
}

export const SearchBar = ({ query, setQuery }: SearchBarProps) => {
  return (
    <>
        <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
        </Search>
    </>

  )
}

