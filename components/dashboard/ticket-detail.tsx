'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Ticket, TicketComment, TicketStatus } from '@/lib/types'
import {
  STATUS_LABELS,
  PRIORITY_LABELS,
  CATEGORY_LABELS,
  ROLE_LABELS,
} from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  ArrowLeft,
  Clock,
  User,
  Tag,
  AlertTriangle,
  Send,
  Trash2,
  Edit,
  DollarSign,
} from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'

interface TicketDetailProps {
  profile: Profile
  ticket: Ticket
  comments: TicketComment[]
  teamMembers: Profile[]
}

export function TicketDetail({
  profile,
  ticket,
  comments,
  teamMembers,
}: TicketDetailProps) {
  const router = useRouter()
  const isAdmin = profile.role === 'admin'
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newStatus: TicketStatus) => {
    setIsUpdating(true)
    const supabase = createClient()
    await supabase
      .from('tickets')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', ticket.id)
    router.refresh()
    setIsUpdating(false)
  }

  const handleAssigneeChange = async (assigneeId: string) => {
    setIsUpdating(true)
    const supabase = createClient()
    await supabase
      .from('tickets')
      .update({
        assigned_to: assigneeId === 'unassigned' ? null : assigneeId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', ticket.id)
    router.refresh()
    setIsUpdating(false)
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setIsSubmitting(true)
    const supabase = createClient()
    await supabase.from('ticket_comments').insert({
      ticket_id: ticket.id,
      user_id: profile.id,
      content: newComment.trim(),
    })
    setNewComment('')
    router.refresh()
    setIsSubmitting(false)
  }

  const handleDelete = async () => {
    const supabase = createClient()
    await supabase.from('tickets').delete().eq('id', ticket.id)
    router.push('/dashboard/tickets')
    router.refresh()
  }

  const statusStyles: Record<string, string> = {
    open: 'bg-blue-50 text-blue-700',
    in_progress: 'bg-amber-50 text-amber-700',
    completed: 'bg-emerald-50 text-emerald-700',
    closed: 'bg-slate-100 text-slate-600',
  }

  const priorityStyles: Record<string, string> = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-blue-50 text-blue-700',
    high: 'bg-amber-50 text-amber-700',
    urgent: 'bg-rose-50 text-rose-700',
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href="/dashboard/tickets">
            <Button
              variant="ghost"
              size="icon"
              className="mt-1 text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{ticket.title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              Created {formatDistanceToNow(new Date(ticket.created_at), { addSuffix: true })}
              {ticket.creator && ` by ${ticket.creator.full_name || ticket.creator.email}`}
            </p>
          </div>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <Link href={`/dashboard/tickets/${ticket.id}/edit`}>
              <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 bg-transparent">
                <Edit className="mr-1.5 h-3.5 w-3.5" />
                Edit
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent">
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Ticket</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this ticket? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Description */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                {ticket.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          {/* Status Actions */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {ticket.status === 'open' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange('in_progress')}
                    disabled={isUpdating}
                    className="bg-amber-500 text-white hover:bg-amber-600"
                  >
                    Start Working
                  </Button>
                )}
                {ticket.status === 'in_progress' && (
                  <Button
                    size="sm"
                    onClick={() => handleStatusChange('completed')}
                    disabled={isUpdating}
                    className="bg-emerald-500 text-white hover:bg-emerald-600"
                  >
                    Mark Complete
                  </Button>
                )}
                {ticket.status === 'completed' && !isAdmin && (
                  <p className="text-sm text-slate-500">This ticket is completed.</p>
                )}
                {isAdmin && ticket.status !== 'closed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange('closed')}
                    disabled={isUpdating}
                    className="border-slate-200 text-slate-600"
                  >
                    Close Ticket
                  </Button>
                )}
                {isAdmin && ticket.status === 'closed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange('open')}
                    disabled={isUpdating}
                    className="border-slate-200 text-slate-600"
                  >
                    Reopen Ticket
                  </Button>
                )}
                {isAdmin && (ticket.status === 'completed' || ticket.status === 'in_progress') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange('open')}
                    disabled={isUpdating}
                    className="border-slate-200 text-slate-600"
                  >
                    Move to Open
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">
                Comments ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-400">
                  No comments yet. Be the first to comment.
                </p>
              )}
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-slate-100 p-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-xs font-medium text-rose-600">
                      {(comment.user?.full_name || comment.user?.email || '?')[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {comment.user?.full_name || comment.user?.email || 'Unknown'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{comment.content}</p>
                </div>
              ))}

              <Separator className="bg-slate-100" />

              <form onSubmit={handleAddComment} className="space-y-3">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  className="border-slate-200 focus-visible:ring-rose-500"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !newComment.trim()}
                  className="bg-rose-500 text-white hover:bg-rose-600"
                >
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="h-4 w-4" />
                  Status
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs ${statusStyles[ticket.status] || ''}`}
                >
                  {STATUS_LABELS[ticket.status]}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <DollarSign className="h-4 w-4" />
                  Income
                </div>
                <span className="font-semibold text-slate-900">${ticket.income?.toFixed(2) || '0.00'}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <AlertTriangle className="h-4 w-4" />
                  Priority
                </div>
                <Badge
                  variant="secondary"
                  className={`text-xs ${priorityStyles[ticket.priority] || ''}`}
                >
                  {PRIORITY_LABELS[ticket.priority]}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Tag className="h-4 w-4" />
                  Category
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {CATEGORY_LABELS[ticket.category]}
                </span>
              </div>

              <Separator className="bg-slate-100" />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <User className="h-4 w-4" />
                  Assignee
                </div>
                {isAdmin ? (
                  <Select
                    value={ticket.assigned_to || 'unassigned'}
                    onValueChange={handleAssigneeChange}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="border-slate-200 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.full_name || member.email} ({ROLE_LABELS[member.role]})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm font-medium text-slate-700">
                    {ticket.assignee?.full_name || ticket.assignee?.email || 'Unassigned'}
                  </p>
                )}
              </div>

              <Separator className="bg-slate-100" />

              <div className="space-y-1 text-xs text-slate-500">
                <p>
                  Created:{' '}
                  {format(new Date(ticket.created_at), 'MMM d, yyyy h:mm a')}
                </p>
                <p>
                  Updated:{' '}
                  {format(new Date(ticket.updated_at), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
