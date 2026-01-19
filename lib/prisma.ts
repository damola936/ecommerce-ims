// lib/prisma.ts
import {PrismaClient} from "@/lib/generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// 1. Singleton setup
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// 2. Optimized Pool for Supabase (Prevents connection exhaustion)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10, // Adjust based on your Supabase tier
})
const adapter = new PrismaPg(pool)

// 3. Instance Logic
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
    })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma