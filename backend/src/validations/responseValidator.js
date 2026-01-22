import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const responseSchema = z.object({
    idComplaint : z.string().regex(objectIdRegex, "Invalid complaint id"),
    status : z.enum(["pending", "in_progress", "completed"]).optional(),
    progress : z.number().optional(),
    response : z.string().min(3, "Response must be at least 3 characters long"),
});

export const createResponseSchema = responseSchema;
export const updateResponseSchema = responseSchema.partial();