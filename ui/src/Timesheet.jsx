import * as React from 'react';
import PropTypes from 'prop-types';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import { Button, Typography, Modal, Box, TextField } from '@mui/material';
import { create_timesheet, get_employees, get_timesheets } from './services';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { DesktopDatePicker } from '@mui/x-date-pickers';

const CustomToolbar = ({ setFilterButtonEl }) => (
    <GridToolbarContainer>
        <GridToolbarFilterButton ref={setFilterButtonEl} />
    </GridToolbarContainer>
);

CustomToolbar.propTypes = {
    setFilterButtonEl: PropTypes.func.isRequired,
};

export const Timesheet = () => {

    const [state, setState] = React.useState();
    const [queryOptions, setQueryOptions] = React.useState({});
    const [filterButtonEl, setFilterButtonEl] = React.useState(null);

    const load_employees = () => {
        get_employees().then((employees) => {
            setState((s) => ({ ...s, employees }))
        });
    }

    const load_timesheets = (name, date) => {
        get_timesheets(state?.employees?.find(x => x.name === name)?.id, date).then(timesheets => {
            setState((s) => ({ ...s, timesheets }))
        })
    }

    const columns = [
        {
            field: "id",
            filterable: false
        },
        {
            field: 'name',
            headerName: 'Employee Name',
            width: '250',
            filterable: true,
            valueGetter: (data) => {
                return data.row.employee.name
            }
        },
        {
            field: "work_hours",
            width: '250',
            headerName: "Work Hours",
            sortable: true,
            filterable: false
        },
        {
            field: "date",
            width: '250',
            headerName: "Date"
        }
    ]
    const onFilterChange = React.useCallback((filterModel) => {
        setQueryOptions({ filterModel: { ...filterModel } });
        const fileds = filterModel.items.reduce((obj, item) => Object.assign(obj, { [item.columnField]: item.value }), {});
        load_timesheets(fileds.name, fileds.date);
    }, []);

    const data = {
        columns,
        rows: state?.timesheets || [],
        filterMode: "server",
        onFilterModelChange: onFilterChange
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

    const handleChange = (event) => {
        setState((s) => ({ ...s, employee_id: event.target.value }));
    };

    React.useEffect(() => {
        load_employees();
        load_timesheets();
    }, []);

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
                }}>Add TimeSheet</Button>
            </Stack>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid {...data} components={{
                    Toolbar: CustomToolbar,
                }}
                    componentsProps={{
                        panel: {
                            anchorEl: filterButtonEl,
                        },
                        toolbar: {
                            setFilterButtonEl,
                        },
                    }} />
            </div>

            <Modal
                open={state?.open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Timesheet
                    </Typography>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Employee</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={state?.age}
                                label="Age"
                                onChange={handleChange}
                            >
                                {state?.employees?.map(x => <MenuItem value={x.id}>{x.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <TextField id="outlined-basic" label="Work hours" onChange={(e) => {
                            setState((s) => ({ ...s, work_hours: e.target.value }));
                        }} variant="outlined" />
                        <DesktopDatePicker
                            label="Select Date"
                            inputFormat="yyyy-MM-DD"
                            value={state?.date}
                            onChange={(val) => {
                                setState((s) => ({ ...s, date: val }));
                                console.log(val.format('YYYY-MM-DD'));
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </Box>
                    <Stack
                        sx={{ pt: 2 }}
                        direction="row"
                        spacing={2}
                        justifyContent="right"
                    >
                        <Button variant="contained" disabled={!state?.employee_id || !state.date || !state.work_hours} onClick={(e) => {
                            create_timesheet(state.work_hours, state.date.format('YYYY-MM-DD'), state.employee_id).then(() => {
                                load_employees();
                                load_timesheets();
                                setState((s) => ({ ...s, open: false, name: null }));
                            })
                        }}>Submit</Button>
                        <Button variant="outlined" onClick={(e) => {
                            setState((s) => ({ ...s, open: false, employee_id: null, date: null, work_hours: null }));
                        }}>Cancel</Button>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
}
