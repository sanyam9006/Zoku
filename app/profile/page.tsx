import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileClient from './ProfileClient'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
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

  const fallbackProfile = {
    id: session.user.id,
    full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
    city: session.user.user_metadata?.city || 'Bangalore',
    role: session.user.user_metadata?.role || 'user',
    avatar_url: session.user.user_metadata?.avatar_url || null,
    college: session.user.user_metadata?.college || 'Bangalore University',
    company: session.user.user_metadata?.company || 'Zoku Explorer',
    hometown: session.user.user_metadata?.hometown || 'Jaipur',
    bio: session.user.user_metadata?.bio || 'Looking to connect and find my tribe!',
    interests: session.user.user_metadata?.interests || ['Tech', 'Sports', 'Fitness'],
    user_type: session.user.user_metadata?.user_type || 'student',
  }

  return <ProfileClient initialProfile={profile || fallbackProfile} />
}
