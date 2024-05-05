require('dotenv').config();
const { Pool } = require('pg');
const uuid = require('uuid');
const fs = require('fs');
const { getPorts } = require('../eureka/eureka-client.js');
const axios = require('axios');
const { jwtDecode } = require("jwt-decode");

const LOCAL_HOST = process.env.LOCAL_HOST || 'localhost';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'password';
const DB_NAME = process.env.DB_NAME || 'tasks';
const DB_PORT = process.env.DB_PORT || 5432;

const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
});

const status = (request, response) => {
    const status = {
        'Status': 'Running'
    };

    response.send(status);
};


const postTask = async (req, res) => {

    const { title, dir, description } = req.body;

    if (!title || !dir || !description) {
        return res.status(400).send('One of the dir, or title, or description is missing in the data');
    }

    try {

        const queryTaskSequence = "select nextval('tasks_seq');";
        const newTaskId = await pool.query(queryTaskSequence);
        const insertTask = `
        INSERT INTO tasks (title, dir, description,id)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
        `;
        const taskId = newTaskId.rows[0].nextval;
        const taskValues = [title, dir, description, taskId];
        const task = await pool.query(insertTask, taskValues);

        res.status(200).send({ message: 'New Task created', id: task.rows[0].id });
    } catch (err) {
        console.error(err);
        res.status(500).send('some error has occured');
    }
};

//https://stackoverflow.com/questions/76829274/how-to-send-and-receive-bytea-images-with-postgresql-node-pg-and-expressjs
//en la url sube una imagen con formato de buffer (el de defecto de fs.readFileSync) a una psotgres
//con un campo inagen bytea, el de la base creada por mi es oid
const postImage = async (req, res) => {

    const { avatar, id } = req.body;

    const files = req.files;

    if (!avatar) {
        return res.status(400).send('No files or images');
    }

    try {

        const uuidIden = uuid.v4();
        const dataImagePrefix = 'data:' + files.avatar.type + ';base64, ';

        const insertFile = `
          INSERT INTO files (id_task, data, file_name, file_type,  id)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id;
         `;

        const dataAsBuffer = fs.readFileSync(files.avatar.path); //, { encoding: "utf-8" }
        console.log(dataAsBuffer);
        //const dataAslob = new Blob(dataAsBuffer);
        const dataAsBase64 = dataImagePrefix + dataAsBuffer.toString('base64');
        console.log(dataAsBase64);
        const fileValues = [id, dataAsBase64, files.avatar.originalFilename, files.avatar.type, uuidIden];
        const file = await pool.query(insertFile, fileValues);

        res.status(200).send({ message: 'New File created', uuidIden: uuidIden });
    } catch (err) {
        console.error(err);
        res.status(500).send('some error has occured');
    }
};



const getAllTasks = async (req, res) => {
    try {
        const query = 'SELECT * FROM tasks;';
        const { rows } = await pool.query(query);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('failed');
    }
};

const getTasksPaginated = async (req, res) => {
    try {
        const { pageNumber, pageSize } = req.params;
        const offset = (pageNumber * pageSize) + 1;
        const query = 'SELECT * FROM tasks ORDER BY id LIMIT '
            + pageSize + ' OFFSET ' + offset + ';';
        const queryT = 'SELECT * FROM tasks;';
        const { rows } = await pool.query(query);
        const rowsc = await pool.query(queryT);
        const taskResponse = { tasks: rows, totalRecords: rowsc.rowCount };
        res.status(200).json(taskResponse);
    } catch (err) {
        console.error(err);
        res.status(500).send('failed');
    }
};

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM tasks WHERE id = $1;';
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).send('this task is not in the database');
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('failed');
    }
};

const getTaskImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM files WHERE id_task = $1;';
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).send('this file or image is not in the database');
        }
        res.setHeader('content-type', 'image/png');
        res.send(rows[0].data);
        //res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('failed');
    }
};

const updateTask = async (req, res) => {
    try {
        //const { id } = req.params;
        const { id, title, dir, description } = req.body;

        if (!title && !dir && !description) {
            return res.status(400).send('provide a field (title, dir, or description)');
        }

        const query = `
       UPDATE tasks
       SET title = COALESCE($1, title),
           dir = COALESCE($2, dir),
           description = COALESCE($3, description)
       WHERE id = $4
       RETURNING *;
     `;
        const { rows } = await pool.query(query, [title, dir, description, id]);

        if (rows.length === 0) {
            return res.status(404).send('Cannot find anything');
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Some error has occured failed');
    }
};

const taskDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *;';
        const { rows } = await pool.query(query, [id]);

        if (rows.length === 0) {
            return res.status(404).send('we have not found the task');
        }

        res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('some error has occured');
    }
};

const getFullUser = async (req, res) => {

    try {

        let ports = getPorts();

        const header = req.header('Authorization');
        const token = header.split(" ")[1];
        const user = jwtDecode(token);
        const { data } = await axios({
            url: 'http://' + LOCAL_HOST + ':' + ports[0] + '/userFullData/datos/' + user.username,
            method: 'get',
            params: {
            },
        });

        console.log(data);

        res.status(200).json(data);

    } catch (error) {

        console.log(error);

    }

    return "";

}



module.exports = {
    status,
    postTask,
    postImage,
    getAllTasks,
    getTaskById,
    getTaskImageById,
    getTasksPaginated,
    updateTask,
    taskDelete,
    getFullUser
}
