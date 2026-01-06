import {z} from 'zod';

const phoneRegex = new RegExp(
  "^(?:\\+(?=(?:\\D*\\d){11}\\D*$)|(?=(?:\\D*\\d){10}\\D*$))[\\d ]+$"
);
export const workerSchema = z.object({
        Name: z.string().min(1, "Worker Name is required"),
        Age: z.number().min(1),
        Email: z.string().email("Invalid email address"),
        Picture: z.string().nullable().optional(),
        Phone: z.preprocess(
        (v) => (typeof v === "string" && v.trim() === "" ? null : v),
        z.string().regex(phoneRegex, "Invalid phone number").nullable()
        ).optional(),
});

export type WorkerSchema = z.infer<typeof workerSchema>;

export const assignSchema = z.object({
        FarmId: z.string().uuid(),
        WorkerId: z.string().uuid(),
        Role: z.enum(["CEO", "Captain", "Worker"]),
        CertifiedUntil: z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date")
            .refine((s) => {
              const today = new Date();
              const yyyy = today.getFullYear();
              const mm = String(today.getMonth() + 1).padStart(2, "0");
              const dd = String(today.getDate()).padStart(2, "0");
              const todayStr = `${yyyy}-${mm}-${dd}`;

              return s > todayStr;
            }, "Certified until must be a future date"),
});
export type AssignSchema = z.infer<typeof assignSchema>;