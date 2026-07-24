"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Calendar, Download, Loader2, MoreVertical, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function OrganizerDashboard() {
  const { token, API_BASE } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      // In a real scenario, this would be an endpoint specifically for organizer events
      // For now, we'll fetch all events and filter (assuming backend auth rules return their events)
      const res = await fetch(`${API_BASE || process.env.NEXT_PUBLIC_API_URL || ''}/api/events`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        // Simple client-side mock filtering to simulate organizer view
        // Ideally backend would have /api/organizer/events
        setEvents(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch events", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if(!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`${API_BASE || process.env.NEXT_PUBLIC_API_URL || ''}/api/events/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok) {
        setEvents(events.filter(e => e.id !== id));
      }
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 text-[var(--text-primary)]">
            Organizer Dashboard
          </h1>
          <p className="text-[var(--text-secondary)]">
            Manage your events, view registrations, and download attendee lists.
          </p>
        </div>
        
        <Link 
          href="/events/organizer/create"
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[var(--accent-primary)]/20"
        >
          <Plus size={18} />
          Create Event
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center h-64 items-center"><Loader2 className="animate-spin text-[var(--accent-primary)]" size={32}/></div>
      ) : (
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[var(--bg-hover)]/50 border-b border-[var(--border-primary)]">
                <tr>
                  <th className="px-6 py-4 font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs">Event Name</th>
                  <th className="px-6 py-4 font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs">Date</th>
                  <th className="px-6 py-4 font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs">Status</th>
                  <th className="px-6 py-4 font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs">Type</th>
                  <th className="px-6 py-4 font-bold text-[var(--text-muted)] uppercase tracking-wider text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-primary)]">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-[var(--bg-hover)]/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--text-primary)]">{event.title}</div>
                      <div className="text-xs text-[var(--text-secondary)] truncate max-w-[250px]">{event.venue}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
                      {new Date(event.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]">
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-[var(--bg-hover)] text-[var(--text-secondary)] border border-[var(--border-primary)]">
                        {event.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/events/${event.id}`} className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 rounded-lg transition-colors">
                          <Users size={18} />
                        </Link>
                        <button className="p-2 text-[var(--text-secondary)] hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => deleteEvent(event.id)} className="p-2 text-[var(--text-secondary)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {events.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-secondary)]">
                      No events created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
