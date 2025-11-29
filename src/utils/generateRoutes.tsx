type SidebarRoute = {
  title?: string
  url: string
  component: React.ComponentType
}

type SidebarSection = {
  title?: string
  items: SidebarRoute[]
}

export const generateRoutes = (sidebarItems: SidebarSection[]) => {
  return sidebarItems.flatMap((section: SidebarSection) =>
    section.items.map((route: SidebarRoute) => ({
      path: route.url,
      Component: route.component,
    }))
  )
}