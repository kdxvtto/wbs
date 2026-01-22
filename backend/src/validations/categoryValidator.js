import { z } from "zod";

const categorySchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
});

export const createCategorySchema = categorySchema;
export const updateCategorySchema = categorySchema.partial();
