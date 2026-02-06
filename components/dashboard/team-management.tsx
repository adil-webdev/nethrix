'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, UserRole } from '@/lib/types'
import { ROLE_LABELS } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface TeamManagementProps {
  profile: Profile
  teamMembers: Profile[]
}

export function TeamManagement({ profile, teamMembers }: TeamManagementProps) {
  const router = useRouter()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleRoleChange = async (memberId: string, newRole: UserRole) => {
    setUpdatingId(memberId)
    const supabase = createClient()
    await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', memberId)
    router.refresh()
    setUpdatingId(null)
  }

  const roleCounts = teamMembers.reduce(
    (acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Team Management</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage team members and their roles
        </p>
      </div>

      {/* Role stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.entries(ROLE_LABELS) as [UserRole, string][]).map(([role, label]) => (
          <Card key={role} className="border-slate-200">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50">
                <Users className="h-5 w-5 text-rose-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-xl font-bold text-slate-900">{roleCounts[role] || 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team table */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">
            All Members ({teamMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 hover:bg-transparent">
                  <TableHead className="text-slate-500">Member</TableHead>
                  <TableHead className="text-slate-500">Email</TableHead>
                  <TableHead className="text-slate-500">Role</TableHead>
                  <TableHead className="text-slate-500">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id} className="border-slate-100">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-rose-100 text-xs text-rose-600">
                            {(member.full_name || member.email)[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-slate-900">
                          {member.full_name || 'No name'}
                        </span>
                        {member.id === profile.id && (
                          <Badge variant="secondary" className="bg-rose-50 text-xs text-rose-600">
                            You
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-600">{member.email}</span>
                    </TableCell>
                    <TableCell>
                      {member.id === profile.id ? (
                        <Badge variant="secondary" className="bg-slate-100 text-xs text-slate-600">
                          {ROLE_LABELS[member.role]}
                        </Badge>
                      ) : (
                        <Select
                          value={member.role}
                          onValueChange={(v) => handleRoleChange(member.id, v as UserRole)}
                          disabled={updatingId === member.id}
                        >
                          <SelectTrigger className="h-8 w-48 border-slate-200 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="developer">Developer</SelectItem>
                            <SelectItem value="social_media_manager">Social Media Manager</SelectItem>
                            <SelectItem value="client_manager">Client Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-500">
                        {formatDistanceToNow(new Date(member.created_at), { addSuffix: true })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
