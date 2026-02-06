import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { TeamManagement } from '@/components/dashboard/team-management'
import type { Profile } from '@/lib/types'

export default async function TeamPage() {
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

  const { data: teamMembers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <TeamManagement
      profile={profile as Profile}
      teamMembers={(teamMembers || []) as Profile[]}
    />
  )
}
