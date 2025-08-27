import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useCreateParcelMutation } from "@/redux/features/parcel/parcel.api"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const parcelSchema = z.object({
	type: z.string().min(1, { message: "Type is required" }),
	weight: z.coerce.number().positive({ message: "Weight must be positive" }),
	receiverPhoneNumber: z
		.string()
		.min(11, { message: "Phone number must be at least 11 digits" })
		.max(15, { message: "Phone number is too long" }),
	deliveryAddress: z.string().min(1, { message: "Delivery address is required" }),
	pickupAddress: z.string().min(1, { message: "Pickup address is required" }),
	deliveryDate: z
		.date({ message: "Delivery date is required" }),
})

type ParcelFormValues = z.infer<typeof parcelSchema>

export function calculateFee(weight: number): number {
	const baseFee = 30;
	const perKg = 15;
	return baseFee + weight * perKg;
}

export default function CreateParcel() {
	const form = useForm<ParcelFormValues>({
		resolver: zodResolver(parcelSchema) as any,
		mode: "onBlur",
	})

	const weight = form.watch("weight");
	const calculatedFee = weight && weight > 0 ? calculateFee(weight) : 0;

    const [createParcel] = useCreateParcelMutation()

	async function onSubmit(values: ParcelFormValues) {
		try {
			const payload = {
				...values,
				deliveryDate: new Date(values.deliveryDate).toISOString(),
			}
			const res = await createParcel(payload).unwrap()
            console.log(res)
            toast.success("Parcel created successfully")
		} catch (error) {
			console.log(error)
            toast.error("Failed to create parcel")
		}
	}

	return (
		<div className="mx-auto w-full max-w-3xl">
			<div className="mb-6 text-center">
				<h1 className="text-2xl font-bold tracking-tight text-gray-900">Create Parcel</h1>
				<p className="text-sm text-muted-foreground mt-1">Provide parcel details and schedule your delivery</p>
			</div>
			<Card className="border-white/40 bg-white/95 backdrop-blur">
				<CardHeader>
					<CardTitle className="text-gray-900">Parcel Details</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...(form as any)}>
						<form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
							<div className="grid gap-6 md:grid-cols-2">
								<FormField
									control={form.control as any}
									name="type"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Type</FormLabel>
											<FormControl>
												<Input placeholder="e.g. Documents, Electronics" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control as any}
									name="weight"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Weight (kg)</FormLabel>
											<FormControl>
												<Input type="number" step="0.01" placeholder="e.g. 2.5" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							{calculatedFee > 0 && (
								<div className="rounded-lg border bg-muted/60 p-4">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">Estimated Delivery Fee</span>
										<span className="text-lg font-semibold">৳{calculatedFee}</span>
									</div>
									<p className="mt-1 text-xs text-muted-foreground">Base ৳30 + ৳15 per kg</p>
								</div>
							)}

							<Separator />
							<div className="grid gap-6 md:grid-cols-2">
								<FormField
									control={form.control as any}
									name="pickupAddress"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Pickup Address</FormLabel>
											<FormControl>
												<Input placeholder="House, Road, Area" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control as any}
									name="deliveryAddress"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Delivery Address</FormLabel>
											<FormControl>
												<Input placeholder="House, Road, Area" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<Separator />
							<div className="grid gap-6 md:grid-cols-2">
								<FormField
									control={form.control as any}
									name="receiverPhoneNumber"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Receiver Phone Number</FormLabel>
											<FormControl>
												<Input placeholder="01XXXXXXXXX" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
					  control={form.control}
					  name="deliveryDate"
					  render={({ field }) => (
					    <FormItem className="flex flex-col">
					      <FormLabel>Delivery Date</FormLabel>
					      <Popover>
					        <PopoverTrigger asChild>
					          <FormControl>
					            <Button
					              variant={"outline"}
					              className={cn(
					                "w-full pl-3 text-left font-normal",
					                !field.value && "text-muted-foreground"
					              )}
					            >
					              {field.value ? (
					                format(field.value, "PPP")
					              ) : (
					                <span>Pick a date</span>
					              )}
					              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
					            </Button>
					          </FormControl>
					        </PopoverTrigger>
					        <PopoverContent className="w-auto p-0" align="start">
					          <Calendar
					            mode="single"
					            selected={field.value? new Date(field.value) : undefined}
					            onSelect={field.onChange}
					            disabled={(date: Date) =>
					              date < new Date() || date < new Date("1900-01-01")
					            }
					            captionLayout="dropdown"
					          />
					        </PopoverContent>
					      </Popover>
					      <FormMessage />
					    </FormItem>
					  )}
						/>
						</div>

						<div className="pt-2">
							<Button type="submit" className="w-full">Create Parcel</Button>
						</div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	)
}
