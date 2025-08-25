import { Prisma, Workspace, WorkspaceMember, WorkspaceRole } from "@prisma/client";

export interface IWorkspaceRepository {
    create(workspaceData: { name: string, code: string, createdBy: string }): Promise<Workspace>;
    findById(id: string): Promise<Workspace | null>;
    findByCode(code: string): Promise<Workspace | null>;
    findByName(workspaceName: string, ownerId: string): Promise<Workspace | null>;
    addMembers(workspaceId: string, members: { userId: string, role: WorkspaceRole }[]): Promise<Prisma.BatchPayload>;
    findMember(userId: string, workspaceId: string): Promise<WorkspaceMember | null>;
    getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]>;
}