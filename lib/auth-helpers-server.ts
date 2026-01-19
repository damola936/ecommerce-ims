import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function currentUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return user
}

export async function getUserDetails() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    const email = user.email as string
    const avatar = user.user_metadata.avatar_url || user.user_metadata.picture as string;
    return { email, avatar }
}

export async function logOutUser() {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()
    if (error) console.error(error)
    redirect("/")
}