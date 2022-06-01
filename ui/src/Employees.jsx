import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Container } from '@mui/system';
import { Button, Typography, Modal, Box, TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import { create_employee, get_employees } from './services';
import  { tableCellClasses } from '@mui/material/TableCell';

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

function createData(
    name,
    calories,
    fat,
    carbs,
    protein,
) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export const Employee = () => {

    const [state, setState] = React.useState({
        open: false
    });

    const load_employees = () => {
        get_employees().then((employees) => {
            setState((s) => ({...s, employees}))
        });
    }

    React.useEffect(() => {

        load_employees();
        

    }, []);

    const handleClose = () => {

    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <>
            <Stack
                sx={{ pb: 4 }}
                direction="row"
                spacing={2}
                justifyContent="right"
            >
                <Button variant="contained" onClick={(e) => {
                    setState((s) => ({ ...s, open: true }));
                }}>Add Employee</Button>
            </Stack>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>NAME</StyledTableCell>
                            <StyledTableCell align="right">ID</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {state?.employees?.map((row) => (
                            <StyledTableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <StyledTableCell component="th" scope="row">
                                    {row.name}
                                </StyledTableCell>
                                <StyledTableCell align="right">{row.id}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal
                open={state?.open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Employee
                    </Typography>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField id="outlined-basic" label="Employee Name" onChange={(e) => {
                            setState((s) => ({...s, name: e.target.value}));
                        }} variant="outlined" />
                    </Box>
                    <Stack
                    sx={{pt: 2}}
                        direction="row"
                        spacing={2}
                        justifyContent="right"
                    >
                        <Button variant="contained" disabled={!state?.name} onClick={(e) => {
                            create_employee(state.name).then(() => {
                                load_employees();
                                setState((s) => ({ ...s, open: false, name: null }));
                            })
                        }}>Submit</Button>
                        <Button variant="outlined" onClick={(e) => {
                            setState((s) => ({ ...s, open: false, name: null }));
                        }}>Cancel</Button>
                    </Stack>
                </Box>
            </Modal>
        </>

    );
}
