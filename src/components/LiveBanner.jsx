"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Radio,
  Clock,
  CalendarDays,
  ArrowRight,
  Users,
  Play,
  CheckCircle2,
  Maximize,
  Minimize,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";

import { getApiBase } from "@/utils/api";
import { useAuth } from "@/context/AuthContext";

const API_BASE = getApiBase();

// ─── Helper: Format date/time nicely ─────────────────────────────────
function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(start, end) {
  if (!start || !end) return "—";
  const diff = new Date(end).getTime() - new Date(start).getTime();
  const hrs = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m`;
}

// ─── Live Now Banner (pulsing card) ──────────────────────────────────
function LiveNowBanner({ session }) {
  return (
    <Link
      href="/live"
      className="group block w-full rounded-lg border overflow-hidden transition-all hover:scale-[1.02] hover:shadow-2xl"
      style={{
        background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(239,68,68,0.03))",
        borderColor: "rgba(239,68,68,0.25)",
      }}
      id="live-now-banner"
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950 flex items-center justify-center border-b border-red-500/10">
        {session.thumbnailUrl ? (
          <img src={session.thumbnailUrl} alt={session.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <Radio size={36} className="text-red-500 animate-pulse" />
        )}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500 text-white text-[9px] font-extrabold uppercase tracking-wider shadow-md">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          LIVE NOW
        </div>
        {session.host && (
          <div className="absolute bottom-3 left-3 text-[9px] font-bold px-2 py-0.5 rounded bg-slate-950/70 text-slate-200 backdrop-blur-sm">
            by {session.host.username}
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-black leading-snug group-hover:text-red-500 transition-colors" style={{ color: "var(--text-primary)" }}>
          {session.title}
        </h3>
        {session.description && (
          <p className="text-[11px] line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {session.description}
          </p>
        )}
        
        {/* Join button */}
        <div className="pt-1">
          <div className="w-full flex items-center justify-center gap-1.5 py-2 rounded bg-red-500 text-white text-[10px] font-extrabold uppercase tracking-wider group-hover:bg-red-600 transition-colors shadow-md shadow-red-500/10">
            <Play size={12} />
            Join Stream
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Past Session Card (vertical card) ───────────────────────────────
function PastSessionCard({ session, onWatchRecording }) {
  return (
    <div
      className="group flex flex-col rounded-lg border overflow-hidden transition-all hover:shadow-md"
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}
    >
      {/* Thumbnail area */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-900/30 flex items-center justify-center border-b" style={{ borderColor: "var(--border-primary)" }}>
        {session.thumbnailUrl ? (
          <img src={session.thumbnailUrl} alt={session.title} className="w-full h-full object-cover opacity-80" />
        ) : (
          <CheckCircle2 size={24} style={{ color: "var(--text-accent)" }} />
        )}
        {session.host && (
          <div className="absolute bottom-2.5 left-2.5 text-[8px] font-bold px-1.5 py-0.5 rounded border bg-slate-950/60 backdrop-blur-sm text-slate-300"
            style={{ borderColor: "var(--border-primary)" }}
          >
            {session.host.username}
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
        <div className="space-y-1">
          <h4 className="text-xs font-extrabold line-clamp-2 leading-snug" style={{ color: "var(--text-primary)" }}>
            {session.title}
          </h4>
          {session.description && (
            <p className="text-[10px] line-clamp-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {session.description}
            </p>
          )}
        </div>
        
        <div className="space-y-3">
          {/* Metadata footer */}
          <div className="flex items-center gap-2.5 text-[9px] font-semibold pt-2 border-t" style={{ borderColor: "var(--border-primary)", color: "var(--text-muted)" }}>
            <span className="flex items-center gap-1">
              <CalendarDays size={10} />
              {formatDateTime(session.startedAt)}
            </span>
            {session.endedAt && (
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {formatDuration(session.startedAt, session.endedAt)}
              </span>
            )}
          </div>

          {/* Recording Link or Warning */}
          {session.recordingUrl ? (
            <button
              onClick={() => {
                const url = session.recordingUrl.startsWith('/') ? `${API_BASE}${session.recordingUrl}` : session.recordingUrl;
                onWatchRecording(url, session);
              }}
              className="flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-secondary)] text-[var(--text-on-accent)] text-[10px] font-extrabold uppercase tracking-wider transition-colors shadow-md shadow-[var(--accent-glow)] text-center cursor-pointer border border-transparent"
            >
              <Play size={10} />
              <span>Watch Recording</span>
            </button>
          ) : (session.egressSegments || (session.endedAt && (new Date() - new Date(session.endedAt)) < 180000)) ? (
            <div className="w-full text-center text-[9px] font-extrabold text-neutral-500 bg-neutral-500/10 py-2 rounded-lg border border-neutral-500/20 animate-pulse">
              Processing Recording...
            </div>
          ) : (
            <div className="w-full text-center text-[9px] font-bold text-[var(--text-muted)] bg-[var(--bg-secondary)] py-2 rounded-lg border border-dashed" style={{ borderColor: "var(--border-primary)" }}>
              No recordings for this session
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main LiveBanner Component ───────────────────────────────────────
export default function LiveBanner() {
  const { user } = useAuth();
  const [activeSession, setActiveSession] = useState(null);
  const [pastSessions, setPastSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [selectedVideoSession, setSelectedVideoSession] = useState(null);
  const [watermarkPos, setWatermarkPos] = useState({ top: "15%", left: "15%" });

  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!selectedVideoUrl) return;

    const handleFullscreenChange = () => {
      const currentFullscreenEl =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      const isCurrentlyFullscreen = !!currentFullscreenEl;
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [selectedVideoUrl]);

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    );

    if (!isCurrentlyFullscreen) {
      const requestFullscreen =
        container.requestFullscreen ||
        container.webkitRequestFullscreen ||
        container.mozRequestFullScreen ||
        container.msRequestFullscreen;

      if (requestFullscreen) {
        requestFullscreen.call(container).catch((err) => {
          console.error("Error entering container fullscreen:", err);
        });
      }
    } else {
      const exitFullscreen =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.mozCancelFullScreen ||
        document.msExitFullscreen;

      if (exitFullscreen) {
        exitFullscreen.call(document).catch(console.error);
      }
    }
  };

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!selectedVideoUrl) {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    } else {
      setIsPlaying(true);
    }
  }, [selectedVideoUrl]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(console.error);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
    }
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (videoRef.current) {
      videoRef.current.muted = nextMute;
      videoRef.current.volume = nextMute ? 0 : volume;
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "00:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!selectedVideoUrl) return;
    const interval = setInterval(() => {
      const top = Math.floor(Math.random() * 65) + 15; // 15% to 80%
      const left = Math.floor(Math.random() * 65) + 15; // 15% to 80%
      setWatermarkPos({ top: `${top}%`, left: `${left}%` });
    }, 10000); // Shift every 10 seconds
    return () => clearInterval(interval);
  }, [selectedVideoUrl]);

  useEffect(() => {
    fetchSessions();

    // Poll for active session every 30 seconds
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-poll recently ended sessions to fetch compilation status in real-time
  useEffect(() => {
    const hasProcessing = pastSessions.some(
      (s) => !s.recordingUrl && (s.egressSegments || (s.endedAt && (new Date() - new Date(s.endedAt)) < 180000))
    );

    if (!hasProcessing) return;

    const interval = setInterval(() => {
      fetchSessions();
    }, 6000); // Check every 6 seconds

    return () => clearInterval(interval);
  }, [pastSessions]);

  const fetchSessions = async () => {
    try {
      // Fetch active session
      const activeRes = await fetch(`${API_BASE}/api/livekit/session/active`);
      const activeData = await activeRes.json();

      if (activeData.success && activeData.session) {
        setActiveSession(activeData.session);
      } else {
        setActiveSession(null);
      }

      // Fetch all sessions for past sessions display
      const allRes = await fetch(`${API_BASE}/api/livekit/sessions`);
      const allData = await allRes.json();

      if (allData.success && allData.sessions) {
        // Filter only ended sessions (not live)
        const ended = allData.sessions.filter((s) => !s.isLive && s.endedAt);
        setPastSessions(ended.slice(0, 6)); // Show last 6
      }
    } catch (e) {
      // Silently fail — the banner just won't show if backend is down
      console.error("LiveBanner: Failed to fetch sessions", e);
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything while loading
  if (loading) return null;

  const noSessions = !activeSession && pastSessions.length === 0;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 relative z-40">
      {/* Section Header */}
      <div className="space-y-1 text-center md:text-left">
        <h2 className="text-2xl font-black font-display tracking-tight text-gradient">
          Live Classes & Speedruns
        </h2>
        <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
          Join live developer sessions, watch past streams, and learn in flow state.
        </p>
      </div>

      {noSessions ? (
        <div className="w-full rounded-lg border p-8 text-center space-y-4 max-w-md mx-auto"
          style={{ 
            backgroundColor: "var(--bg-card)", 
            borderColor: "var(--border-primary)",
            background: "linear-gradient(135deg, var(--bg-card), rgba(99,102,241,0.02))"
          }}
        >
          <div className="mx-auto w-12 h-12 rounded-lg flex items-center justify-center bg-slate-500/10 text-slate-400">
            <Radio size={24} className="opacity-60" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              No Active or Past Broadcasts
            </h3>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              There are no live streaming sessions or recorded broadcasts at the moment. Keep checkin' back!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Active Session Card */}
          {activeSession && (
            <div className="md:col-span-1 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-red-500">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Active Live Session
              </div>
              <LiveNowBanner session={activeSession} />
            </div>
          )}

          {/* Past Sessions Grid */}
          {pastSessions.length > 0 && (
            <div className={activeSession ? "md:col-span-2 space-y-3" : "md:col-span-3 space-y-3"}>
              <div className="flex items-center gap-2">
                <CalendarDays size={14} style={{ color: "var(--text-accent)" }} />
                <h3 className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                  Past Broadcasts
                </h3>
              </div>
              <div className={`grid gap-4 ${activeSession ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
                {pastSessions.map((session) => (
                  <PastSessionCard
                    key={session.id}
                    session={session}
                    onWatchRecording={(url, s) => {
                      setSelectedVideoUrl(url);
                      setSelectedVideoSession(s);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Custom Secure Video Modal Player */}
      {selectedVideoUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          onClick={() => setSelectedVideoUrl(null)}
        >
          <div 
            className="relative w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
              <span className="text-xs font-bold text-slate-300">Session Playback</span>
              <button 
                onClick={() => setSelectedVideoUrl(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>

            {/* Video Container */}
            <div 
              ref={containerRef}
              className={isFullscreen ? "relative w-full h-full bg-black flex items-center justify-center group" : "relative aspect-video bg-black flex items-center justify-center group"}
            >
              <video
                ref={videoRef}
                src={selectedVideoUrl}
                autoPlay
                crossOrigin="anonymous"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onContextMenu={(e) => e.preventDefault()}
                onClick={handlePlayPause}
                className="w-full h-full object-contain cursor-pointer"
              />
              
              {/* Custom controls overlay at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-4 py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2 pointer-events-auto">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-slate-700/60 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:h-1.5 transition-all"
                  style={{
                    background: `linear-gradient(to right, rgb(99, 102, 241) 0%, rgb(99, 102, 241) ${(currentTime / (duration || 1)) * 100}%, rgba(51, 65, 85, 0.6) ${(currentTime / (duration || 1)) * 100}%, rgba(51, 65, 85, 0.6) 100%)`
                  }}
                />
                <div className="flex items-center justify-between text-white text-xs select-none">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handlePlayPause}
                      className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                    <span className="font-mono text-[10px] text-slate-300">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button 
                      onClick={handleToggleMute}
                      className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-slate-700/60 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      style={{
                        background: `linear-gradient(to right, rgb(99, 102, 241) 0%, rgb(99, 102, 241) ${(isMuted ? 0 : volume) * 100}%, rgba(51, 65, 85, 0.6) ${(isMuted ? 0 : volume) * 100}%, rgba(51, 65, 85, 0.6) 100%)`
                      }}
                    />
                    <button 
                      onClick={toggleFullscreen}
                      className="p-1 rounded hover:bg-white/10 transition-colors cursor-pointer ml-1"
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Dynamic Watermark Overlay */}
              {user && selectedVideoSession?.showWatermark && (() => {
                const watermarkOptsArray = selectedVideoSession?.watermarkOptions?.split(',') || ["inst", "username", "email"];
                const showInst = watermarkOptsArray.includes("inst");
                const showUsername = watermarkOptsArray.includes("username");
                const showEmail = watermarkOptsArray.includes("email");

                return (
                  <div 
                    className="absolute z-10 pointer-events-none select-none text-slate-100 font-mono text-[9px] sm:text-xs bg-slate-950/20 backdrop-blur-[1px] px-2.5 py-1.5 rounded-lg border border-white/5 opacity-[0.16] shadow-sm"
                    style={{
                      top: watermarkPos.top,
                      left: watermarkPos.left,
                      transition: "top 2s ease-in-out, left 2s ease-in-out"
                    }}
                  >
                    {showInst && (user.institute?.name || user.role === "ADMIN") && (
                      <div className="text-[7px] sm:text-[9px] font-bold opacity-70 tracking-widest uppercase mb-0.5">
                        {user.role === "ADMIN" ? "EduVantix" : user.institute.name}
                      </div>
                    )}
                    {showUsername && (
                      <div className="font-black uppercase tracking-wider">{user.username}</div>
                    )}
                    {showEmail && (
                      <div className="text-[7px] sm:text-[9px] font-bold opacity-80 mt-0.5">{user.email}</div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
