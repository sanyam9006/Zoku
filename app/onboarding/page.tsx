'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { MapPin, Briefcase, GraduationCap, Home, Heart, ChevronRight, Loader2 } from 'lucide-react'

const INTEREST_TAGS = [
  'Tech', 'Music', 'Sports', 'Photography', 'Travel', 'Art', 
  'Fitness', 'Gaming', 'Cooking', 'Hiking', 'Networking', 'Reading'
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    city: 'Bangalore',
    user_type: 'student',
    college: '',
    company: '',
    hometown: '',
    interests: [] as string[]
  })

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      setFormData(prev => ({
        ...prev,
        full_name: user.user_metadata?.full_name || '',
        city: user.user_metadata?.city || 'Bangalore'
      }))
    }
    getUser()
  }, [router])

  const toggleInterest = (tag: string) => {
    setFormData(prev => {
      if (prev.interests.includes(tag)) {
        return { ...prev, interests: prev.interests.filter(i => i !== tag) }
      }
      if (prev.interests.length >= 5) return prev
      return { ...prev, interests: [...prev.interests, tag] }
    })
  }

  async function handleFinish() {
    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({
        ...formData,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      router.push('/profile')
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-zoku-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full glow-card p-8">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                s <= step ? 'bg-purple-DEFAULT' : 'bg-zoku-border'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Basic */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-2xl font-black text-zoku-text mb-2">Welcome to ZOKU! 族</h1>
            <p className="text-muted text-sm mb-6">Let&apos;s set up your profile to help you find your tribe.</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">Full Name</label>
                <input 
                  type="text" 
                  className="input-dark" 
                  value={formData.full_name}
                  onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Your display name"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">Current City</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <select 
                    className="input-dark !pl-10"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                  >
                    <option value="Bangalore">Bangalore</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Pune">Pune</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: User Type */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-2xl font-black text-zoku-text mb-2">What brings you here?</h1>
            <p className="text-muted text-sm mb-6">This helps us show you relevant people and events.</p>
            
            <div className="grid grid-cols-1 gap-3">
              {[
                { id: 'student', label: 'Student', icon: GraduationCap, bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                { id: 'professional', label: 'Working Professional', icon: Briefcase, bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
                { id: 'remote', label: 'Digital Nomad / Remote', icon: Home, bg: 'bg-green-500/10', border: 'border-green-500/20' }
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setFormData({ ...formData, user_type: type.id })}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    formData.user_type === type.id 
                    ? 'border-purple-DEFAULT bg-purple-DEFAULT/5 shadow-lg shadow-purple-DEFAULT/10' 
                    : 'border-zoku-border hover:border-purple-DEFAULT/30 bg-zoku-card'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${type.bg} ${type.border}`}>
                      <type.icon size={24} className="text-zoku-text" />
                    </div>
                    <span className="font-bold text-zoku-text">{type.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Origin */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-2xl font-black text-zoku-text mb-2">A bit more about you</h1>
            <p className="text-muted text-sm mb-6">Help others connect with you through shared roots.</p>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">
                  {formData.user_type === 'student' ? 'College / University' : 'Company / Workplace'}
                </label>
                <input 
                  type="text" 
                  className="input-dark" 
                  value={formData.user_type === 'student' ? formData.college : formData.company}
                  onChange={e => setFormData({ 
                    ...formData, 
                    [formData.user_type === 'student' ? 'college' : 'company']: e.target.value 
                  })}
                  placeholder={formData.user_type === 'student' ? "IIT Bangalore, etc." : "Google, Startup, etc."}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1.5 block">Hometown</label>
                <input 
                  type="text" 
                  className="input-dark" 
                  value={formData.hometown}
                  onChange={e => setFormData({ ...formData, hometown: e.target.value })}
                  placeholder="Where are you originally from?"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Interests */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-2xl font-black text-zoku-text mb-2">What do you love?</h1>
            <p className="text-muted text-sm mb-6">Select up to 5 interests to find like-minded people.</p>
            
            <div className="flex flex-wrap gap-2">
              {INTEREST_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleInterest(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    formData.interests.includes(tag)
                    ? 'bg-purple-DEFAULT text-white shadow-md shadow-purple-DEFAULT/20'
                    : 'bg-zoku-card border border-zoku-border text-muted hover:border-purple-DEFAULT/50'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-10">
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="flex-1 py-3 px-4 rounded-xl border border-zoku-border text-zoku-text font-bold hover:bg-zoku-card2 transition-colors"
            >
              Back
            </button>
          )}
          
          {step < 4 ? (
            <button 
              onClick={() => setStep(step + 1)}
              className="flex-[2] btn-primary flex items-center justify-center gap-2"
            >
              Next Step <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              onClick={handleFinish}
              disabled={loading}
              className="flex-[2] btn-primary flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Finish & Explore 🎉'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
