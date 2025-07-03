const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error: ', err));

app.get('/', (req, res) => {
    res.send('Bug Tracker API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});