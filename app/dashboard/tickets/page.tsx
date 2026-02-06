import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TicketsList } from '@/components/dashboard/tickets-list'
import type { Profile, Ticket } from '@/lib/types'

export default async function TicketsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  const isAdmin = profile.role === 'admin'

  let ticketsQuery = supabase
    .from('tickets')
    .select('*, assignee:profiles!tickets_assigned_to_fkey(*), creator:profiles!tickets_created_by_fkey(*)')
    .order('created_at', { ascending: false })

  if (!isAdmin) {
    ticketsQuery = ticketsQuery.eq('assigned_to', user.id)
  }

  const { data: tickets } = await ticketsQuery

  return (
    <TicketsList
      profile={profile as Profile}
      tickets={(tickets || []) as Ticket[]}
    />
  )
}
