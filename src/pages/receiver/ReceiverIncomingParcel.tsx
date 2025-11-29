import { useIncomingParcelsQuery, useUpdateParcelStatusMutation } from "@/redux/features/parcel/parcel.api"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { StatusFlow } from "@/contant/StatusFlow"
import { useUserInfoQuery } from "@/redux/features/auth/auth.api"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ChevronDown, ChevronRight } from "lucide-react"
import { TableLoadingSkeleton } from "@/components/ui/loading"

export default function ReceiverIncomingParcel() {

    // NOTE: Using admin list for now; ideally there should be an endpoint for agent-assigned parcels
    const { data, isLoading, isError, refetch } = useIncomingParcelsQuery(undefined)
    const { data: meData } = useUserInfoQuery(undefined)

    const parcels: any[] = Array.isArray(data?.data) ? data?.data : []
    const [updateParcel, { isLoading: isUpdating }] = useUpdateParcelStatusMutation()
    const [openDetailsIds, setOpenDetailsIds] = useState<Set<string>>(new Set())
    const [notes, setNotes] = useState<{ [key: string]: string }>({})
    const [updatingParcel, setUpdatingParcel] = useState<string | null>(null)

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
        return <TableLoadingSkeleton rows={6} />
    }

    if (isError) {
        return <div>Failed to load parcels.</div>
    }

    if (!parcels.length) {
        return <div>No parcels found.</div>
    }

    return (
        <div className="w-full">
            <h1 className="text-2xl font-bold mb-6">Incoming Parcels</h1>
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
                        const nextStatuses: string[] = Array.isArray(StatusFlow[currentStatus as keyof typeof StatusFlow]?.next) ? StatusFlow[currentStatus as keyof typeof StatusFlow].next : []
                        const allowedRolesForCurrent: string[] = Array.isArray(StatusFlow[currentStatus as keyof typeof StatusFlow]?.allowedRoles) ? StatusFlow[currentStatus as keyof typeof StatusFlow].allowedRoles : []
                        const userRole: string | undefined = meData?.data?.role

                        // Delivery agent can change status only if allowed by the flow for current status
                        const canChangeThisStatus = userRole ? allowedRolesForCurrent.includes(userRole) : false

                        const handleChangeStatus = async (nextStatus: string) => {
                            try {
                                setUpdatingParcel(p?.trackingId)
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
                                    // Refetch data to update the table
                                    refetch()
                                }
                                setNotes(prev => {
                                    const newNotes = { ...prev }
                                    delete newNotes[p?.trackingId]
                                    return newNotes
                                })
                            } catch (error: any) {
                                toast.error(error?.data?.message || "Failed to update status")
                                console.error(error)
                            } finally {
                                setUpdatingParcel(null)
                            }
                        }

                        return (
                            <>
                                <TableRow key={(p?.trackingId ?? p?._id) + "-main"}>
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col gap-1">
                                            <span>{p?.trackingId}</span>
                                            {hasTrackingEvents && (
                                                <button
                                                    type="button"
                                                    className="text-xs text-primary inline-flex items-center gap-1 w-fit"
                                                    onClick={() => toggleDetailsFor(p?.trackingId)}
                                                >
                                                    {openDetailsIds.has(p?.trackingId) ? (
                                                        <>
                                                            <span>Hide tracking events</span>
                                                            <ChevronDown className="h-3.5 w-3.5" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>See tracking events</span>
                                                            <ChevronRight className="h-3.5 w-3.5" />
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="text-sm"><strong>Type:</strong> {p?.type} • <strong>Weight:</strong> {p?.weight} kg • <strong>Fee:</strong> ৳{p?.fee}</div>
                                            <div className="text-xs text-muted-foreground">
                                                <span>Sender: {p?.senderId?.name || p?.senderId?.email || 'N/A'}</span>
                                                <span className="mx-2">•</span>
                                                <span>Receiver: {p?.receiverId?.phone || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div>
                                                <strong>From:</strong> 
                                                <span className="text-sm text-muted-foreground block whitespace-pre-wrap break-words" title={p?.pickupAddress}>
                                                    {p?.pickupAddress}
                                                </span>
                                            </div>
                                            <div>
                                                <strong>To:</strong> 
                                                <span className="text-sm text-muted-foreground block whitespace-pre-wrap break-words" title={p?.deliveryAddress}>
                                                    {p?.deliveryAddress}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full ring-1 ring-inset ${
                                                    p?.status === 'REQUESTED' ? 'bg-amber-50 text-amber-700 ring-amber-200/50' :
                                                    p?.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/50' :
                                                    p?.status === 'DISPATCHED' ? 'bg-purple-50 text-purple-700 ring-purple-200/50' :
                                                    p?.status === 'IN_TRANSIT' ? 'bg-blue-50 text-blue-700 ring-blue-200/50' :
                                                    p?.status === 'DELIVERED' ? 'bg-green-50 text-green-700 ring-green-200/50' :
                                                    p?.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/50' :
                                                    p?.status === 'RETURNED' ? 'bg-orange-50 text-orange-700 ring-orange-200/50' :
                                                    p?.status === 'BLOCKED' ? 'bg-red-50 text-red-700 ring-red-200/50' :
                                                    p?.status === 'CANCELLED' ? 'bg-red-50 text-red-700 ring-red-200/50' :
                                                    'bg-gray-50 text-gray-700 ring-gray-200/50'
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
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    className="border rounded-md px-3 py-1.5 text-sm bg-background ring-1 ring-border focus:ring-2 focus:ring-ring transition-shadow"
                                                    value={currentStatus}
                                                    onChange={(e) => handleChangeStatus(e.target.value)}
                                                    disabled={isUpdating || updatingParcel === p?.trackingId || nextStatuses.length === 0 || !canChangeThisStatus}
                                                >
                                                    <option value={currentStatus}>
                                                        {updatingParcel === p?.trackingId ? "Updating..." : currentStatus}
                                                    </option>
                                                    {nextStatuses.map((ns) => (
                                                        <option key={ns} value={ns}>{ns}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="text"
                                                    placeholder="Add note..."
                                                    value={notes[p?.trackingId] || ""}
                                                    onChange={(e) => setNotes(prev => ({
                                                        ...prev,
                                                        [p?.trackingId]: e.target.value
                                                    }))}
                                                    className="w-40 text-sm"
                                                    disabled={isUpdating || updatingParcel === p?.trackingId || nextStatuses.length === 0 || !canChangeThisStatus}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {hasTrackingEvents && openDetailsIds.has(p?.trackingId) && (
                                    <TableRow key={(p?.trackingId ?? p?._id) + "-details"}>
                                        <TableCell colSpan={5} className="bg-muted/30 p-4">
                                            <div className="space-y-4">
                                                <div className="text-sm font-semibold">Tracking Events</div>
                                                <div className="space-y-4">
                                                    {p.trackingEvents.map((event: any, index: number) => {
                                                        const isLast = index === p.trackingEvents.length - 1
                                                        return (
                                                            <div key={index} className="relative pl-6">
                                                                <span className="absolute left-0 top-2 h-2 w-2 rounded-full bg-primary" />
                                                                {!isLast && (
                                                                    <span className="absolute left-[3px] top-4 h-[calc(100%-1rem)] w-px bg-border" />
                                                                )}
                                                                <div className="flex items-start justify-between gap-4">
                                                                    <div className="min-w-0">
                                                                        <div className="font-medium text-primary">{event.status}</div>
                                                                        {event.note && (
                                                                            <p className="text-sm text-muted-foreground mt-1 break-words">{event.note}</p>
                                                                        )}
                                                                        {event.location && (
                                                                            <p className="text-xs text-muted-foreground mt-1"><strong>Location:</strong> {event.location}</p>
                                                                        )}
                                                                        {event.updatedBy && (
                                                                            <p className="text-xs text-muted-foreground"><strong>Updated by:</strong> {event.updatedBy}</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-right text-xs text-muted-foreground shrink-0">
                                                                        {event.timestamp && <p>{format(new Date(event.timestamp), "PPp")}</p>}
                                                                        {event.createdAt && <p className="opacity-80">Created: {format(new Date(event.createdAt), "PPp")}</p>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
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