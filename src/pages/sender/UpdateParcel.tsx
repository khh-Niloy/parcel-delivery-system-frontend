import { useNavigate, useParams } from "react-router"
import { useGetParcelByIdQuery, useUpdateParcelMutation } from "@/redux/features/parcel/parcel.api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"

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
import { CalendarIcon, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { toast } from "sonner"
import { FormLoadingSkeleton } from "@/components/ui/loading"

// Map imports and setup
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
// Fix Leaflet default marker icon in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
	iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
	iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
	shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

const parcelSchema = z.object({
	type: z.string().min(1, { message: "Type is required" }),
	weight: z.coerce.number().positive({ message: "Weight must be positive" }),
	receiverPhoneNumber: z
		.string()
		.min(11, { message: "Phone number must be at least 11 digits" })
		.max(15, { message: "Phone number is too long" }),
		deliveryAddress: z.object({
			address: z.string({
			  message: "Delivery address is required",
			}),
			latitude: z.number({
			  message: "Delivery address latitude is required",
			}),
			longitude: z.number({
			  message: "Delivery address longitude is required",
			}),
		  }),
		
		  pickupAddress: z.object({
			address: z.string({
			  message: "Pickup address is required",
			}),
			latitude: z.number({
			  message: "Pickup address latitude is required",
			}),
			longitude: z.number({
			  message: "Pickup address longitude is required",
			}),
		  }),
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
	const { setValue, getValues } = form as any

	// Map modal state
	const [isMapOpen, setIsMapOpen] = useState(false)
	const [activeField, setActiveField] = useState<"pickup" | "delivery">("delivery")
	const [mapPos, setMapPos] = useState<{ lat: number; lng: number }>({ lat: 23.8103, lng: 90.4125 })
	const [mapAddress, setMapAddress] = useState("")
	const [pickupPos, setPickupPos] = useState<{ lat: number; lng: number }>({ lat: 23.8103, lng: 90.4125 })
	const [deliveryPos, setDeliveryPos] = useState<{ lat: number; lng: number }>({ lat: 23.8103, lng: 90.4125 })

	function LocationMarker() {
		useMapEvents({
			click: async (e) => {
				const { lat, lng } = e.latlng
				setMapPos({ lat, lng })
				try {
					const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
					const data = await res.json()
					setMapAddress(data?.display_name || "")
				} catch {
					setMapAddress("")
				}
			},
		})
		return null
	}

	// Pre-populate form when parcel data is loaded
	useEffect(() => {
		if (parcel) {
			const dLat = parcel.deliveryAddress?.latitude ?? 23.8103
			const dLng = parcel.deliveryAddress?.longitude ?? 90.4125
			const pLat = parcel.pickupAddress?.latitude ?? 23.8103
			const pLng = parcel.pickupAddress?.longitude ?? 90.4125

			setDeliveryPos({ lat: dLat, lng: dLng })
			setPickupPos({ lat: pLat, lng: pLng })

			form.reset({
				type: parcel.type || "",
				weight: parcel.weight || 0,
				receiverPhoneNumber: parcel.receiverInfo?.phone || "",
				deliveryAddress: {
					address: parcel.deliveryAddress?.address || "",
					latitude: dLat,
					longitude: dLng,
				},
				pickupAddress: {
					address: parcel.pickupAddress?.address || "",
					latitude: pLat,
					longitude: pLng,
				},
				deliveryDate: parcel.deliveryDate ? format(new Date(parcel.deliveryDate), "yyyy-MM-dd") : "",
			} as any)
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
						render={() => (
							<FormItem>
								<FormLabel>Delivery Address</FormLabel>
								<FormControl>
									<div className="flex items-center gap-2">
										<Input readOnly placeholder="Enter delivery address" {...(form.register("deliveryAddress.address") as any)} />
										<button
											type="button"
											className="w-7 h-7 bg-white border text-gray-500 border-gray-200 rounded-md p-1"
											aria-label="Pick from map"
											onClick={() => {
												setActiveField("delivery")
												setMapPos(deliveryPos)
												setMapAddress(getValues("deliveryAddress.address") || "")
												setIsMapOpen(true)
											}}
										>
											<MapPin className="w-5 h-5" />
										</button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control as any}
						name="pickupAddress"
						render={() => (
							<FormItem>
								<FormLabel>Pickup Address</FormLabel>
								<FormControl>
									<div className="flex items-center gap-2">
										<Input readOnly placeholder="Enter pickup address" {...(form.register("pickupAddress.address") as any)} />
										<button
											type="button"
											className="w-7 h-7 bg-white border text-gray-500 border-gray-200 rounded-md p-1"
											aria-label="Pick from map"
											onClick={() => {
												setActiveField("pickup")
												setMapPos(pickupPos)
												setMapAddress(getValues("pickupAddress.address") || "")
												setIsMapOpen(true)
											}}
										>
											<MapPin className="w-5 h-5" />
										</button>
									</div>
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

			{/* Map modal */}
			{isMapOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="absolute inset-0 bg-black/40" onClick={() => setIsMapOpen(false)} />
					<div className="relative z-10 w-full max-w-3xl rounded-lg bg-white p-4 shadow-lg">
						<div className="mb-3 flex items-center justify-between">
							<h3 className="text-lg font-semibold">Select address on map</h3>
							<button
								className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-gray-600"
								onClick={() => setIsMapOpen(false)}
								aria-label="Close"
							>
								<span>✕</span>
							</button>
						</div>
						<div style={{ height: "300px", width: "100%" }}>
							<MapContainer
								center={[mapPos.lat, mapPos.lng]}
								zoom={13}
								style={{ height: "100%", width: "100%" }}
							>
								<TileLayer
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
									attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
								/>
								<Marker position={[mapPos.lat, mapPos.lng]} />
								<LocationMarker />
							</MapContainer>
						</div>
						<div className="mt-3 rounded border bg-gray-50 p-3 text-sm">
							<p><strong>Latitude:</strong> {mapPos.lat}</p>
							<p><strong>Longitude:</strong> {mapPos.lng}</p>
							<p><strong>Address:</strong> {mapAddress || "Click on map to select"}</p>
						</div>
						<div className="mt-3 flex justify-end">
							<Button
								disabled={!mapAddress}
								className="w-full"
								onClick={() => {
									if (activeField === "pickup") {
										setValue("pickupAddress.address", mapAddress, { shouldValidate: true, shouldDirty: true })
										setValue("pickupAddress.latitude", mapPos.lat, { shouldValidate: true, shouldDirty: true })
										setValue("pickupAddress.longitude", mapPos.lng, { shouldValidate: true, shouldDirty: true })
										setPickupPos(mapPos)
									} else {
										setValue("deliveryAddress.address", mapAddress, { shouldValidate: true, shouldDirty: true })
										setValue("deliveryAddress.latitude", mapPos.lat, { shouldValidate: true, shouldDirty: true })
										setValue("deliveryAddress.longitude", mapPos.lng, { shouldValidate: true, shouldDirty: true })
										setDeliveryPos(mapPos)
									}
									setIsMapOpen(false)
								}}
							>
								Use this location
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}