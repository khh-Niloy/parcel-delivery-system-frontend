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
  // Default to Dhaka, Bangladesh coordinates
  const defaultPos = { lat: 23.8103, lng: 90.4125 };
  
  // Temporary selection inside modal
  const [mapPos, setMapPos] = React.useState<{ lat: number; lng: number }>(defaultPos);
  const [mapAddress, setMapAddress] = React.useState<string>("");
  // Persisted positions for each field
  const [pickupPos, setPickupPos] = React.useState<{
    lat: number;
    lng: number;
  }>(defaultPos);
  const [deliveryPos, setDeliveryPos] = React.useState<{
    lat: number;
    lng: number;
  }>(defaultPos);

  // Function to fetch address from coordinates
  const fetchAddressFromCoords = React.useCallback(async (lat: number, lng: number) => {
    setMapAddress("Loading address...");
    
    // Try multiple geocoding services in order of preference
    const geocodingServices = [
      {
        name: 'Nominatim (Proxy)',
        url: `/nominatim/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18&accept-language=en`,
        parseResponse: (data: any) => data,
        condition: () => import.meta.env.DEV
      },
      {
        name: 'BigDataCloud',
        url: `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
        parseResponse: (data: any) => {
          if (data && (data.locality || data.city)) {
            const addressParts = [
              data.locality || data.city,
              data.principalSubdivision,
              data.countryName
            ].filter(Boolean);
            return { display_name: addressParts.join(', ') };
          }
          return null;
        },
        condition: () => true
      },
      {
        name: 'Nominatim (Direct)',
        url: `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18&accept-language=en`,
        parseResponse: (data: any) => data,
        condition: () => !import.meta.env.DEV
      }
    ];

    for (const service of geocodingServices) {
      if (!service.condition()) continue;
      
      try {
        console.log(`Trying ${service.name}:`, service.url);
        
        const headers: HeadersInit = {
          'Accept': 'application/json',
        };
        
        // Add User-Agent for direct Nominatim calls
        if (service.name.includes('Nominatim') && !import.meta.env.DEV) {
          headers['User-Agent'] = 'ParcelDeliveryApp/1.0';
        }
        
        const res = await fetch(service.url, {
          method: 'GET',
          headers,
          ...(import.meta.env.DEV && service.name.includes('Proxy') ? { credentials: 'same-origin' } : {})
        });
        
        if (!res.ok) {
          throw new Error(`${service.name} failed: ${res.status} ${res.statusText}`);
        }
        
        const rawData = await res.json();
        const data = service.parseResponse(rawData);
        
        console.log(`${service.name} response:`, data);
        
        if (data && data.display_name) {
          setMapAddress(data.display_name);
          return; // Success, exit the loop
        } else if (data && data.address) {
          // Try to construct address from address components
          const addr = data.address;
          const addressParts = [
            addr.house_number,
            addr.road,
            addr.neighbourhood || addr.suburb,
            addr.city || addr.town || addr.village,
            addr.state,
            addr.country
          ].filter(Boolean);
          
          if (addressParts.length > 0) {
            setMapAddress(addressParts.join(', '));
            return; // Success, exit the loop
          }
        }
        
        throw new Error(`${service.name} returned no usable address data`);
        
      } catch (error) {
        console.error(`${service.name} failed:`, error);
        // Continue to next service
      }
    }
    
    // All services failed, use coordinates as fallback
    console.warn('All geocoding services failed, using coordinates');
    setMapAddress(`Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    toast.error("Could not fetch address. Using coordinates instead.");
  }, []);

  // Get user's current location
  const getCurrentLocation = React.useCallback(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newPos = { lat: latitude, lng: longitude };
          setMapPos(newPos);
          
          // Fetch address for current location
          await fetchAddressFromCoords(latitude, longitude);
          
          if (activeField === "pickup") {
            setPickupPos(newPos);
          } else {
            setDeliveryPos(newPos);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Could not get your current location");
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser");
    }
  }, [activeField, fetchAddressFromCoords]);
  const form = useForm<ParcelFormValues>({
    resolver: zodResolver(parcelSchema) as any,
    mode: "onBlur",
    defaultValues: {
      pickupAddress: { address: "", latitude: defaultPos.lat, longitude: defaultPos.lng },
      deliveryAddress: { address: "", latitude: defaultPos.lat, longitude: defaultPos.lng },
    } as any,
  });
  const { setValue, getValues, handleSubmit, watch, register } = form as any;

  function LocationMarker() {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setMapPos({ lat, lng });
        await fetchAddressFromCoords(lat, lng);
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
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={getCurrentLocation}
                    >
                      Use Current Location
                    </Button>
                    <button
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border text-gray-600"
                      onClick={() => setIsMapOpen(false)}
                      aria-label="Close"
                    >
                      <span>✕</span>
                    </button>
                  </div>
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
                    <strong>Latitude:</strong> {mapPos.lat.toFixed(6)}
                  </p>
                  <p>
                    <strong>Longitude:</strong> {mapPos.lng.toFixed(6)}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    <span className={mapAddress === "Loading address..." ? "text-blue-600" : ""}>
                      {mapAddress || "Click on map to select"}
                    </span>
                  </p>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button
                    disabled={!mapAddress || mapAddress === "Loading address..."}
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
