import {z} from 'zod';

const phoneRegex = new RegExp(
  "^(?:\\+(?=(?:\\D*\\d){11}\\D*$)|(?=(?:\\D*\\d){10}\\D*$))[\\d ]+$"
);
export const farmSchema = z.object({
        Name: z.string().min(1, "Farm Name is required"),
        Longitude: z.number().min(-180).max(180),
        Latitude: z.number().min(-90).max(90),
        NoOfCages: z.number().min(1),
        HasBarge: z.boolean(),
        Picture: z.string().optional(),
        Phone: z.preprocess(
        (v) => (typeof v === "string" && v.trim() === "" ? null : v),
        z.string().regex(phoneRegex, "Invalid phone number").nullable()
        ).optional(),
});

export type FarmSchema = z.infer<typeof farmSchema>;