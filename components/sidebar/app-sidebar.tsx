"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  LucideLock,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavOthers } from "@/components/sidebar/nav-others"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/ecommerce/dashboard/",
      icon: SquareTerminal,
      items: [
        {
          title: "Overview",
          url: "/ecommerce/dashboard/overview",
        },
        {
          title: "Analytics",
          url: "/ecommerce/dashboard/analytics",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/ecommerce/analytics/",
      icon: Bot,
      items: [
        {
          title: "Metrics",
          url: "/ecommerce/analytics/metrics",
        },
        {
          title: "Reports",
          url: "/ecommerce/analytics/reports",
        },
      ],
    },
    {
      title: "Products",
      url: "/ecommerce/products/",
      icon: BookOpen,
      items: [
        {
          title: "All Products",
          url: "/ecommerce/products/all",
        },
        {
          title: "Categories",
          url: "/ecommerce/products/categories",
        },
      ],
    },
    {
      title: "Orders",
      url: "/ecommerce/orders/",
      icon: GalleryVerticalEnd,
      items: [
        {
          title: "All Orders",
          url: "/ecommerce/orders/all",
        },
        {
          title: "Completed",
          url: "/ecommerce/orders/completed",
        },
        {
          title: "Pending",
          url: "/ecommerce/orders/pending",
        },
      ],
    },
    {
      title: "Customers",
      url: "/ecommerce/customers/",
      icon: Frame,
      items: [
        {
          title: "All Customers",
          url: "/ecommerce/customers/all",
        },
        {
          title: "Recent Customers",
          url: "/ecommerce/customers/recent",
        },
      ],
    },
  ],
  others: [
    {
      name: "Settings",
      url: "/ecommerce/settings",
      icon: Settings2,
    },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 justify-center">
          <LucideLock />
          <p>IMS</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavOthers projects={data.others} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
