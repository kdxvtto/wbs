import { z } from "zod";

const safeRegexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const safeRegexUsername = /^[a-zA-Z0-9._-]+$/;

const userSchema = z.object({
        nik: z.string().min(16, "NIK must be at least 16 characters long").optional(),
        name: z.string().min(3, "Name must be at least 3 characters long"),
        username: z.string().regex(safeRegexUsername, "Invalid username").min(3, "Username must be at least 3 characters long").optional(), // Optional - untuk admin
        email: z.string().regex(safeRegexEmail, "Invalid email address").optional(), // Optional - untuk user/nasabah
        password: z.string().min(6, "Password must be at least 6 characters long"),
        phone: z.string().min(10, "Phone number must be at least 10 characters long").optional(),
        role: z.enum(["Admin", "Pimpinan", "Staf", "Nasabah"]).optional().default("Nasabah"),
});

export const createUserSchema = userSchema;
export const updateUserSchema = userSchema.partial();