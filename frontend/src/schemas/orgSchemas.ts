import {z} from 'zod';

export const orgSchema = z.object({
        Name: z.string().min(1, "Org Name is required"),
        Description: z.string().min(1, "Description is required"),
        Logo: z.string().optional(),
});

export type OrgSchema = z.infer<typeof orgSchema>;