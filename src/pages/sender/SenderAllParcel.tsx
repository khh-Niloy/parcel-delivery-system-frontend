import { useAllSenderParcelQuery } from "@/redux/features/parcel/parcel.api"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Link } from "react-router"
import { useState } from "react"

export default function SenderAllParcel() {

    const { data, isLoading, isError } = useAllSenderParcelQuery(undefined)
    const parcels: any[] = Array.isArray(data) ? data : Array.isArray((data as any)?.data) ? (data as any).data : []

    const [openDetailsIds, setOpenDetailsIds] = useState<Set<string>>(new Set())

    const toggleDetailsFor = (id?: string) => {
        if (!id) return
        setOpenDetailsIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (isError) {
        return <div>Failed to load parcels.</div>
    }

    if (!parcels.length) {
        return <div>No parcels found.</div>
    }

    console.log(parcels)

    return (
        <div className="w-full">
            <Table>
                <TableCaption>All parcels you have created.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tracking ID</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Addresses</TableHead>
                        <TableHead>Status & Dates</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {parcels.map((p) => {
                        const canUpdate = p?.status === "REQUESTED" || p?.status === "APPROVED" || p?.status === "CANCELLED"
                        const canCancel = p?.status === "REQUESTED" || p?.status === "APPROVED"
                        const hasTrackingEvents = Array.isArray(p?.trackingEvents) && p.trackingEvents.length > 0
                        
                        return (
                            <>
                                <TableRow key={p?.trackingId ?? p?._id}>
                                    <TableCell className="font-medium">{p?.trackingId}</TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div><strong>Type:</strong> {p?.type}</div>
                                            <div><strong>Weight:</strong> {p?.weight} kg</div>
                                            <div><strong>Fee:</strong> ৳{p?.fee}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1 max-w-xs">
                                            <div>
                                                <strong>From:</strong> 
                                                <span className="text-sm text-muted-foreground block truncate" title={p?.pickupAddress}>
                                                    {p?.pickupAddress}
                                                </span>
                                            </div>
                                            <div>
                                                <strong>To:</strong> 
                                                <span className="text-sm text-muted-foreground block truncate" title={p?.deliveryAddress}>
                                                    {p?.deliveryAddress}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div>
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                    p?.status === 'REQUESTED' ? 'bg-yellow-100 text-yellow-800' :
                                                    p?.status === 'APPROVED' ? 'bg-blue-100 text-blue-800' :
                                                    p?.status === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-800' :
                                                    p?.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                    p?.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {p?.status}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                <div>Delivery: {p?.deliveryDate ? format(new Date(p.deliveryDate), "MMM dd") : "-"}</div>
                                                <div>Created: {p?.createdAt ? format(new Date(p.createdAt), "MMM dd") : "-"}</div>
                                                <div>Updated: {p?.updatedAt ? format(new Date(p.updatedAt), "MMM dd") : "-"}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Link to={`/sender/update-parcel/${p?.trackingId}`}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={!canUpdate}
                                                title={!canUpdate ? `Cannot update when status is ${p?.status}` : undefined}
                                            >
                                                Update
                                            </Button>
                                            </Link>
                                            <Link to={`/sender/delete-parcel/${p?.trackingId}`}>
                                            <Button variant="destructive" size="sm" disabled={!canCancel}>Cancel</Button>
                                            </Link>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {hasTrackingEvents && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="p-0">
                                            <Card className="m-4">
                                                <CardHeader>
                                                    <CardTitle className="text-lg">Tracking Events</CardTitle>
                                                    <Button onClick={() => toggleDetailsFor(p?.trackingId)}>
                                                        {openDetailsIds.has(p?.trackingId) ? "Hide Details" : "See Details"}
                                                    </Button>
                                                </CardHeader>
                                                {openDetailsIds.has(p?.trackingId) && (
                                                    <CardContent>
                                                        <div className="space-y-4">
                                                            {p.trackingEvents.map((event: any, index: number) => (
                                                                <div key={index} className="border-l-4 border-primary pl-4 py-2">
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <h4 className="font-semibold text-primary">{event.status}</h4>
                                                                            <p className="text-sm text-muted-foreground mt-1">{event.note}</p>
                                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                                <strong>Location:</strong> {event.location}
                                                                            </p>
                                                                            <p className="text-sm text-muted-foreground">
                                                                                <strong>Updated by:</strong> {event.updatedBy}
                                                                            </p>
                                                                        </div>
                                                                        <div className="text-right text-sm text-muted-foreground">
                                                                            <p>{format(new Date(event.timestamp), "PPp")}</p>
                                                                            <p className="text-xs">Created: {format(new Date(event.createdAt), "PPp")}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </CardContent>
                                                )}
                                            </Card>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}