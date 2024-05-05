require('dotenv').config();
const express = require('express');
const cors = require('cors');
const registerLogin = require('./registerLogin.js');
const datosUsuario = require('./datosUsuario.js');

const client = require('./eureka/eureka-client.js');

const { PORT } = require('./constants.js');

const LOCAL_HOST = process.env.LOCAL_HOST || 'localhost';

const app = express();

const whitelist = ['http://' + LOCAL_HOST + ':4200', 'http://' + LOCAL_HOST + ':8500', 'http://' + LOCAL_HOST + ':8080', 'undefined'];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            console.log(LOCAL_HOST);
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(express.json());

//app.use(cors(corsOptions));

app.use(cors());

app.listen(PORT, () => {
    console.log('server is listening on port ' + PORT);
});

app.use('/auth', registerLogin);

app.use('/userFullData', datosUsuario);//    /userFullData/datos/:username

client.start((error) => {
    console.log(error || 'complete');
});

client.logger.level('debug');