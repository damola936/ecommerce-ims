import { z, ZodSchema } from "zod";



export const productSchema = z.object({
    name: z
        .string()
        .min(3, {message: "Name cannot be less that 3 letters"})
        .max(100, {message: "Name cannot be more that 100 letters"}),

    description: z.string().refine(
        (description) => {
            const wordCount = description.split(' ').length;
            return wordCount >= 10 && wordCount <= 1000;
        },
        {
            message: 'description must be between 10 and 1000 words.',
        }
    ),
    basePrice: z.coerce.number().int().min(0, {
        message: 'price must be a positive number.',
    }),
})

export const ProductImageSchema = z.object({
    url: z.coerce.string(),
    isPrimary: z.coerce.boolean(),
})

export const imageSchema = z.object({
    image: validateImageFile()
})

function validateImageFile() {
    const acceptedFileTypes = ["image/"]
    return z.instanceof(File)
        .refine((file) => {
            return !file || acceptedFileTypes.some(type => file.type.startsWith(type))
        }, "File must be an image")
}

export const ProductVariantSchema = z.object({
    price: z.coerce.number().int().min(0, {
        message: 'price must be a positive number.',
    }),
    stock: z.coerce.number().int().min(0, {
        message: 'stock must be a positive number.',
    }),
    weight: z.coerce.number().int().min(0, {
        message: 'weight must be a positive number.',
    }),
    color: z.string(),
    size: z.string(),
})

export const CategorySchema = z.object({
    name: z
        .string()
        .min(3, {message: "Name cannot be less that 3 letters"})
        .max(100, {message: "Name cannot be more that 100 letters"}),
})

export const BrandSchema = z.object({
    name: z
        .string()
        .min(3, {message: "Name cannot be less that 3 letters"})
        .max(100, {message: "Name cannot be more that 100 letters"}),
})

export function validateWithZodSchema<T>(schema: ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data)
    if (!result.success) {
        const error = result.error.message
        throw new Error(error)
    }
    return result.data
}