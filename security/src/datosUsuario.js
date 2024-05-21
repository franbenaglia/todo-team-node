require('dotenv').config();
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

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

router.get('/datos/:username',async (req, res) => {
    
    try {

        const {username} = req.params;

        const query = 'SELECT * FROM _users WHERE name = $1;';
        const { rows } = await pool.query(query, [username]);

        res.status(200).json({ name: rows[0].name, username: rows[0].username, role: rows[0].role });

    } catch (error) {
        res.status(500).json({ error: 'Operation failed' });
    }
});

router.get('/allUsers',async (req, res) => {
    
    try {

        const query = 'SELECT * FROM _users;';
        
        const { rows } = await pool.query(query);
        
        for(let i=0; i<rows.length;i++){
             delete rows[i].password;
        }

        res.status(200).json(rows);

    } catch (error) {
        res.status(500).json({ error: 'Operation failed' });
    }
});

module.exports = router;