import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useGetAllUsersQuery } from "@/redux/features/user/user.api"
import { TableLoadingSkeleton } from "@/components/ui/loading"
import { toast } from "sonner"

type DeliveryAgent = {
  address: string
  assignedParcels?: string[]
  auths?: unknown[]
  availableStatus?: string
  completedDeliveries?: number
  createdAt: string
  currentParcelId?: string | null
  email: string
  experienceLevel?: string
  isBlocked: boolean
  isDeleted: boolean
  licenseNumber?: string
  name: string
  password?: string
  phone: string
  role: "DELIVERY_AGENT" | string
  updatedAt: string
  vehicleType?: string
  _id?: string
}

function formatDate(iso?: string) {
  if (!iso) return "-"
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso as string
  }
}

export default function AllDeliveryAgent() {
  const { data: users, isLoading, isError } = useGetAllUsersQuery(undefined)

  const allDeliveryAgents: DeliveryAgent[] | undefined = users?.filter(
    (user: DeliveryAgent) => user.role === "DELIVERY_AGENT"
  )

  const handleBlockAgent = async (_agentId: string, isBlocked: boolean) => {
    try {
      // TODO: Implement block agent API call
      toast.success(`Delivery agent ${isBlocked ? 'unblocked' : 'blocked'} successfully`)
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${isBlocked ? 'unblock' : 'block'} delivery agent`)
    }
  }

  const handleDeleteAgent = async (_agentId: string) => {
    try {
      // TODO: Implement delete agent API call
      toast.success("Delivery agent deleted successfully")
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete delivery agent")
    }
  }

  if (isLoading) {
    return <div className="p-4"><TableLoadingSkeleton rows={6} /></div>
  }

  if (isError) {
    return <div className="p-4 text-red-600">Failed to load delivery agents.</div>
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Delivery Agents</h1>
        <span className="text-sm text-muted-foreground">
          Total: {allDeliveryAgents?.length ?? 0}
        </span>
      </div>

      <Table className="min-w-[720px]">
        <TableHeader>
          <TableRow>
            <TableHead>Agent</TableHead>
            <TableHead className="hidden lg:table-cell">Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Vehicle</TableHead>
            <TableHead className="hidden xl:table-cell">Experience</TableHead>
            <TableHead className="hidden md:table-cell">Completed</TableHead>
            <TableHead className="hidden xl:table-cell">Assigned</TableHead>
            <TableHead className="hidden 2xl:table-cell">Address</TableHead>
            <TableHead className="hidden 2xl:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allDeliveryAgents?.map((a) => (
            <TableRow key={a._id ?? a.email}>
              <TableCell className="max-w-[240px]">
                <div className="truncate" title={a.name}>{a.name}</div>
                <div className="text-xs text-muted-foreground truncate" title={a.email}>{a.email}</div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">{a.phone}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs ${a.availableStatus === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {a.availableStatus ?? 'UNKNOWN'}
                  </span>
                  {a.isBlocked && (
                    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs bg-amber-100 text-amber-800">
                      Blocked
                    </span>
                  )}
                  {a.isDeleted && (
                    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs bg-rose-100 text-rose-800">
                      Deleted
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell capitalize">{a.vehicleType ?? '-'}</TableCell>
              <TableCell className="hidden xl:table-cell capitalize">{a.experienceLevel ?? '-'}</TableCell>
              <TableCell className="hidden md:table-cell">{a.completedDeliveries ?? 0}</TableCell>
              <TableCell className="hidden xl:table-cell">{a.assignedParcels?.length ?? 0}</TableCell>
              <TableCell className="hidden 2xl:table-cell max-w-[320px] truncate" title={a.address}>{a.address}</TableCell>
              <TableCell className="hidden 2xl:table-cell">{formatDate(a.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant={a.isBlocked ? 'ghost' : 'secondary'} 
                    onClick={() => handleBlockAgent(a._id || '', a.isBlocked)}
                  >
                    {a.isBlocked ? 'Blocked' : 'Block'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteAgent(a._id || '')}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {(!allDeliveryAgents || allDeliveryAgents.length === 0) && (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-muted-foreground">
                No delivery agents found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableCaption>List of users with role DELIVERY_AGENT</TableCaption>
      </Table>
    </div>
  )
}