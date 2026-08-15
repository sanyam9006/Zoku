import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createServerClient()

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle()

  const role = profile?.role || session.user.user_metadata?.role || (session.user.email?.includes('owner') ? 'owner' : session.user.email?.includes('admin') ? 'admin' : 'user')

  if (role !== 'owner' && role !== 'admin') {
    redirect('/')
  }

  const fallbackProfile = {
    id: session.user.id,
    full_name: session.user.user_metadata?.full_name || 'Property Owner',
    role: role,
    city: session.user.user_metadata?.city || 'Bangalore',
  }

  return <DashboardClient profile={profile || fallbackProfile} />
}
