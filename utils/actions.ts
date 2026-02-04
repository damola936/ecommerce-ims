"use server"

import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation"
import {imageSchema, productSchema, validateWithZodSchema} from "@/utils/schemas";
import {uploadImagesToBucket} from "@/utils/supabase-image-upload";
import {prisma} from "@/lib/prisma";
import slugify from "slugify";
import {nanoid} from "nanoid";
import {OrderStatus, ProductStatus} from "@/lib/generated/prisma";
import {revalidatePath} from "next/cache";

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

        const [fullImagesPaths, brand] = await Promise.all([
            uploadImagesToBucket(validatedImages),
            prisma.brand.create({
                data: {
                    name: brandName,
                }
            })
        ])
        const imageConstructs = fullImagesPaths.map((image, index) => {
            if (index === 0) {
                return {url: image, isPrimary: true}
            } else return {url: image, isPrimary: false}
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

export const fetchAllProducts = async ({search, page = 1, pageSize = 7}: { search: string, page?: number, pageSize?: number }) => {
    const skip = (page - 1) * pageSize;

    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
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
            },
            skip,
            take: pageSize
        }),
        prisma.product.count({
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
            }
        })
    ]);

    return {products, totalCount};
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

export const getAllUsers = async () => {
    const users = await prisma.user.findMany()
    return users
}


export const getUserOrdersLength = async (userId: string) => {
    const userOrders = await prisma.order.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: "desc"
        }
    })
    return userOrders.length
}

export async function createBrandAction(prevState: any, formData: FormData) {
    try {
        const brandName = formData.get("name") as string;
        const existingBrand = await prisma.brand.findFirst({
            where: {
                name: brandName
            }
        })
        if (!existingBrand) {
            await prisma.brand.create({
                data: {
                    name: brandName,
                }
            })
            revalidatePath("/ecommerce/test/create")
            return {message: "Brand created successfully."}
        } else {
            return {message: "Brand already exists."}
        }
    } catch (error) {
        return renderError(error);
    }
}

export async function createUserAction(prevState: any, formData: FormData) {
    try {
        const email = (formData.get("email") as string)?.trim();
        if (!email) {
            return {message: "Email is required."}
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                email: email
            }
        })
        if (!existingUser) {
            await prisma.user.create({
                data: {
                    email: email,
                }
            })
            revalidatePath("/ecommerce/test/create")
            return {message: "User created successfully."}
        } else {
            return {message: "User already exists."}
        }
    } catch (error) {
        return renderError(error);
    }
}

export async function createOrderAction(prevState: any, formData: FormData) {
    try {
        const status = formData.get("status") as OrderStatus;
        const userEmail = formData.get("user") as string;
        const productName = formData.get("product") as string;
        const quantity = parseInt(formData.get("quantity") as string);
        // get user and product for our order
        const [user, productToOrder] = await Promise.all([
            prisma.user.findFirst({where: {email: userEmail}}),
            prisma.product.findFirst({where: {name: productName}})
        ])
        if (user && productToOrder) {
            await prisma.order.create({
                data: {
                    userId: user.id,
                    // creating the orderItems
                    items: {
                        create: {
                            productId: productToOrder.id,
                            quantity: quantity,
                            priceAtPurchase: productToOrder.basePrice
                        }
                    },
                    totalAmount: Number(productToOrder.basePrice) * quantity,
                    status: status,
                }
            })
        }
        revalidatePath("/ecommerce/test/create")
        return {message: "Order created successfully."}
    } catch (error) {
        return renderError(error);
    }
}

export async function createCategoryAction(prevState: any, formData: FormData) {
    try {
        const categoryName = formData.get("category") as string;
        const productName = formData.get("product") as string;
        const product = await prisma.product.findFirst({where: {name: productName}})
        const slug = slugify(categoryName, {lower: true, strict: true, trim: true})
        if (product) {
            await prisma.category.create({
                data: {
                    name: categoryName,
                    slug: slug,
                    products: {
                        connect: {
                            id: product.id
                        }
                    }
                }
            })
        }
        revalidatePath("/ecommerce/test/create")
        return {message: "Category created successfully."}
    } catch (error) {
        return renderError(error);
    }
}

export const createVariantAction = async (prevState: any, formData: FormData) => {
    try {
        const productName = formData.get("product") as string;
        const color = formData.get("color") as string;
        const size = formData.get("size") as string;
        const weight = parseFloat(formData.get("weight") as string);
        const stock = parseInt(formData.get("stock") as string);
        const length = parseFloat(formData.get("length") as string);
        const width = parseFloat(formData.get("width") as string);
        const height = parseFloat(formData.get("height") as string);

        const product = await prisma.product.findFirst({
            where: {name: productName},
            include: {brand: true, categories: true},
        })

        if (!product) {
            return {message: "Product not found."}
        }

        const brandName = product.brand?.name || product.name;
        const categoryName = product.categories[0]?.name || "GEN";
        const attributes = {color: color, size: size, weight: weight};
        const dimensions = {length: length, width: width, height: height};
        const price = Number(product.basePrice) + 10;

        await prisma.productVariant.create({
            data: {
                productId: product.id,
                sku: generateSKU(brandName, categoryName),
                price: price,
                stock: stock,
                attributes: attributes,
                weight: weight,
                dimensions: dimensions
            }
        })
        revalidatePath("/ecommerce/test/create")
        return {message: "Variant created successfully."}
    } catch (error) {
        return renderError(error);
    }
}

export const fetchAllBrands = async () => {
    const brands = await prisma.brand.findMany()
    return brands
}

type highestCat = {
    highestCategory: string,
    hNo: string
}
type lowestCat = {
    lowestCategory: string,
    lNo: string
}

export type HiLoOrder = {
    month: string,
    highestCategory: string,
    hNo: string,
    lowestCategory: string,
    lNo: string
}

export const fetchFebHiLoOrderCategory = async () => {
    try {
        const highest_category:highestCat[] = await prisma.$queryRaw`
            SELECT 
                c."name" as "highestCategory", 
                COUNT(oi."id")::text as "hNo"
            FROM "Order" o
            JOIN "OrderItem" oi ON o."id" = oi."orderId"
            JOIN "Product" p ON oi."productId" = p."id"
            JOIN "_CategoryToProduct" ctp ON p."id" = ctp."B"
            JOIN "Category" c ON ctp."A" = c."id"
            WHERE EXTRACT(MONTH FROM o."createdAt") = 2
            GROUP BY c."name"
            ORDER BY COUNT(oi."id") DESC 
            LIMIT 1
        `;
        const lowest_category:lowestCat[] = await prisma.$queryRaw`
            SELECT 
                c."name" as "lowestcategory", 
                COUNT(oi."id")::text as "lNo"
            FROM "Order" o
            JOIN "OrderItem" oi ON o."id" = oi."orderId"
            JOIN "Product" p ON oi."productId" = p."id"
            JOIN "_CategoryToProduct" ctp ON p."id" = ctp."B"
            JOIN "Category" c ON ctp."A" = c."id"
            WHERE EXTRACT(MONTH FROM o."createdAt") = 2
            GROUP BY c."name"
            ORDER BY COUNT(oi."id") ASC 
            LIMIT 1
        `;
        const results:HiLoOrder[] = highest_category.map((highest, index) => {
            return {...highest, month: "February", ...lowest_category[index]}
        })
        return results;
    } catch (error) {
        return renderError(error);
    }
}

export const fetch5HiLoStocks = async () => {
    const productsWithVariant = await prisma.product.findMany({
        include: {variants: true},
    })
    const allStocks = productsWithVariant.map((product) => {
        return {
            name: product.name,
            stock: product.variants.reduce((acc, variant) => acc + variant.stock, 0)
        }
    })
    const orderedStocks = allStocks.sort((a, b) => b.stock - a.stock) // sort in descending order
    const top5Stocks = orderedStocks.slice(0, 5) // take the top 5 stocks
    const bottom5Stocks = orderedStocks.slice(-5) // take the bottom 5 stocks
    return {top5Stocks, bottom5Stocks}
}
