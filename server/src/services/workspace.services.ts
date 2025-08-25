import { User, Workspace, WorkspaceRole } from "@prisma/client";
import { AddMembersDTO, CreateWorkspaceDTO } from "../dtos/workspace.dto";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IWorkspaceRepository } from "../interfaces/IWorkspaceRepository";
import workspaceRepository from "../repositories/workspace.repository";
import { AppError } from "../utils/AppError";
import userRepository from "../repositories/user.repository";

const generateWorkspaceCode = (): string => {
    const part1 = Math.floor(100 + Math.random() * 900);
    const part2 = Math.floor(100 + Math.random() * 900);
    const part3 = Math.floor(100 + Math.random() * 900);
    return `${part1}-${part2}-${part3}`;
};

class WorkspaceService {
    constructor(
        private workspaceRepository: IWorkspaceRepository,
        private userRepository: IUserRepository
    ) { }

    async createWorkspace(workspaceData: CreateWorkspaceDTO) {
        const { name, createdBy } = workspaceData;

        const existingWorkspace = await workspaceRepository.findByName(name, createdBy);
        if (existingWorkspace) {
            throw new Error("You already own a workspace with this name.");
        }
        let code: string;
        let isCodeUnique = false;
        do {
            code = generateWorkspaceCode();
            const workspaceWithCode = await workspaceRepository.findByCode(code);
            if (!workspaceWithCode) {
                isCodeUnique = true;
            }
        } while (!isCodeUnique);

        return await workspaceRepository.create({ name, code, createdBy });
    }

    async findWorkspaceById(id: string): Promise<Workspace> {
        const workspaceData = await this.workspaceRepository.findById(id);
        if (!workspaceData) {
            throw new AppError("Workspace not found.", 404);
        };
        return workspaceData;
    }

    async addMembers(addMembersData: AddMembersDTO): Promise<{ count: number }> {
        const { workspaceId, inviterId, invites } = addMembersData;

        const workspace = await this.workspaceRepository.findById(workspaceId);
        if (!workspace) {
            throw new AppError("Workspace not found.", 404);
        }

        const inviterMembership = await this.workspaceRepository.findMember(inviterId, workspaceId);

        const allowedRoles: WorkspaceRole[] = [WorkspaceRole.ADMIN, WorkspaceRole.OWNER];
        if (!inviterMembership || !allowedRoles.includes(inviterMembership.role)) {
            throw new AppError("You do not have permission to add members to this workspace.", 403);
        }

        // 3. Extract emails from the invites array to find the users
        const emailsToFind = invites.map(invite => invite.email);
        const usersToAdd = await userRepository.findByEmails(emailsToFind);

        if (usersToAdd.length === 0) {
            throw new AppError("No valid users found with the provided emails.", 404);
        }

        // Create a map of email -> role for easy lookup
        const roleMap = new Map(invites.map(i => [i.email, i.role]));

        // 4. Filter out users who are already members
        const existingMembers = await this.workspaceRepository.getWorkspaceMembers(workspaceId);
        const existingMemberUserIds = new Set(existingMembers.map(member => member.userId));

        const newMembers = usersToAdd
            .filter((user: User) => !existingMemberUserIds.has(user.id))
            .map((user: User) => ({
                userId: user.id,
                // Assign the role from our map, defaulting to MEMBER if something goes wrong
                role: roleMap.get(user.email) || WorkspaceRole.MEMBER
            }));

        if (newMembers.length === 0) {
            throw new AppError("All specified users are already members of this workspace.", 409);
        }

        // 5. Add the new members to the workspace
        const result = await this.workspaceRepository.addMembers(workspaceId, newMembers);

        return { count: result.count };
    }

    async getUserWorkspaces(userId:string){
        const workspaces = await workspaceRepository.findAllById(userId);
        console.log('workspaces:', workspaces);
        if(workspaces?.length === 0) return [];
        else return workspaces;
    }

    async deleteWorkspaceById(workspaceId: string){
        await workspaceRepository.deleteById(workspaceId);
    }
}

export default new WorkspaceService(workspaceRepository, userRepository);