import { z } from "zod";

export const memberInviteSchema = z.object({
    email: z.string().email({ message: "Each invite must have a valid email address." }),
    role: z.enum(['OWNER', 'ADMIN', 'MEMBER', 'GUEST']),
});

export const createWorkspaceSchema = z.object({
    name: z.string(),
    createdBy: z.string()
});

export const addMembersSchema = z.object({
    workspaceId: z.string(),
    inviterId: z.string(),
    invites: z.array(memberInviteSchema).min(1, { message: "You must provide at least one member to invite." }),
})

export type CreateWorkspaceDTO = z.infer<typeof createWorkspaceSchema>;
export type AddMembersDTO = z.infer<typeof addMembersSchema>;