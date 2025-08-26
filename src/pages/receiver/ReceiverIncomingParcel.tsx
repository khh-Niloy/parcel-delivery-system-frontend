import { useIncomingParcelsQuery, useUpdateParcelStatusMutation } from "@/redux/features/parcel/parcel.api"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusFlow } from "@/contant/StatusFlow"
import { useUserInfoQuery } from "@/redux/features/auth/auth.api"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export default function ReceiverIncomingParcel() {

    // NOTE: Using admin list for now; ideally there should be an endpoint for agent-assigned parcels
    const { data, isLoading, isError } = useIncomingParcelsQuery(undefined)
    const { data: meData } = useUserInfoQuery(undefined)

    const parcels: any[] = Array.isArray(data?.data) ? data?.data : []
    const [updateParcel, { isLoading: isUpdating }] = useUpdateParcelStatusMutation()
    const [openDetailsIds, setOpenDetailsIds] = useState<Set<string>>(new Set())
    const [notes, setNotes] = useState<{ [key: string]: string }>({})

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

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-6">My Parcels</h1>
            <Table>
                <TableCaption>Parcels relevant to your deliveries.</TableCaption>
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
                        const hasTrackingEvents = Array.isArray(p?.trackingEvents) && p.trackingEvents.length > 0

                        const currentStatus: string = p?.status
                        const nextStatuses: string[] = Array.isArray(StatusFlow[currentStatus]?.next) ? StatusFlow[currentStatus].next : []
                        const allowedRolesForCurrent: string[] = Array.isArray(StatusFlow[currentStatus]?.allowedRoles) ? StatusFlow[currentStatus].allowedRoles : []
                        const userRole: string | undefined = meData?.data?.role

                        // Delivery agent can change status only if allowed by the flow for current status
                        const canChangeThisStatus = userRole ? allowedRolesForCurrent.includes(userRole) : false

                        const handleChangeStatus = async (nextStatus: string) => {
                            try {
                                const note = notes[p?.trackingId] || ""
                                const payload = {
                                    trackingId: p?.trackingId,
                                    status: nextStatus,
                                    note: note,
                                    updatedBy: meData?.data?.role
                                }
                                const res = await updateParcel(payload).unwrap()
                                if (res?.success) {
                                    toast.success("Status updated successfully")
                                }
                                setNotes(prev => {
                                    const newNotes = { ...prev }
                                    delete newNotes[p?.trackingId]
                                    return newNotes
                                })
                            } catch (error) {
                                console.error(error)
                                toast.error("Failed to update status")
                            }
                        }

                        return (
                            <>
                                <TableRow key={p?.trackingId ?? p?._id}>
                                    <TableCell className="font-medium">{p?.trackingId}</TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div><strong>Type:</strong> {p?.type}</div>
                                            <div><strong>Weight:</strong> {p?.weight} kg</div>
                                            <div><strong>Fee:</strong> ৳{p?.fee}</div>
                                            <div className="text-xs text-muted-foreground">
                                                <div>Sender: {p?.senderId?.name || p?.senderId?.email || 'N/A'}</div>
                                                <div>Receiver: {p?.receiverId?.phone || 'N/A'}</div>
                                            </div>
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
                                                    p?.status === 'DISPATCHED' ? 'bg-indigo-100 text-indigo-800' :
                                                    p?.status === 'IN_TRANSIT' ? 'bg-purple-100 text-purple-800' :
                                                    p?.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                    p?.status === 'RETURNED' ? 'bg-orange-100 text-orange-800' :
                                                    p?.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                    p?.status === 'BLOCKED' ? 'bg-gray-200 text-gray-800' :
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
                                        <div className="flex items-center gap-2">
                                            <select
                                                className="border rounded px-2 py-1 text-sm"
                                                value={currentStatus}
                                                onChange={(e) => handleChangeStatus(e.target.value)}
                                                disabled={isUpdating || nextStatuses.length === 0 || !canChangeThisStatus}
                                            >
                                                <option value={currentStatus}>{currentStatus}</option>
                                                {nextStatuses.map((ns) => (
                                                    <option key={ns} value={ns}>{ns}</option>
                                                ))}
                                            </select>
                                            <Input
                                                type="text"
                                                placeholder="Add note..."
                                                value={notes[p?.trackingId] || ""}
                                                onChange={(e) => setNotes(prev => ({
                                                    ...prev,
                                                    [p?.trackingId]: e.target.value
                                                }))}
                                                className="w-32 text-sm"
                                                disabled={isUpdating || nextStatuses.length === 0 || !canChangeThisStatus}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {hasTrackingEvents && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="p-0">
                                            <Card className="m-4">
                                                <CardHeader className="flex justify-between items-center">
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