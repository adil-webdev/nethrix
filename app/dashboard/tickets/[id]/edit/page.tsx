import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { EditTicketForm } from '@/components/dashboard/edit-ticket-form'
import type { Profile, Ticket } from '@/lib/types'

export default async function EditTicketPage({
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

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  const { data: ticket } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', id)
    .single()

  if (!ticket) notFound()

  const { data: teamMembers } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name', { ascending: true })

  return (
    <EditTicketForm
      profile={profile as Profile}
      ticket={ticket as Ticket}
      teamMembers={(teamMembers || []) as Profile[]}
    />
  )
}
