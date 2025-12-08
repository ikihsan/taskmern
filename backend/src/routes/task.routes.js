const router = require('express').Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const validateRequest = require('../middleware/validateRequest');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/task.controller');
const { createTaskSchema, updateTaskSchema } = require('../validators/task.validator');

router.use(auth);

router.get('/', getTasks);
router.post('/', upload.single('attachment'), validateRequest(createTaskSchema), createTask);
router.put('/:id', upload.single('attachment'), validateRequest(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
