import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Employee } from './Employees';
import { Timesheet } from './Timesheet';

const theme = createTheme();

export default function App() {

  const [tab, setTab] = React.useState('employees');

  const components = [
    {
      id: 'employees',
      component: Employee
    },
    {
      id: 'timesheets',
      component: Timesheet
    }
  ]

  const SelectedTab = components.find((component) => component.id == tab).component;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <HomeIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            Employee TimeSheet Portal
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
          }}
        >
          <Container maxWidth="sm">
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="contained" onClick={(e) => setTab('employees')}>Employees</Button>
              <Button variant="outlined" onClick={(e) => setTab('timesheets')}>TimeSheets</Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          <SelectedTab/>
        </Container>
      </main>
    </ThemeProvider>
  );
}