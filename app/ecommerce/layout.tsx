import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import { getUserDetails } from "@/lib/auth-helpers-server"

async function SideBarLayout({ children }: { children: React.ReactNode }) {
  const details = await getUserDetails()
  const user = details
    ? { email: details.email, avatar: details.avatar, name: "Admin" }
    : { name: "Guest", email: "", avatar: "" }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SideBarLayout
