import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Hash, Search, Package, Truck, Clock, MapPin, CheckCircle2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

export default function TrackParcelPage() {
  const [trackingId, setTrackingId] = useState("")
  const [parcel, setParcel] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTrackParcel = async (trackingId: string) => {
    try {
      if (!trackingId || trackingId.trim().length === 0) {
        toast.error("Please enter a tracking ID")
        return
      }
      setIsLoading(true)
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}parcel/single-parcel/${trackingId}`,
        { withCredentials: true }
      )
      const found = res?.data?.data
      if (found) {
        setParcel(found)
        toast.success("Parcel found")
      } else {
        setParcel(null)
        toast.error("No parcel found for this tracking ID")
      }
    } catch (error: any) {
      setParcel(null)
      toast.error(error?.response?.data?.message || "Failed to fetch parcel. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl py-16">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Track Parcel</h1>
        <p className="text-sm text-muted-foreground mt-1">Enter your tracking ID to view live status and history</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter tracking ID (e.g., TRK-20250825-...)"
                className="pl-9"
              />
            </div>
            <Button type="button" className="gap-2" onClick={() => handleTrackParcel(trackingId)} disabled={isLoading}>
              <Search className="h-4 w-4" />
              {isLoading ? "Tracking..." : "Track"}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Tip: You can find the tracking ID in your confirmation email or dashboard.</p>
        </CardContent>
      </Card>

      {parcel? (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Shipment Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground">Current Status</div>
                    <div className="mt-1 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset bg-blue-50 text-blue-700 ring-blue-200/60">
                      <Truck className="h-3.5 w-3.5" /> {parcel?.status ?? 'UNKNOWN'}
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground">Estimated Delivery</div>
                    <div className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Clock className="h-4 w-4 text-primary" />
                      {parcel?.deliveryDate ? new Date(parcel.deliveryDate).toDateString() : '-'}
                    </div>
                  </div>
                  <div className="rounded-lg border p-4 sm:col-span-2">
                    <div className="text-xs text-muted-foreground">Route</div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                        <div className="min-w-0">
                          <div className="text-xs text-muted-foreground">From</div>
                          <div className="truncate" title={parcel?.pickupAddress}>{parcel?.pickupAddress.address}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                        <div className="min-w-0">
                          <div className="text-xs text-muted-foreground">To</div>
                          <div className="truncate" title={parcel?.deliveryAddress}>{parcel?.deliveryAddress.address}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Delivery Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Tracking ID</span>
                    <span className="font-medium">{parcel?.trackingId}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">{parcel?.type ?? '-'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Weight</span>
                    <span className="font-medium">{parcel?.weight ?? '-'} kg</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-medium">৳{parcel?.fee ?? '-'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {Array.isArray(parcel?.trackingEvents) && parcel.trackingEvents.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-gray-900">Tracking History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parcel.trackingEvents.map((event: any, i: number) => (
                    <div key={i} className="relative pl-6">
                      <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-primary" />
                      {i !== parcel.trackingEvents.length - 1 && (
                        <span className="absolute left-[3px] top-4 h-[calc(100%-1rem)] w-px bg-border" />
                      )}
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-medium text-primary">{event.status}</div>
                          {event.note && (
                            <p className="text-sm text-muted-foreground mt-1 break-words">{event.note}</p>
                          )}
                          {event.location && (
                            <p className="text-xs text-muted-foreground mt-1"><strong>Location:</strong> {event.location.address}</p>
                          )}
                          {event.updatedBy && (
                            <p className="text-xs text-muted-foreground"><strong>Updated by:</strong> {event.updatedBy}</p>
                          )}
                        </div>
                        <div className="text-right text-xs text-muted-foreground shrink-0">
                          {event.timestamp && <p>{new Date(event.timestamp).toLocaleString()}</p>}
                          {event.createdAt && <p className="opacity-80">Created: {new Date(event.createdAt).toLocaleString()}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="mt-6">
          <CardContent className="py-12">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="inline-flex items-center justify-center rounded-full bg-muted size-12">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">No parcel found</h2>
              <p className="text-sm text-muted-foreground max-w-md">
                We couldn’t find a parcel for this tracking ID. Check the ID for typos or try again.
              </p>
              <div className="text-xs text-muted-foreground">
                Example format: <span className="font-medium">TRK-XXXX-XXXX</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}