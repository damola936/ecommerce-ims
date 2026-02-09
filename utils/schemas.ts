import { z, ZodSchema } from "zod";



export const productSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name cannot be less that 3 letters" })
        .max(100, { message: "Name cannot be more that 100 letters" }),

    description: z.string().refine(
        (description) => {
            const wordCount = description.split(' ').length;
            return wordCount >= 10 && wordCount <= 1000;
        },
        {
            message: 'description must be between 10 and 1000 words.',
        }
    ),
    basePrice: z.coerce.number().min(0, {
        message: 'price must be a positive number.',
    }),
    brand: z.string().refine((brand) => brand.length > 0, { message: "Brand cannot be empty" }),
    categories: z.array(z.string().refine((category) => category.length > 0, { message: "Category cannot be empty" })).nonempty({ message: "Please select at least one category" }),
    color: z.string().refine((colors) => colors.length > 0, { message: "Colors cannot be empty" }),
    size: z.string().refine((sizes) => sizes.length > 0, { message: "Sizes cannot be empty" }),
    weight: z.coerce.number().min(0, { message: "Weight must be a positive number." }),
    stock: z.coerce.number().int().min(0, { message: "Stock must be a positive number." }),
    images: z.array(validateImageFile()).min(1, { message: "At least one image is required" }),
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
            return acceptedFileTypes.some(type => file.type.startsWith(type))
        }, "File must be an image").refine((file) => file.size > 0, "File cannot be empty")
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
        .min(3, { message: "Name cannot be less that 3 letters" })
        .max(100, { message: "Name cannot be more that 100 letters" }),
})

export const BrandSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name cannot be less that 3 letters" })
        .max(100, { message: "Name cannot be more that 100 letters" }),
})

export function validateWithZodSchema<T>(schema: ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data)
    if (!result.success) {
        const errors = result.error.issues.map((error) => error.message);
        const uniqueErrors = Array.from(new Set(errors));
        throw new Error(uniqueErrors.join(", "));
    }
    return result.data
}