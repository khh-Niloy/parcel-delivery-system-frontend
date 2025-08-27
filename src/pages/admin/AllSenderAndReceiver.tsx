import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useGetAllUsersQuery } from '@/redux/features/user/user.api'
import { TableLoadingSkeleton } from '@/components/ui/loading'
import { toast } from 'sonner'

type AppUser = {
  address: string
  auths?: unknown[]
  createdAt: string
  email: string
  isBlocked: boolean
  isDeleted: boolean
  name: string
  password?: string
  phone: string
  role: 'SENDER' | 'RECEIVER' | string
  updatedAt: string
  _id?: string
}

function formatDate(iso?: string) {
  if (!iso) return '-'
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

export default function AllSenderAndReceiver() {
  const { data: users, isLoading, isError } = useGetAllUsersQuery(undefined)

  const allSenderAndReceiver: AppUser[] | undefined = users?.filter(
    (user: AppUser) => user.role === 'SENDER' || user.role === 'RECEIVER'
  )

  const handleBlockUser = async (userId: string, isBlocked: boolean) => {
    try {
      // TODO: Implement block user API call
      toast.success(`User ${isBlocked ? 'unblocked' : 'blocked'} successfully`)
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${isBlocked ? 'unblock' : 'block'} user`)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      // TODO: Implement delete user API call
      toast.success("User deleted successfully")
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete user")
    }
  }

  if (isLoading) {
    return <div className="p-4"><TableLoadingSkeleton rows={8} /></div>
  }

  if (isError) {
    return <div className="p-4 text-red-600">Failed to load users.</div>
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Senders & Receivers</h1>
        <span className="text-sm text-muted-foreground">
          Total: {allSenderAndReceiver?.length ?? 0}
        </span>
      </div>

      <Table className="min-w-[560px]"> 
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead className="hidden lg:table-cell">Phone</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="hidden xl:table-cell">Address</TableHead>
            <TableHead className="hidden 2xl:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allSenderAndReceiver?.map((u) => (
            <TableRow key={u._id ?? u.email}>
              <TableCell className="max-w-[220px]">
                <div className="truncate" title={u.name}>{u.name}</div>
                <div className="text-xs text-muted-foreground truncate" title={u.email}>{u.email}</div>
              </TableCell>
              <TableCell className="hidden lg:table-cell">{u.phone}</TableCell>
              <TableCell>{u.role}</TableCell>
              <TableCell className="hidden xl:table-cell max-w-[260px] truncate" title={u.address}>
                {u.address}
              </TableCell>
              <TableCell className="hidden 2xl:table-cell">{formatDate(u.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant={u.isBlocked ? 'ghost' : 'secondary'} 
                    onClick={() => handleBlockUser(u._id || '', u.isBlocked)}
                  >
                    {u.isBlocked ? 'Blocked' : 'Block'}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => handleDeleteUser(u._id || '')}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {(!allSenderAndReceiver || allSenderAndReceiver.length === 0) && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No sender or receiver users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableCaption>List of users with roles SENDER or RECEIVER</TableCaption>
      </Table>
    </div>
  )
}
