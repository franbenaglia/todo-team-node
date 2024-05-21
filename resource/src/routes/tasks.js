const express = require('express');
const router = express.Router();
const verifyToken = require('../security/filterJwt.js');

const {
    status,
    postTask,
    postImage,
    getAllTasks,
    getTaskById,
    getTaskImageById,
    getTasksPaginated,
    getFullUser,
    updateTask,
    taskDelete,
    changeState,
    changeUser,
    getTasksByState,
    getAllUsers,
} = require('../controllers/tasks.js');

router.get('/status', status);

router.post('/task', verifyToken, postTask);

router.post('/files/taskImage', verifyToken, postImage); // /api/task/files/taskImage

router.get('/tasks', verifyToken, getAllTasks);

router.get('/task/:id', verifyToken, getTaskById);

router.get('/files/downloadImageAsResourceByIdTask/:id', verifyToken, getTaskImageById); 
// /files/downloadImageAsResourceByIdTask/

router.get('/tasks/:pageNumber/:pageSize', verifyToken, getTasksPaginated);

router.put('/task', verifyToken, updateTask);

router.delete('/task/:id', verifyToken, taskDelete);

router.get('/fullUser', verifyToken, getFullUser);

router.get('/allUsers', verifyToken, getAllUsers);

router.put('/changeStateTask/:id/:state', verifyToken, changeState);

router.put('/changeUserTask/:id/:user', verifyToken, changeUser);

router.get('/tasksByState/:state/:user', verifyToken, getTasksByState);

module.exports = router;
