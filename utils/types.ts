import {Prisma} from "@/lib/generated/prisma/client";

export type ActionFunction = (prevState: any, formData: FormData) => Promise<{ message: string }>

export type FullProduct = Prisma.ProductGetPayload<{
    include: { brand: true, variants: true, images: true, categories: true }
}>

