import axios from 'axios';

// const API = axios.create({ baseURL: 'http://localhost:5000/'});
const API = axios.create({ baseURL: 'https://mmcmjk9z-5000.inc1.devtunnels.ms/'});

//API call for Employee
export const getEmployees = (data) => API.get('/employees',{params:data});
export const getEmployeeById = (id) => API.get(`/employees/${id}`);
export const addEmployees = (data) => API.post('/employees',data);
export const updateEmployee = (id,data) => API.put(`/employees/${id}`,data);
export const deleteEmployee = (id) => API.delete(`/employees/${id}`);  
export const getEmployeeList = (id) => API.get(`/employees/list`);

//API call for Attendance
export const getAttendance = (date) => API.get('/attendance',{params:{date}});
export const getTodayAttendance = () => API.get('/attendance/recent');
export const addAttendance = (data) => API.post('/attendance',data);
export const updateAttendance = (data,id) => API.put(`/attendance/${id}`,data);
export const deleteAttendance = (date,id) => API.delete(`/attendance/${id}`,{params:{date}});
export const updateCheckOutAttendance = (data) => API.post('/attendance/update',data);

//API call for Report
export const getReport = (type,data) => API.get(`/report/${type}`,{params:data});

