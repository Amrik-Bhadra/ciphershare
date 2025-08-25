import { Prisma, Workspace, WorkspaceMember, WorkspaceRole } from "@prisma/client";
import { IWorkspaceRepository } from "../interfaces/IWorkspaceRepository";
import prisma from "../utils/prisma";

class WorkspaceRepository implements IWorkspaceRepository {
    async create(workspaceData: { name: string, code: string, createdBy: string }): Promise<Workspace> {
        return prisma.$transaction(async (tx) => {
            const workspace = await tx.workspace.create({
                data: workspaceData
            });

            await tx.workspaceMember.create({
                data: {
                    workspaceId: workspace.id,
                    userId: workspaceData.createdBy,
                    role: WorkspaceRole.OWNER
                }
            });

            return workspace;
        });
    }

    async findById(id: string): Promise<Workspace | null> {
        return await prisma.workspace.findUnique({
            where: { id },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, username: true, email: true }
                        }
                    }
                },
                channels: true
            }
        });
    }

    async findAllById(id: string): Promise<Workspace[] | null> {
        return await prisma.workspace.findMany({
            where: { createdBy: id }
        });
    }

    async findByCode(code: string): Promise<Workspace | null> {
        return await prisma.workspace.findUnique({
            where: { code }
        });
    }

    async findByName(workspaceName: string, ownerId: string): Promise<Workspace | null> {
        return await prisma.workspace.findFirst({
            where: {
                name: workspaceName,
                createdBy: ownerId
            }
        })
    }

    async addMembers(workspaceId: string, members: { userId: string, role: WorkspaceRole }[]): Promise<Prisma.BatchPayload> {
        return await prisma.workspaceMember.createMany({
            data: members.map(member => ({
                workspaceId,
                userId: member.userId,
                role: member.role
            })),
            skipDuplicates: true
        })
    }

    async findMember(userId: string, workspaceId: string): Promise<WorkspaceMember | null> {
        return await prisma.workspaceMember.findUnique({
            where: {
                userId_workspaceId: {
                    userId,
                    workspaceId
                }
            }
        });
    }

    async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
        return await prisma.workspaceMember.findMany({
            where: { workspaceId },
            include: {
                user: {
                    select: { id: true, username: true, email: true }
                }
            }
        })
    }

    async deleteById(workspaceId: string): Promise<void> {
        await prisma.workspace.delete({
            where: {
                id: workspaceId
            }
        })
    }
}

export default new WorkspaceRepository();