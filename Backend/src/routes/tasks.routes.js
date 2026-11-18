import {Router} from "express";

import {
    getTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask,
    createSubTask,
    updateSubTask,
    deleteSubTask
    
} from "../controllers/task.controllers.js"

import { 
    verifyJWT, 
    validateProjectPermission,
} from "../middlewares/auth.middleware.js"
import { AvailableUserRole } from "../utils/constants.js";

const router = Router();

router.use(verifyJWT)

//project tasks

router
.route("/:projectId/tasks")
.get(validateProjectPermission(AvailableUserRole), getTasks)
.post(validateProjectPermission(AvailableUserRole), createTask)

//Individual task

router.route("/:projectId/tasks/:taskId")
.get(validateProjectPermission(AvailableUserRole), getTaskById)
.put(validateProjectPermission(AvailableUserRole), updateTask)
.delete(validateProjectPermission(AvailableUserRole), deleteTask)

//Subtasks
router.route("/:projectId/tasks/:taskId/subtasks")
.post(validateProjectPermission(AvailableUserRole), createSubTask)

router.route("/:projectId/tasks/:taskId/subtasks/:subTaskId")
.put(validateProjectPermission(AvailableUserRole), updateSubTask)
.delete(validateProjectPermission(AvailableUserRole), deleteSubTask)

export default router;
