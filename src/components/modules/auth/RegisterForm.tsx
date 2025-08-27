import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRegisterMutation } from "@/redux/features/auth/auth.api"
import { toast } from "sonner"
import { useNavigate, Link } from "react-router"
    
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  phone: z.string().min(11, {
    message: "Phone number must be at least 11 characters.",
  }),
  role: z.enum(["RECEIVER", "SENDER"], {
    message: "Please select a valid role.",
  }),
})

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      phone: "",
      role: "SENDER" as "RECEIVER" | "SENDER",
    },
  })

  const [register] = useRegisterMutation()

  const onSubmit = async(data: z.infer<typeof formSchema>) => {
    try {
      console.log(data)
    const res = await register(data).unwrap()
    console.log(res)
    if(res.data.success){
      toast.success("Registration successful")
      navigate("/login")
      form.reset()
    }
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold mb-2 text-gray-900">Create Your Account</h1>
        <p className="text-gray-600">Tell us about yourself to get started</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Full Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your full name" 
                    className="h-12 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email" 
                    type="email" 
                    className="h-12 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="Enter your password" 
                      type={showPassword ? "text" : "password"} 
                      className="h-12 px-4 pr-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      {...field} 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Phone Number</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your phone number" 
                    type="tel" 
                    className="h-12 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Full Address</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your complete address" 
                  className="h-12 px-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Account Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                    <SelectValue placeholder="Select your account type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SENDER">I want to send packages</SelectItem>
                  <SelectItem value="RECEIVER">I want to receive packages</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg">
          Create Account
        </Button>
      </form>
    </Form>
    
    <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
      <div className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign in here
        </Link>
      </div>
      
      <div className="text-center text-sm text-gray-600">
        Want to be a delivery partner?{" "}
        <Link to="/delivery-agent-register" className="text-blue-600 hover:text-blue-700 font-medium">
          Apply here
        </Link>
      </div>
    </div>
    
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="text-center text-xs text-gray-500">
        By creating an account, you agree to our{" "}
        <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
        and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
      </div>
    </div>
    </div>
  )
}
