'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { Send, ArrowLeft, Search, MessageSquare, Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  avatar_url?: string;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
}

interface Conversation {
  user: Profile;
  lastMessage: string;
  lastTime: string;
  unread: number;
}

export default function InboxClient({ profile }: { profile: Profile }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    setLoading(true);

    // Get all messages involving this user
    const { data: allMessages } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
      .order('created_at', { ascending: false });

    if (!allMessages || allMessages.length === 0) {
      setConversations([]);
      setLoading(false);
      return;
    }

    // Group by conversation partner
    const partnerIds = new Set<string>();
    allMessages.forEach((m) => {
      partnerIds.add(m.sender_id === profile.id ? m.receiver_id : m.sender_id);
    });

    // Fetch partner profiles
    const { data: partners } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url')
      .in('id', Array.from(partnerIds));

    const partnerMap = new Map((partners || []).map((p) => [p.id, p]));

    const convos: Conversation[] = Array.from(partnerIds).map((partnerId) => {
      const partnerMessages = allMessages.filter(
        (m) => m.sender_id === partnerId || m.receiver_id === partnerId
      );
      const latest = partnerMessages[0];
      const unread = partnerMessages.filter(
        (m) => m.receiver_id === profile.id && !m.read_at
      ).length;

      return {
        user: partnerMap.get(partnerId) || { id: partnerId, full_name: 'Unknown' },
        lastMessage: latest.content,
        lastTime: new Date(latest.created_at).toLocaleString('en-IN', {
          hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short',
        }),
        unread,
      };
    });

    setConversations(convos);
    setLoading(false);
  }, [profile.id]);

  const fetchMessages = useCallback(async (partnerId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${profile.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${profile.id})`
      )
      .order('created_at', { ascending: true });

    setMessages(data || []);

    // Mark unread as read
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('sender_id', partnerId)
      .eq('receiver_id', profile.id)
      .is('read_at', null);

    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [profile.id]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('messages-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `receiver_id=eq.${profile.id}`,
      }, (payload) => {
        const newMsg = payload.new as Message;
        if (selectedUser && newMsg.sender_id === selectedUser.id) {
          setMessages((prev) => [...prev, newMsg]);
          // Mark as read immediately
          supabase.from('messages').update({ read_at: new Date().toISOString() }).eq('id', newMsg.id);
        }
        fetchConversations();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile.id, selectedUser, fetchConversations]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    setSending(true);

    const { error } = await supabase.from('messages').insert({
      sender_id: profile.id,
      receiver_id: selectedUser.id,
      content: newMessage.trim(),
    });

    if (!error) {
      setNewMessage('');
      fetchMessages(selectedUser.id);
      fetchConversations();
    }
    setSending(false);
  };

  const selectConversation = (user: Profile) => {
    setSelectedUser(user);
    fetchMessages(user.id);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zoku-bg">
      <Navbar />
      <div className="pt-20 flex-1 flex">
        <div className="max-w-5xl mx-auto w-full flex border border-zoku-border rounded-2xl overflow-hidden m-4" style={{ height: 'calc(100vh - 6rem)' }}>
          {/* Conversations sidebar */}
          <div className={`w-full md:w-80 shrink-0 border-r border-zoku-border flex flex-col bg-zoku-card ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-zoku-border">
              <h2 className="text-lg font-black text-zoku-text mb-3 flex items-center gap-2">
                <MessageSquare size={18} className="text-purple-DEFAULT" /> Messages
              </h2>
              <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
                <Search size={14} className="text-muted" />
                <input placeholder="Search conversations..." className="bg-transparent text-sm text-zoku-text placeholder-muted outline-none w-full" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12"><Loader2 size={20} className="animate-spin text-purple-DEFAULT" /></div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-4xl mb-3">💬</div>
                  <p className="text-muted text-sm">No messages yet. Start a conversation from someone&apos;s profile!</p>
                </div>
              ) : (
                conversations.map((c) => (
                  <button
                    key={c.user.id}
                    onClick={() => selectConversation(c.user)}
                    className={`w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-all border-b border-zoku-border ${selectedUser?.id === c.user.id ? 'bg-purple-DEFAULT/10' : ''}`}
                  >
                    <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-purple-DEFAULT to-pink">
                      {c.user.avatar_url ? (
                        <Image src={c.user.avatar_url} alt={c.user.full_name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                          {c.user.full_name[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-zoku-text text-sm truncate">{c.user.full_name}</p>
                        <span className="text-xs text-muted shrink-0">{c.lastTime}</span>
                      </div>
                      <p className="text-xs text-muted truncate">{c.lastMessage}</p>
                    </div>
                    {c.unread > 0 && (
                      <span className="w-5 h-5 rounded-full bg-purple-DEFAULT text-white text-xs flex items-center justify-center font-bold shrink-0">{c.unread}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className={`flex-1 flex flex-col ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
            {selectedUser ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-zoku-border flex items-center gap-3 bg-zoku-card">
                  <button onClick={() => setSelectedUser(null)} className="md:hidden text-muted hover:text-white">
                    <ArrowLeft size={20} />
                  </button>
                  <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-purple-DEFAULT to-pink">
                    {selectedUser.avatar_url ? (
                      <Image src={selectedUser.avatar_url} alt={selectedUser.full_name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                        {selectedUser.full_name[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-zoku-text text-sm">{selectedUser.full_name}</p>
                    <p className="text-xs text-muted">Online</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg) => {
                    const isMine = msg.sender_id === profile.id;
                    return (
                      <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMine ? 'bg-purple-DEFAULT text-white rounded-br-md' : 'bg-zoku-card border border-zoku-border text-zoku-text rounded-bl-md'}`}>
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${isMine ? 'text-white/60' : 'text-muted'}`}>
                            {new Date(msg.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t border-zoku-border flex gap-2 bg-zoku-card">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 input-dark !rounded-xl"
                    disabled={sending}
                  />
                  <button type="submit" disabled={sending || !newMessage.trim()} className="btn-primary !px-4 !rounded-xl disabled:opacity-50">
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-bold text-white mb-2">Your Messages</h3>
                  <p className="text-muted text-sm">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
