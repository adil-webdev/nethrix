import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import type { Profile, Ticket } from '@/lib/types'

export default async function DashboardPage() {
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

  // Admin sees all tickets, others see their assigned tickets
  let ticketsQuery = supabase
    .from('tickets')
    .select('*, assignee:profiles!tickets_assigned_to_fkey(*), creator:profiles!tickets_created_by_fkey(*)')
    .order('created_at', { ascending: false })

  if (!isAdmin) {
    ticketsQuery = ticketsQuery.eq('assigned_to', user.id)
  }

  const { data: tickets } = await ticketsQuery

  // Get team members for admin
  let teamMembers: Profile[] = []
  if (isAdmin) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    teamMembers = (data || []) as Profile[]
  }

  return (
    <DashboardOverview
      profile={profile as Profile}
      tickets={(tickets || []) as Ticket[]}
      teamMembers={teamMembers}
    />
  )
}
