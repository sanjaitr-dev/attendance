const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use('/employees', require('./employeeRoutes'));
app.use('/attendance', require('./attendanceRoutes'));
app.use('/',require('./reportRoutes'));

const PORT = 5000;
app.listen(PORT , () => console.log(`Server is running on port ${PORT}`));