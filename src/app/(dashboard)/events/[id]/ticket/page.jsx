"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Download, MapPin, Calendar as CalendarIcon, Clock } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function TicketPage() {
  const params = useParams();
  const { token, API_BASE } = useAuth();
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const ticketRef = useRef(null);

  useEffect(() => {
    fetchTicket();
  }, [params.id]);

  const fetchTicket = async () => {
    try {
      const res = await fetch(`${API_BASE || process.env.NEXT_PUBLIC_API_URL || ''}/api/events/${params.id}/ticket`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTicketData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch ticket", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadTicket = async () => {
    if (!ticketRef.current) return;
    
    // Fallback if not loaded
    const capture = () => {
      window.html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: '#0a0a0a',
        useCORS: true
      }).then(canvas => {
        const link = document.createElement('a');
        link.download = `Ticket_${ticketData.event.title.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }).catch(err => {
        console.error("Failed to capture ticket", err);
        alert("Failed to download ticket. Please try again.");
      });
    };

    if (!window.html2canvas) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      script.async = true;
      script.onload = capture;
      document.body.appendChild(script);
    } else {
      capture();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-[var(--accent-primary)]" size={48} />
      </div>
    );
  }

  if (!ticketData) {
    return <div className="p-10 text-center">No ticket found. You might be waitlisted or not registered.</div>;
  }

  const { event, user, qrToken } = ticketData;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 md:p-10 flex flex-col items-center">
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <Link href={`/events/${params.id}`} className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
          <ArrowLeft size={20} />
          <span className="font-semibold">Back</span>
        </Link>
        <button 
          onClick={downloadTicket}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-primary)] text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[var(--accent-primary)]/20"
        >
          <Download size={18} />
          Download Ticket
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-full max-w-2xl bg-[var(--bg-card)] border-2 border-[var(--border-primary)] rounded-[2.5rem] overflow-hidden shadow-2xl relative"
        ref={ticketRef}
      >
        {/* Ticket Header Image */}
        <div className="h-48 relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-800">
          {event.bannerUrl && (
            <img src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent"></div>
          
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white font-bold text-xs uppercase tracking-wider border border-white/10">
              Eduvantix Event
            </span>
            {event.isOnline && (
              <span className="px-3 py-1 bg-green-500/80 backdrop-blur-md rounded-lg text-white font-bold text-xs border border-white/20 shadow-lg">
                ONLINE
              </span>
            )}
          </div>
        </div>

        {/* Notches for ticket effect */}
        <div className="absolute top-48 -left-4 w-8 h-8 rounded-full bg-[var(--bg-primary)] border-r-2 border-[var(--border-primary)] z-20"></div>
        <div className="absolute top-48 -right-4 w-8 h-8 rounded-full bg-[var(--bg-primary)] border-l-2 border-[var(--border-primary)] z-20"></div>
        
        {/* Dashed line */}
        <div className="absolute top-48 left-6 right-6 h-0 border-t-2 border-dashed border-[var(--border-primary)] z-10"></div>

        {/* Ticket Content */}
        <div className="p-8 md:p-10 pt-12 flex flex-col md:flex-row gap-10">
          
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-3xl font-black text-[var(--text-primary)] leading-tight mb-2">
                {event.title}
              </h2>
              <div className="text-[var(--accent-primary)] font-semibold text-sm">
                Admit One
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-primary)]">
                  <CalendarIcon size={18} />
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Date</div>
                  <div className="font-semibold text-sm">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-primary)]">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Time</div>
                  <div className="font-semibold text-sm">{new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <div className="w-10 h-10 rounded-xl bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-primary)]">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider">Venue</div>
                  <div className="font-semibold text-sm truncate max-w-[200px]">{event.isOnline ? 'Online via Link' : event.venue}</div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--border-primary)]">
              <div className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-wider mb-1">Attendee</div>
              <div className="font-bold text-lg text-[var(--text-primary)]">{user.fullName}</div>
              {user.institute && (
                <div className="text-sm text-[var(--text-secondary)]">{user.institute.name}</div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center md:border-l md:border-[var(--border-primary)] md:pl-10 relative">
            <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4">Scan for Entry</div>
            
            {/* QR Code fetched from api.qrserver.com */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrToken}`} 
                alt="Ticket QR Code" 
                className="w-40 h-40"
              />
            </div>
            
            <div className="mt-4 text-[10px] font-mono text-[var(--text-muted)] bg-[var(--bg-hover)] px-3 py-1.5 rounded-lg border border-[var(--border-primary)]">
              {qrToken.split('-')[0].toUpperCase()}
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
