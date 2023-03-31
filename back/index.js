const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const helmet = require('helmet')


const routes = require('./routes');
const { postJSONTrimmer } = require('./middlewares/postJSONTrimmer');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(postJSONTrimmer());
app.use(routes);


mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/first-thousand-words');

app.listen(3040, () => console.log('Server listening on on 3040...'));

module.exports = app;