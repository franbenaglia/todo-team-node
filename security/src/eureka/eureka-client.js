require('dotenv').config();
const Eureka = require('eureka-js-client').Eureka;
const { PORT } = require('../constants.js');

const LOCAL_HOST = process.env.LOCAL_HOST || 'localhost';

const client = new Eureka({
    instance: {
        app: 'todoteam-sec',
        instanceId: 'tt-sec-' + PORT,
        hostName: LOCAL_HOST,
        ipAddr: '127.0.0.1',
        port: {
            '$': PORT,
            '@enabled': true,
        },
        vipAddress: 'tt-sec',
        registerWithEureka: true,
        fetchRegistry: true,
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: LOCAL_HOST,
        port: 8761,
        servicePath: '/eureka/apps/'
    },
});

module.exports = client;