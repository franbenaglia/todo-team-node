//https://dvmhn07.medium.com/jwt-authentication-in-node-js-a-practical-guide-c8ab1b432a49
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); //password encrypt in db
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const {SECRET_KEY}= require('./constants.js');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
const DB_NAME = process.env.DB_NAME || 'test_jwt';
const DB_PORT = process.env.DB_PORT || 5432;

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
});

router.post('/register', async (req, res) => {
    try {
        const { userName, password } = req.body;
        const name = userName;
        const roles = '["ROLE_CUSTOMER"]';
        const hashedPassword = await bcrypt.hash(password, 10); //deault strength 10 backspring
        const querySequence = "select nextval('_users_seq');";
        const query = `
        INSERT INTO _users (id, username, password, name, roles)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;
         
         const newId = await pool.query(querySequence);
         const values = [newId.rows[0].nextval, userName, hashedPassword, name, roles];
         const result = await pool.query(query, values);
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});


router.post('/authenticate', async (req, res) => {
    try {
        const { userName, password } = req.body; 
        const query = 'SELECT * FROM _users WHERE name = $1;';
        const { rows } = await pool.query(query, [userName]);

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Authentication failed, user not registered' });
        }

        const passwordMatch = await bcrypt.compare(password, rows[0].password);
        
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed, wrong password' });
        }

        const token = jwt.sign({ userId: rows[0].id, username: rows[0].username, role: rows[0].role },  process.env.SECRET_KEY || SECRET_KEY, {
            expiresIn: '1h',
        });

        res.status(200).json({ jwt: token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Login failed: ' + error});
    }
});


module.exports = router;