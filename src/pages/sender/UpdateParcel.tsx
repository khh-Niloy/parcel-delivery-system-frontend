import { useNavigate, useParams } from "react-router"
import { useGetParcelByIdQuery, useUpdateParcelMutation } from "@/redux/features/parcel/parcel.api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"

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
import { toast } from "sonner"
import { FormLoadingSkeleton } from "@/components/ui/loading"

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
		.string()
		.min(1, { message: "Delivery date is required" })
		.refine((v) => !Number.isNaN(Date.parse(v)), {
			message: "Invalid date",
		}),
})

type ParcelFormValues = z.infer<typeof parcelSchema>

export function calculateFee(weight: number): number {
	const baseFee = 30;
	const perKg = 15;
	return baseFee + weight * perKg;
}

export default function UpdateParcel() {
	const { trackingId } = useParams()
	const { data: parcel, isLoading } = useGetParcelByIdQuery(trackingId)
	const [updateParcel] = useUpdateParcelMutation()
    const navigate = useNavigate()
	const form = useForm<ParcelFormValues>({
		resolver: zodResolver(parcelSchema) as any,
		mode: "onBlur",
	})

	// Pre-populate form when parcel data is loaded
	useEffect(() => {
		if (parcel) {
			form.reset({
				type: parcel.type || "",
				weight: parcel.weight || 0,
				receiverPhoneNumber: parcel.receiverId.phone || "",
				deliveryAddress: parcel.deliveryAddress || "",
				pickupAddress: parcel.pickupAddress || "",
				deliveryDate: parcel.deliveryDate ? format(new Date(parcel.deliveryDate), "yyyy-MM-dd") : "",
			})
		}
	}, [parcel, form])

	const weight = form.watch("weight");
	const calculatedFee = weight && weight > 0 ? calculateFee(weight) : 0;

	async function onSubmit(values: ParcelFormValues) {
		try {
			const payload = {
				...values,
				trackingId,
				deliveryDate: new Date(values.deliveryDate).toISOString(),
			}
			const res = await updateParcel(payload).unwrap()
			console.log(res)
			toast.success("Parcel updated successfully")
            navigate("/sender/all-parcel")
		} catch (error: any) {
			toast.error(error?.data?.message || "Failed to update parcel. Please try again.")
			console.error("Failed to update parcel:", error)
		}
	}

	if (isLoading) {
		return <FormLoadingSkeleton />
	}

	if (!parcel) {
		return <div>Parcel not found</div>
	}

	return (
		<div className="max-w-2xl w-full">
			<h1 className="text-2xl font-bold mb-6">Update Parcel</h1>
			<Form {...(form as any)}>
				<form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
					<FormField
						control={form.control as any}
						name="type"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Type</FormLabel>
								<FormControl>
									<Input placeholder="Enter parcel type" {...field} />
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
									<Input
										type="number"
										step="0.01"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{calculatedFee > 0 && (
						<div className="p-4 bg-muted rounded-lg">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium">Delivery Fee:</span>
								<span className="text-lg font-bold">৳{calculatedFee}</span>
							</div>
							<div className="text-xs text-muted-foreground mt-1">
								Base fee: ৳30 + ৳15/kg
							</div>
						</div>
					)}

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
						control={form.control as any}
						name="deliveryAddress"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Delivery Address</FormLabel>
								<FormControl>
									<Input placeholder="Enter delivery address" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control as any}
						name="pickupAddress"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Pickup Address</FormLabel>
								<FormControl>
									<Input placeholder="Enter pickup address" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control as any}
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
													"w-[240px] pl-3 text-left font-normal",
													!field.value && "text-muted-foreground"
												)}
											>
												{field.value ? (
													format(new Date(field.value), "PPP")
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
											selected={field.value ? new Date(field.value) : undefined}
											onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
											disabled={(date) =>
												date > new Date() || date < new Date("1900-01-01")
											}
											captionLayout="dropdown"
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="pt-2">
						<Button type="submit" className="w-full">Update Parcel</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}