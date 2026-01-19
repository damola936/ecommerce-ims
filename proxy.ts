import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 1. Check for the user
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Define the logic
    const isHomePage = request.nextUrl.pathname === '/'
    // const isLoginPage = request.nextUrl.pathname === '/login' // Assuming you have a login page

    // If it's NOT the homepage/login and there is NO user, redirect to home (or login)
    if (!user && !isHomePage) {
        const url = request.nextUrl.clone()
        url.pathname = '/' // Or '/login'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files like CSS/JS)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public/assets (if you have a folder for global public assets)
         */
        '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
    ],
}