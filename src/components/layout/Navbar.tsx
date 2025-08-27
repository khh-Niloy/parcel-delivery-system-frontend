import Logo from "@/assets/icons/Logo"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Link, useNavigate } from "react-router"
import { authApi, useUserInfoQuery, useUserLogoutMutation } from "@/redux/features/auth/auth.api"
import { useAppDispatch } from "@/redux/hooks"
import { toast } from "sonner"

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: "/", label: "Home"},
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]


export default function Navbar() {
  const {data: user} = useUserInfoQuery(undefined)
  console.log(user?.data.role)

  let role = user?.data.role

  if(role === "DELIVERY_AGENT"){
    role = "delivery-agent"
  }

  const [logout] = useUserLogoutMutation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleLogout = async () => {
    await logout(undefined)
    dispatch(authApi.util.resetApiState())
    navigate("/")
    toast.success("Logged out successfully")
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-white px-4 md:px-6">
      <div className="flex h-16 justify-between gap-4">
        <div className="flex gap-2">
          <div className="flex items-center md:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="group size-8 hover:text-primary" variant="ghost" size="icon">
                  <svg
                    className="pointer-events-none"
                    width={16}
                    height={16}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 12L20 12"
                      className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                    />
                    <path
                      d="M4 12H20"
                      className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                    />
                  </svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-40 p-1 md:hidden">
                <NavigationMenu className="max-w-none *:w-full">
                  <NavigationMenuList className="flex-col items-start gap-0 md:gap-2">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink
                          href={link.href}
                          className="py-2 px-2 rounded-md hover:bg-accent hover:text-primary transition-colors"
                        >
                          {link.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-6">
            <a href="/" className="group inline-flex items-center">
              <Logo />
              <span className="sr-only">Parcel Delivery</span>
            </a>
            <NavigationMenu className="h-full *:h-full max-md:hidden">
              <NavigationMenuList className="h-full gap-2">
                {navigationLinks.map((link, index) => (
                  <NavigationMenuItem key={index} className="h-full">
                    <NavigationMenuLink
                      href={link.href}
                      className="text-muted-foreground hover:text-primary border-b-primary hover:border-b-primary data-[active]:border-b-primary h-full justify-center rounded-none border-y-2 border-transparent py-1.5 px-2 font-medium hover:bg-transparent data-[active]:bg-transparent! transition-colors"
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div>
            {
              user ? <div>
                
                <Button onClick={handleLogout} variant="destructive" size="sm" className="text-sm gap-7">
                  Logout
                </Button>
              </div> :
              <>
              <div className="flex gap-2">
                <Button  variant="ghost" size="sm" className="text-sm gap-7 text-primary hover:bg-accent">
                  <Link to="/login">Login</Link>
                </Button>
                <Button  variant="ghost" size="sm" className="text-sm gap-7 text-primary hover:bg-accent">
                  <Link to="/register">Register</Link>
                </Button>
              </div>
              </> 
            }
            
          </div>
          {
            user && <Button asChild size="sm" className="text-sm">
              <Link to={`/${role?.toLowerCase()}`}>Dashboard</Link>
            </Button>
          }
        </div>
      </div>
    </header>
  )
}
