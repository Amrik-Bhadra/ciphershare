import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import workspaceController from "../controllers/workspace.controller";
const router = Router();

router.get('/', protect, workspaceController.getUserAllWorkspaces);
router.get('/:id', protect, workspaceController.getWorkspaceData);
router.post('/', protect, workspaceController.createWorkspace);
router.post('/add-member/:id', protect, workspaceController.addMembers);
router.delete('/:id', protect, workspaceController.deleteWorkspace);

export default router;