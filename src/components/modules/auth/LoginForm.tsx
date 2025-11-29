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
import { useLoginMutation } from "@/redux/features/auth/auth.api"
import { toast } from "sonner"
import { useNavigate } from "react-router"

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [login] = useLoginMutation()

  const onSubmit = async(data: z.infer<typeof formSchema>) => {
    try {
      const res = await login(data).unwrap()
      console.log(res)
      if(res.success){
        toast.success("Login successful")
        form.reset()
        navigate("/")
      }
    } catch (error: any) {
      toast.error(error.data?.message || "Login failed")
      console.log(error)
    }
  }
  
  return (
    <div className={cn("w-full", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
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
          <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg">
            Sign In
          </Button>
        </form>
      </Form>
      
      {/* Additional Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-center text-xs text-gray-500">
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
          and <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>.
        </div>
      </div>
    </div>
  )
}
  