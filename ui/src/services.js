import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: BASE_URL
})

export const get_timesheets = (name, date) => {
    console.log(name, date);
    const params = {
        employee_id: name,
        date
    }
    return api.get('/timesheet', {
        params 
    }).then((resp) => {
        return resp.data
    }).catch(err => {
        console.log(err)
    })
}

export const create_timesheet = (work_hours, date, employee_id) => {
    return api.post('/timesheet', {
        work_hours, date, employee_id
    }).then((resp) => {
        return resp.data
    }).catch(err => {
        window.alert(err.response.data.detail)
    })
}

export const get_timesheet = (id) => {
    return api.get('/timesheet/' + id).then((resp) => {
        return resp.data
    }).catch(err => {
        console.log(err)
    })
}

export const get_employees = () => {
    return api.get('/employee').then((resp) => {
        return resp.data
    }).catch(err => {
        console.log(err)
    })
}

export const get_employee = (id) => {
    return api.get('/employee/${id}').then((resp) => {
        return resp.data
    }).catch(err => {
        console.log(err)
    })
}

export const create_employee = (name) => {
    return api.post('/employee', {
        name
    }).then((resp) => {
        return resp.data
    }).catch(err => {
        window.alert(err.response.data.detail)
    })
}