export const generateRoutes = (sidebarItems: any) => {
  // console.log(sidebarItems)
  return sidebarItems.flatMap((section) =>
    section.items.map((route) => ({
      path: route.url,
      Component: route.component,
    }))
  );
};