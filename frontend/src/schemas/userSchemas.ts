import {z} from 'zod';

export const userSchema = z.object({
        Name: z.string().min(1, "User Name is required"),
        Email: z.string().email("Invalid email address"),
        Password: z.string().min(6, "Password must be at least 6 characters long")      ,
        ConfirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters long"),
        UserName: z.string().min(1, "Username is required"),
        UserRole: z.enum(["GlobalAdmin", "OrgAdmin", "OrgUser"]),
        OrgId: z.string().uuid(),
})
.refine((data) => data.Password === data.ConfirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

  export type UserSchema = z.infer<typeof userSchema>;

  export const userEditSchema = z.object({
        Name: z.string().min(1, "User Name is required"),
        Email: z.string().email("Invalid email address"),
        Password: z.preprocess((v) =>( typeof v === "string" && v.trim() === "" ? null : v), z.string().min(6, "Password must be at least 6 characters long").nullable()),
        ConfirmPassword: z.preprocess((v) =>( typeof v === "string" && v.trim() === "" ? null : v), z.string().min(6, "Confirm Password must be at least 6 characters long").nullable()),
        UserName: z.string().min(1, "Username is required"),
        UserRole: z.enum(["GlobalAdmin", "OrgAdmin", "OrgUser"]),
})
.refine((data) => data.Password === data.ConfirmPassword, {
    message: "Passwords don't match",
    path: ["ConfirmPassword"], // path of error
  });

export type UserEditSchema = z.infer<typeof userEditSchema>;


