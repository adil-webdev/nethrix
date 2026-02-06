'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Ticket, TicketPriority, TicketCategory, TicketStatus } from '@/lib/types'
import { ROLE_LABELS } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'

interface EditTicketFormProps {
  profile: Profile
  ticket: Ticket
  teamMembers: Profile[]
}

export function EditTicketForm({ profile, ticket, teamMembers }: EditTicketFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(ticket.title)
  const [description, setDescription] = useState(ticket.description || '')
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority)
  const [category, setCategory] = useState<TicketCategory>(ticket.category)
  const [status, setStatus] = useState<TicketStatus>(ticket.status)
  const [assignedTo, setAssignedTo] = useState<string>(ticket.assigned_to || 'unassigned')
  const [income, setIncome] = useState<string>(ticket.income?.toString() || '0')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: updateError } = await supabase
        .from('tickets')
        .update({
          title,
          description: description || null,
          priority,
          category,
          status,
          assigned_to: assignedTo === 'unassigned' ? null : assignedTo,
          income: parseFloat(income) || 0,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticket.id)

      if (updateError) throw updateError
      router.push(`/dashboard/tickets/${ticket.id}`)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/tickets/${ticket.id}`}>
          <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Ticket</h1>
          <p className="mt-1 text-sm text-slate-500">Update ticket details</p>
        </div>
      </div>

      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">Ticket Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-slate-700">Title</Label>
              <Input
                id="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-slate-200 focus-visible:ring-rose-500"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-slate-700">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="border-slate-200 focus-visible:ring-rose-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label className="text-slate-700">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as TicketStatus)}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="text-slate-700">Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as TicketPriority)}>
                  <SelectTrigger className="border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="income" className="text-slate-700">Income ($)</Label>
                <Input
                  id="income"
                  type="number"
                  step="0.01"
                  min="0"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="border-slate-200 focus-visible:ring-rose-500"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-700">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as TicketCategory)}>
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-700">Assign To</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger className="border-slate-200">
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
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-rose-500 text-white hover:bg-rose-600"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Link href={`/dashboard/tickets/${ticket.id}`}>
                <Button type="button" variant="outline" className="border-slate-200 text-slate-600 bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
