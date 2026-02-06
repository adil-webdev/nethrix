'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Profile, Ticket, TicketStatus, TicketPriority } from '@/lib/types'
import { STATUS_LABELS, PRIORITY_LABELS, CATEGORY_LABELS } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Plus, Search, X } from 'lucide-react'
import { formatDistanceToNow, isWithinInterval, startOfDay, endOfDay } from 'date-fns'

interface TicketsListProps {
  profile: Profile
  tickets: Ticket[]
}

export function TicketsList({ profile, tickets }: TicketsListProps) {
  const isAdmin = profile.role === 'admin'
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  const filtered = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      (ticket.description || '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter

    let matchesDate = true
    if (startDate || endDate) {
      const ticketDate = new Date(ticket.created_at)
      if (startDate && endDate) {
        matchesDate = isWithinInterval(ticketDate, {
          start: startOfDay(new Date(startDate)),
          end: endOfDay(new Date(endDate)),
        })
      } else if (startDate) {
        matchesDate = ticketDate >= startOfDay(new Date(startDate))
      } else if (endDate) {
        matchesDate = ticketDate <= endOfDay(new Date(endDate))
      }
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesDate
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tickets</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isAdmin ? 'Manage all tickets' : 'Your assigned tickets'}
          </p>
        </div>
        {isAdmin && (
          <Link href="/dashboard/tickets/new">
            <Button className="bg-rose-500 text-white hover:bg-rose-600">
              <Plus className="mr-2 h-4 w-4" />
              New Ticket
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search tickets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-slate-200 pl-9 focus-visible:ring-rose-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full border-slate-200 sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {(Object.entries(STATUS_LABELS) as [TicketStatus, string][]).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full border-slate-200 sm:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  {(Object.entries(PRIORITY_LABELS) as [TicketPriority, string][]).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-600">From Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-slate-200 focus-visible:ring-rose-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-600">To Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-slate-200 focus-visible:ring-rose-500"
                />
              </div>
              {(startDate || endDate) && (
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStartDate('')
                      setEndDate('')
                    }}
                    className="border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <X className="mr-1 h-4 w-4" />
                    Clear Dates
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-slate-400">No tickets found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 hover:bg-transparent">
                    <TableHead className="text-slate-500">Title</TableHead>
                    <TableHead className="text-slate-500">Status</TableHead>
                    <TableHead className="text-slate-500">Priority</TableHead>
                    <TableHead className="text-slate-500">Category</TableHead>
                    <TableHead className="text-slate-500">Income</TableHead>
                    <TableHead className="text-slate-500">Assignee</TableHead>
                    <TableHead className="text-slate-500">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((ticket) => (
                    <TableRow
                      key={ticket.id}
                      className="cursor-pointer border-slate-100 hover:bg-slate-50"
                    >
                      <TableCell>
                        <Link
                          href={`/dashboard/tickets/${ticket.id}`}
                          className="font-medium text-slate-900 hover:text-rose-600"
                        >
                          {ticket.title}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ticket.status} />
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={ticket.priority} />
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {CATEGORY_LABELS[ticket.category]}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-slate-900">
                          ${ticket.income?.toFixed(2) || '0.00'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-600">
                          {ticket.assignee?.full_name || 'Unassigned'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-slate-500">
                          {formatDistanceToNow(new Date(ticket.created_at), {
                            addSuffix: true,
                          })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: 'bg-blue-50 text-blue-700',
    in_progress: 'bg-amber-50 text-amber-700',
    completed: 'bg-emerald-50 text-emerald-700',
    closed: 'bg-slate-100 text-slate-600',
  }
  return (
    <Badge variant="secondary" className={`text-xs ${styles[status] || ''}`}>
      {STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status}
    </Badge>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-blue-50 text-blue-700',
    high: 'bg-amber-50 text-amber-700',
    urgent: 'bg-rose-50 text-rose-700',
  }
  return (
    <Badge variant="secondary" className={`text-xs ${styles[priority] || ''}`}>
      {PRIORITY_LABELS[priority as keyof typeof PRIORITY_LABELS] || priority}
    </Badge>
  )
}
