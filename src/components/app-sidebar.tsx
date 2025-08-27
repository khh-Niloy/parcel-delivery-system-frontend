import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Logo from "@/assets/icons/Logo"
import { useUserInfoQuery } from "@/redux/features/auth/auth.api"
import { roleBasedSidebar } from "@/utils/roleBasedSideBar"
import { Link, useLocation } from "react-router"
import { Home, ArrowLeft } from "lucide-react"

// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const {data: user} = useUserInfoQuery(undefined)
  const location = useLocation()

console.log(user?.data?.role)

const data = {
  navMain: [...roleBasedSidebar(user?.data?.role)],
}

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link to="/" className="group inline-flex items-center gap-2 rounded-lg p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
          <div className="relative">
            <span className="absolute -inset-2 rounded-full bg-primary/10 blur-md" />
            <Logo />
          </div>
          {user?.data?.role && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary">
              {user.data.role}
            </span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === "/"}>
                  <Link to="/" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-md">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild isActive={location.pathname.startsWith(subItem.url)}>
                      <Link to={subItem.url} className="flex items-center gap-2">
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
