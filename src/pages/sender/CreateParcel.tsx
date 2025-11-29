import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useCreateParcelMutation } from "@/redux/features/parcel/parcel.api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router";

// Leaflet map imports for modal picker
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icon in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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
  deliveryDate: z.date({ message: "Delivery date is required" }),
});

type ParcelFormValues = z.infer<typeof parcelSchema>;

export function calculateFee(weight: number): number {
  const baseFee = 30;
  const perKg = 15;
  return baseFee + weight * perKg;
}

export default function CreateParcel() {
  const navigate = useNavigate();
  const [isMapOpen, setIsMapOpen] = React.useState(false);
  const [activeField, setActiveField] = React.useState<"pickup" | "delivery">(
    "delivery"
  );
  // Temporary selection inside modal
  const [mapPos, setMapPos] = React.useState<{ lat: number; lng: number }>({
    lat: 23.8103,
    lng: 90.4125,
  });
  const [mapAddress, setMapAddress] = React.useState<string>("");
  // Persisted positions for each field
  const [pickupPos, setPickupPos] = React.useState<{
    lat: number;
    lng: number;
  }>({ lat: 23.8103, lng: 90.4125 });
  const [deliveryPos, setDeliveryPos] = React.useState<{
    lat: number;
    lng: number;
  }>({ lat: 23.8103, lng: 90.4125 });
  const form = useForm<ParcelFormValues>({
    resolver: zodResolver(parcelSchema) as any,
    mode: "onBlur",
    defaultValues: {
      pickupAddress: { address: "", latitude: 23.8103, longitude: 90.4125 },
      deliveryAddress: { address: "", latitude: 23.8103, longitude: 90.4125 },
    } as any,
  });
  const { setValue, getValues, handleSubmit, watch, register } = form as any;

  function LocationMarker() {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setMapPos({ lat, lng });
        try {
          // Use proxy in development, backend API in production
          const geocodeUrl = import.meta.env.DEV 
            ? `/nominatim/reverse?format=json&lat=${lat}&lon=${lng}`
            : `${import.meta.env.VITE_BASE_URL}/geocode/reverse?lat=${lat}&lon=${lng}`;
            
          const res = await fetch(geocodeUrl, {
            credentials: import.meta.env.DEV ? 'same-origin' : 'include'
          });
          
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const data = await res.json();
          console.log(data);
          setMapAddress(data?.display_name || "");
        } catch (error) {
          console.error('Geocoding error:', error);
          setMapAddress("");
        }
      },
    });
    return null;
  }

  const weight = watch("weight");
  const calculatedFee = weight && weight > 0 ? calculateFee(weight) : 0;

  const [createParcel] = useCreateParcelMutation();

  async function onSubmit(values: ParcelFormValues) {
    try {
      const payload = {
        ...values,
        deliveryAddress: {
          address: values.deliveryAddress.address,
          latitude: values.deliveryAddress.latitude,
          longitude: values.deliveryAddress.longitude,
        },
        pickupAddress: {
          address: values.pickupAddress.address,
          latitude: values.pickupAddress.latitude,
          longitude: values.pickupAddress.longitude,
        },
        deliveryDate: new Date(values.deliveryDate).toISOString(),
      };
      console.log(payload);
      const res = await createParcel(payload).unwrap();
      console.log(res);
      toast.success("Parcel created successfully");
      form.reset();
      navigate("/sender/all-parcel");
    } catch (error: any) {
      console.log(error);
      toast.error(
        error?.data?.message || "Failed to create parcel. Please try again."
      );
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Create Parcel
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Provide parcel details and schedule your delivery
        </p>
      </div>
      <Card className="border-white/40 bg-white/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-gray-900">Parcel Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...(form as any)}>
            <form
              onSubmit={handleSubmit(onSubmit as any)}
              className="space-y-8"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control as any}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Documents, Electronics"
                          {...field}
                        />
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
                          placeholder="e.g. 2.5"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {calculatedFee > 0 && (
                <div className="rounded-lg border bg-muted/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Estimated Delivery Fee
                    </span>
                    <span className="text-lg font-semibold">
                      ৳{calculatedFee}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Base ৳30 + ৳15 per kg
                  </p>
                </div>
              )}

              <Separator />
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control as any}
                  name="pickupAddress"
                  render={() => (
                    <FormItem>
                      <FormLabel>Pickup Address</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            readOnly
                            placeholder="House, Road, Area"
                            {...(register("pickupAddress.address") as any)}
                          />
                          <button
                            type="button"
                            className="w-7 h-7 bg-white border text-gray-500 border-gray-200 rounded-md p-1"
                            aria-label="Pick from map"
                            onClick={() => {
                              setActiveField("pickup");
                              setMapPos(pickupPos);
                              setMapAddress(
                                getValues("pickupAddress.address") || ""
                              );
                              setIsMapOpen(true);
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
                  name="deliveryAddress"
                  render={() => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            readOnly
                            placeholder="House, Road, Area"
                            {...(register("deliveryAddress.address") as any)}
                          />
                          <button
                            type="button"
                            className="w-7 h-7 bg-white border text-gray-500 border-gray-200 rounded-md p-1"
                            aria-label="Pick from map"
                            onClick={() => {
                              setActiveField("delivery");
                              setMapPos(deliveryPos);
                              setMapAddress(
                                getValues("deliveryAddress.address") || ""
                              );
                              setIsMapOpen(true);
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
              </div>

              <Separator />
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control as any}
                  name="receiverPhoneNumber"
                  render={({ field }: { field: any }) => (
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
                  render={({ field }: { field: any }) => (
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
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
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
                <Button type="submit" className="w-full">
                  Create Parcel
                </Button>
              </div>
            </form>
          </Form>

          {/* Map modal */}
          {isMapOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setIsMapOpen(false)}
              />
              <div className="relative z-10 w-full max-w-3xl rounded-lg bg-white p-4 shadow-lg">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Select address on map
                  </h3>
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
                  <p>
                    <strong>Latitude:</strong> {mapPos.lat}
                  </p>
                  <p>
                    <strong>Longitude:</strong> {mapPos.lng}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {mapAddress || "Click on map to select"}
                  </p>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button
                    disabled={!mapAddress}
                    className="w-full"
                    onClick={() => {
                      if (activeField === "pickup") {
                        setValue("pickupAddress.address", mapAddress, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setValue("pickupAddress.latitude", mapPos.lat, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setValue("pickupAddress.longitude", mapPos.lng, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setPickupPos(mapPos);
                      } else {
                        setValue("deliveryAddress.address", mapAddress, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setValue("deliveryAddress.latitude", mapPos.lat, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setValue("deliveryAddress.longitude", mapPos.lng, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        setDeliveryPos(mapPos);
                      }
                      setIsMapOpen(false);
                    }}
                  >
                    Use this location
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
