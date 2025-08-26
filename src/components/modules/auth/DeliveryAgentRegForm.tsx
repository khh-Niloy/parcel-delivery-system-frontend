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
  phone: z.string().min(11, {
    message: "Phone number must be at least 11 characters.",
  }),
  address: z.string().min(10, {
    message: "Address must be at least 10 characters.",
  }),
  role: z.literal("DELIVERY_AGENT"),
  vehicleType: z.enum(["bike", "car", "van", "truck"], {
    message: "Please select a valid vehicle type.",
  }),
  licenseNumber: z.string().min(5, {
    message: "License number must be at least 5 characters.",
  }),
  experienceLevel: z.enum(["beginner", "intermediate", "expert"], {
    message: "Please select your experience level.",
  }),
})

export function DeliveryAgentRegForm({
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
      phone: "",
      address: "",
      role: "DELIVERY_AGENT",
      vehicleType: "bike" as "bike" | "car" | "van" | "truck",
      licenseNumber: "",
      experienceLevel: "beginner" as "beginner" | "intermediate" | "expert",
    },
  })

  const [register] = useRegisterMutation()

  const onSubmit = async(data: z.infer<typeof formSchema>) => {
    try {
      console.log(data)
      const res = await register(data).unwrap()
      console.log(res)
      if(res.success){
        toast.success("Delivery Agent Registration successful")
        navigate("/login")
        form.reset()
      }
    } catch (error) {
      console.log(error)
      toast.error("Registration failed. Please try again.")
    }
  }
  
  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-md mx-auto justify-center items-center min-h-screen", className)} {...props}>
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Delivery Agent Registration</h1>
        <p className="text-muted-foreground">Join our delivery network</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" type="email" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        placeholder="Enter your password" 
                        type={showPassword ? "text" : "password"} 
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your phone number" type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your vehicle type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="bike">Bike</SelectItem>
                      <SelectItem value="car">Car</SelectItem>
                      <SelectItem value="van">Van</SelectItem>
                      <SelectItem value="truck">Truck</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your license number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your experience level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                      <SelectItem value="expert">Expert (3+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <Button type="submit" className="w-full">
            Register as Delivery Agent
          </Button>
        </form>
      </Form>
      
      <div className="text-center text-sm flex flex-col gap-2">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Login here
        </Link>

        Want to register as a regular user?{" "}
        <Link to="/register" className="text-primary hover:underline">
          Register here
        </Link>
      </div>
      
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

export default DeliveryAgentRegForm