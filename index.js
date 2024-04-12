const express = require('express');

const dotenv = require('dotenv').config();
const connectDB = require('./config/db');

const adminRoutes = require('./app/routes/adminRoutes');
const userRoutes = require('./app/routes/userRoutes');

const cors = require('cors');


const fileUpload = require('express-fileupload');
const app = express();

connectDB();

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors);
app.use(fileUpload());
app.use(express.json());

app.use('/static_files', express.static('uploads'));

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/admin', userRoutes);


/// server creation ///
const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port:http://localhost:${PORT}.`);
});