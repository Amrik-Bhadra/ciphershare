import { IRequestWithUser } from "../middlewares/auth.middleware";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { AddMembersDTO, CreateWorkspaceDTO, memberInviteSchema } from "../dtos/workspace.dto";
import workspaceServices from "../services/workspace.services";

class WorkspaceController {
    async createWorkspace(req: IRequestWithUser, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            if (!userId) {
                throw new AppError('Authentication Error: User Id not found!', 401);
            }

            const { name } = req.body;
            if (!name) {
                throw new AppError('Workspace name is required.', 400);
            }

            const workspaceData: CreateWorkspaceDTO = {
                name,
                createdBy: userId
            }
            const newWorkspace = await workspaceServices.createWorkspace(workspaceData);
            res.status(201).json({
                message: 'Workspace Created Successfuly!',
                data: newWorkspace
            })

        } catch (error) {
            next(error);
        }
    }

    async getWorkspaceData(req: IRequestWithUser, res: Response, next: NextFunction) {
        try {
            const workspaceId = req.params.id;
            const userId = req.user!.id;

            if (!userId) {
                throw new AppError('Authentication error: User ID not found.', 401);
            }

            // fetch workspace data
            const workspace = await workspaceServices.findWorkspaceById(workspaceId);
            const isMember = workspace?.createdBy === userId;
            if (!isMember) {
                throw new AppError("You are not authorized to view this workspace.", 403);
            }

            res.status(200).json({
                success: true,
                data: workspace,
            });
        } catch (error) {
            next(error);
        }
    }

    async getUserAllWorkspaces(req: IRequestWithUser, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id;
            if (!userId) {
                throw new AppError('Authentication error: User ID not found.', 401);
            }

            const workspaces = await workspaceServices.getUserWorkspaces(userId);
            res.status(200).json({
                message: 'Workspaces Found!',
                data: workspaces
            });
        } catch (error) {
            next(error)
        }
    }

    async addMembers(req: IRequestWithUser, res: Response, next: NextFunction) {
        try {
            const inviterId = req.user!.id;
            if (!inviterId) {
                return res.status(401).json({ message: 'Authentication error: User ID not found' })
            }

            const addMembersData: AddMembersDTO = {
                workspaceId: req.params.id,
                inviterId: inviterId,
                invites: req.body.invites,
            };

            const result = await workspaceServices.addMembers(addMembersData);
            res.status(200).json({
                message: `${result.count} new member(s) have been added successfully.`,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async deleteWorkspace(req: IRequestWithUser, res: Response, next: NextFunction) {
        try {
            const workspaceId = req.params.id;
            const userId = req.user!.id;

            await workspaceServices.deleteWorkspaceById(workspaceId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new WorkspaceController();