import { z } from "zod";

const safeRegexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const safeRegexUsername = /^[a-zA-Z0-9._-]+$/;

export const registerUserSchema = z.object({
    nik: z.string().min(16, "NIK must be at least 16 characters long").optional(),
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().regex(safeRegexEmail, "Invalid email address").optional(), // Optional - untuk user/nasabah
    password: z.string().min(6, "Password must be at least 6 characters long"),
    phone: z.string().min(10, "Phone number must be at least 10 characters long").optional(),
    role: z.enum(["Pimpinan", "Staf", "Nasabah"]),
});

export const registerAdminSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    username: z.string().regex(safeRegexUsername, "Invalid username").min(3, "Username must be at least 3 characters long").optional(), // Optional - untuk admin
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["Admin", "Pimpinan", "Staf"]),
});

// Admin login menggunakan username
export const adminLoginSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// User login menggunakan email
export const userLoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Change password schema
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(6, "Current password must be at least 6 characters long"),
    newPassword: z.string().min(6, "New password must be at least 6 characters long"),
});
