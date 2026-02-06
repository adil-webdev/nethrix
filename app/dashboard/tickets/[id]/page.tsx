import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { TicketDetail } from '@/components/dashboard/ticket-detail'
import type { Profile, Ticket, TicketComment } from '@/lib/types'

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login')

  const { data: ticket } = await supabase
    .from('tickets')
    .select('*, assignee:profiles!tickets_assigned_to_fkey(*), creator:profiles!tickets_created_by_fkey(*)')
    .eq('id', id)
    .single()

  if (!ticket) notFound()

  const { data: comments } = await supabase
    .from('ticket_comments')
    .select('*, user:profiles!ticket_comments_user_id_fkey(*)')
    .eq('ticket_id', id)
    .order('created_at', { ascending: true })

  // Get team members for admin reassignment
  let teamMembers: Profile[] = []
  if (profile.role === 'admin') {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true })
    teamMembers = (data || []) as Profile[]
  }

  return (
    <TicketDetail
      profile={profile as Profile}
      ticket={ticket as Ticket}
      comments={(comments || []) as TicketComment[]}
      teamMembers={teamMembers}
    />
  )
}
