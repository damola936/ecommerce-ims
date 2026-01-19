import { createClient } from "@/utils/supabase/client"

export async function currentUser() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    return user
}

export async function logOutUser() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) console.error(error)
    // On the client, we use window.location.href or router.push
    window.location.href = "/"
}
