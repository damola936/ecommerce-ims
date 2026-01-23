import {Prisma} from "@/lib/generated/prisma/client";

export type ActionFunction = (prevState: any, formData: FormData) => Promise<{ message: string }>

export type FullProduct = Prisma.ProductGetPayload<{
    include: { brand: true, variants: true, images: true, categories: true, status: true }
}>

export type FullOrder = Prisma.OrderGetPayload<{ include: {user: true, items: {include: {product: {include: {categories: true}}}}} }>

