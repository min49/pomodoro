const express = require('express');
const router = express.Router();

const tasksController = require('../controllers/tasks.controller');

router.get('/tasks', tasksController.getTasks);
router.post('/tasks/new', tasksController.addTask);

module.exports = router;