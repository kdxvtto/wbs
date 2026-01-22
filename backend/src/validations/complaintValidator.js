import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const complaintSchema = z.object({
    category : z.string().regex(objectIdRegex, "Invalid category id"),
    location : z.string().min(3, "Location must be at least 3 characters long"),
    condition : z.string().min(3, "Condition must be at least 3 characters long"),
    description : z.string().min(3, "Description must be at least 3 characters long"),
    status : z.enum(["pending", "in_progress", "completed"]).optional(),
});

export const createComplaintSchema = complaintSchema.omit({ status: true });
export const updateComplaintSchema = complaintSchema.partial();