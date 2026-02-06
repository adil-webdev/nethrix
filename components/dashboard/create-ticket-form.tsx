'use client'

import React from "react"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, TicketPriority, TicketCategory } from '@/lib/types'
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
import Link from 'next/link'

interface CreateTicketFormProps {
  profile: Profile
  teamMembers: Profile[]
}

export function CreateTicketForm({ profile, teamMembers }: CreateTicketFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('medium')
  const [category, setCategory] = useState<TicketCategory>('general')
  const [assignedTo, setAssignedTo] = useState<string>('')
  const [income, setIncome] = useState<string>('0')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      const { error: insertError } = await supabase.from('tickets').insert({
        title,
        description: description || null,
        priority,
        category,
        assigned_to: assignedTo || null,
        created_by: profile.id,
        income: parseFloat(income) || 0,
      })

      if (insertError) throw insertError
      router.push('/dashboard/tickets')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create ticket')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/tickets">
          <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create Ticket</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create a new ticket and assign it to a team member
          </p>
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
                placeholder="Brief description of the issue"
                className="border-slate-200 focus-visible:ring-rose-500"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="text-slate-700">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide more details about the ticket..."
                rows={4}
                className="border-slate-200 focus-visible:ring-rose-500"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
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
                <Label htmlFor="income" className="text-slate-700">Income ($)</Label>
                <Input
                  id="income"
                  type="number"
                  step="0.01"
                  min="0"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="0.00"
                  className="border-slate-200 focus-visible:ring-rose-500"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label className="text-slate-700">Assign To</Label>
              <Select value={assignedTo} onValueChange={setAssignedTo}>
                <SelectTrigger className="border-slate-200">
                  <SelectValue placeholder="Select a team member" />
                </SelectTrigger>
                <SelectContent>
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
                {isLoading ? 'Creating...' : 'Create Ticket'}
              </Button>
              <Link href="/dashboard/tickets">
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
