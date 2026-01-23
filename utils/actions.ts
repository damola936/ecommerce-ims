"use server"

import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation"
import {imageSchema, productSchema, validateWithZodSchema} from "@/utils/schemas";
import {uploadImagesToBucket} from "@/utils/supabase-image-upload";
import {prisma} from "@/lib/prisma";
import slugify from "slugify";
import {nanoid} from "nanoid";
import {ProductStatus} from "@/lib/generated/prisma/enums";

const renderError = (error: unknown): { message: string } => {
    console.log(error);
    return {
        message: error instanceof Error ? error.message : "Error occurred.",
    };
};

function generateSKU(brand: string, category: string) {
    const brandPart = brand.substring(0, 3).toUpperCase();
    const catPart = category.substring(0, 3).toUpperCase();
    const randomPart = nanoid(5).toUpperCase(); // e.g., "7K2P1"

    return `${brandPart}-${catPart}-${randomPart}`;
}

export async function logIn(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const {error} = await supabase.auth.signInWithPassword({
        email, password
    })
    if (error) {
        return renderError(error);
    }
    // redirect to dashboard on success
    return redirect("/ecommerce/dashboard/overview");
}

export async function createProductAction(prevState: any, formData: FormData) {
    try {
        const rawData = Object.fromEntries(formData)
        const imageFiles = (formData.getAll("images") as File[]).filter(file => file.name !== 'undefined' && file.size > 0);
        const brandName = formData.get("brand") as string;
        const productName = formData.get("name") as string
        const color = formData.get("color") as string;
        const size = formData.get("size") as string;
        const weight = parseFloat(formData.get("weight") as string);
        const categories = formData.getAll("categories") as string[];
        if (categories.length === 0) {
            throw new Error("Please select at least one category")
        }
        const stock = parseInt(formData.get("stock") as string)
        const attributes = {color: color, size: size, weight: weight};
        const validatedFields = validateWithZodSchema(productSchema, rawData)
        const validatedImages = imageFiles.map(image => {
            const validatedImage = validateWithZodSchema(imageSchema, {image: image})
            return validatedImage.image
        })
        const productVariant = {
            sku: generateSKU(brandName, categories[0]),
            stock: stock,
            attributes: attributes,
            weight: weight
        };

        const fullImagesPaths = await uploadImagesToBucket(validatedImages)
        const imageConstructs = fullImagesPaths.map((image, index) => {
            if (index === 0) {
                return {url: image, isPrimary: true}
            } else return {url: image, isPrimary: false}
        })
        const brand = await prisma.brand.create({
            data: {
                name: brandName,
            }
        })

        await prisma.product.create({
            data: {
                ...validatedFields,
                slug: slugify(productName, {lower: true, strict: true, trim: true}),
                sku: generateSKU(brandName, categories[0]),
                images: {
                    create: imageConstructs
                },
                variants: {
                    create: [productVariant]
                },
                categories: {
                    connectOrCreate: {
                        where: {slug: slugify(categories[0], {lower: true, strict: true})},
                        create: {
                            name: categories[0],
                            slug: slugify(categories[0], {lower: true, strict: true}),
                        }
                    }
                },
                brand: {
                    connect: {id: brand.id}
                },
                status: "PUBLISHED",
            }
        })
    } catch (error) {
        return renderError(error);
    }
    redirect("/ecommerce/products/all")
}

export const fetchAllProducts = async ({search}: { search: string }) => {
    const products = await prisma.product.findMany({
        where: {
            OR: [
                {
                    name: {contains: search, mode: "insensitive"}
                },
                {
                    brand: {
                        name: {contains: search, mode: "insensitive"}
                    }
                }
            ]
        },
        include: {brand: true, variants: true, images: true, categories: true},
        orderBy: {
            createdAt: "desc"
        }
    })
    return products
}

export const fetchSingleProduct = async (id: string) => {
    const product = await prisma.product.findUnique({
        where: {id},
        include: {brand: true, variants: true, images: true, categories: true},
    })
    return product
}

export const getProductsByStatus = async (status: ProductStatus) => {
    const products = await prisma.product.findMany({
        where: {
            status: status
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return products
}

export const getAllOrders = async () => {
    const orders = await prisma.order.findMany({
        include: {user: true, items: {include: {product: {include: {categories: true}}}}},
        orderBy: {
            createdAt: "desc"
        }
    })
    return orders
}