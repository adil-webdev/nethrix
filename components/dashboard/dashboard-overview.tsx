'use client'

import type { Profile, Ticket } from '@/lib/types'
import { ROLE_LABELS, STATUS_LABELS } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import {
  Ticket as TicketIcon,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  ArrowRight,
  DollarSign,
  TrendingUp,
} from 'lucide-react'

interface DashboardOverviewProps {
  profile: Profile
  tickets: Ticket[]
  teamMembers: Profile[]
}

export function DashboardOverview({ profile, tickets, teamMembers }: DashboardOverviewProps) {
  const isAdmin = profile.role === 'admin'

  const openCount = tickets.filter((t) => t.status === 'open').length
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length
  const completedCount = tickets.filter((t) => t.status === 'completed').length
  const urgentCount = tickets.filter((t) => t.priority === 'urgent').length

  // Calculate earnings
  const earnedIncome = tickets
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + (t.income || 0), 0)

  const estimatedIncome = tickets
    .filter((t) => t.status === 'in_progress' || t.status === 'open')
    .reduce((sum, t) => sum + (t.income || 0), 0)

  const recentTickets = tickets.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {isAdmin ? 'Admin Dashboard' : `${ROLE_LABELS[profile.role]} Dashboard`}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {isAdmin
            ? 'Overview of all tickets and team activity'
            : 'Your assigned tickets and activity'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <TicketIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Open</p>
              <p className="text-2xl font-bold text-slate-900">{openCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">In Progress</p>
              <p className="text-2xl font-bold text-slate-900">{inProgressCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Completed</p>
              <p className="text-2xl font-bold text-slate-900">{completedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50">
              <AlertTriangle className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{isAdmin ? 'Urgent' : 'Total'}</p>
              <p className="text-2xl font-bold text-slate-900">
                {isAdmin ? urgentCount : tickets.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Earned</p>
              <p className="text-2xl font-bold text-slate-900">${earnedIncome.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Est. Income</p>
              <p className="text-2xl font-bold text-slate-900">${estimatedIncome.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Tickets */}
        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-slate-900">Recent Tickets</CardTitle>
            <Link
              href="/dashboard/tickets"
              className="flex items-center gap-1 text-sm font-medium text-rose-500 hover:text-rose-600"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentTickets.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No tickets yet</p>
            ) : (
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/dashboard/tickets/${ticket.id}`}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex-1 truncate pr-4">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {ticket.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {ticket.assignee?.full_name || 'Unassigned'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={ticket.status} />
                      <PriorityDot priority={ticket.priority} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team or My Stats */}
        {isAdmin ? (
          <Card className="border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-slate-900">Team Members</CardTitle>
              <Link
                href="/dashboard/team"
                className="flex items-center gap-1 text-sm font-medium text-rose-500 hover:text-rose-600"
              >
                Manage
                <ArrowRight className="h-3 w-3" />
              </Link>
            </CardHeader>
            <CardContent>
              {teamMembers.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-400">
                  No team members yet
                </p>
              ) : (
                <div className="space-y-3">
                  {teamMembers.slice(0, 5).map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-xs font-medium text-rose-600">
                          {(member.full_name || member.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {member.full_name || member.email}
                          </p>
                          <p className="text-xs text-slate-500">{member.email}</p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-slate-100 text-xs text-slate-600"
                      >
                        {ROLE_LABELS[member.role]}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-900">Your Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-slate-400" />
                    <span className="text-sm text-slate-600">Total Assigned</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">
                    {tickets.length}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <span className="text-sm text-slate-600">In Progress</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">
                    {inProgressCount}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm text-slate-600">Completed</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">
                    {completedCount}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
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

function PriorityDot({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    low: 'bg-slate-400',
    medium: 'bg-blue-500',
    high: 'bg-amber-500',
    urgent: 'bg-rose-500',
  }
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${colors[priority] || 'bg-slate-400'}`}
      title={priority}
    />
  )
}
