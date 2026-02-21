"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  GalleryVerticalEnd,
  LucideLock,
  SquareTerminal,
    LucideWrench,
    Archive
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
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
          title: "Predictions",
          url: "/ecommerce/analytics/predictions",
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
    {
      title: "Test",
      url: "/ecommerce/test/",
      icon: LucideWrench,
      items: [
        {
          title: "Create",
          url: "/ecommerce/test/create"
        }
      ]
    },
    {
      title: "Archives",
      url: "/ecommerce/archives/",
      icon: Archive,
      items: [
        {
          title: "All Archives",
          url: "/ecommerce/archives/all"
        }
      ]
    }
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
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
