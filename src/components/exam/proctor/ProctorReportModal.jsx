"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { buildAuthHeaders, getApiBase } from "@/utils/api";
import {
  X, AlertTriangle, Clock, Shield, ChevronDown, ChevronUp,
  Eye, Users, Camera, Sun, Mic, Activity, Filter, Image
} from "lucide-react";

/**
 * ProctorReportModal — Instructor view of proctoring events for one exam attempt.
 * Shows compressed timeline, summary cards, risk score, and filter bar.
 *
 * Props:
 *   sessionId: string
 *   studentName: string
 *   onClose(): void
 */

const FLAG_CONFIG = {
  NO_FACE:                 { icon: Eye,           color: "#ef4444", label: "No Face" },
  MULTIPLE_FACE:           { icon: Users,         color: "#f97316", label: "Multiple Faces" },
  LOOK_AWAY_LONG:          { icon: Eye,           color: "#f59e0b", label: "Look Away" },
  MOUTH_MOVEMENT:          { icon: Mic,           color: "#8b5cf6", label: "Talking" },
  LOW_LIGHT:               { icon: Sun,           color: "#64748b", label: "Low Light" },
  BLURRY_CAMERA:           { icon: Camera,        color: "#475569", label: "Blur" },
  CAMERA_BLOCKED:          { icon: Camera,        color: "#ef4444", label: "Camera Blocked" },
  TAB_HIDDEN:              { icon: Activity,      color: "#f59e0b", label: "Tab Hidden" },
  TAB_RESTORED:            { icon: Activity,      color: "#22c55e", label: "Tab Restored" },
  WINDOW_BLUR:             { icon: Activity,      color: "#64748b", label: "Window Blur" },
  NETWORK_LOST:            { icon: Activity,      color: "#ef4444", label: "Network Lost" },
  CAMERA_DISCONNECTED:     { icon: Camera,        color: "#ef4444", label: "Camera Disconnected" },
  CAMERA_PERMISSION_DENIED:{ icon: Camera,        color: "#ef4444", label: "Permission Denied" },
  CONSENT_DECLINED:        { icon: Shield,        color: "#f97316", label: "Consent Declined" },
};

const SEVERITY_COLORS = {
  HIGH:   { bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.3)",   text: "#ef4444", badge: "#ef4444" },
  MEDIUM: { bg: "rgba(245,158,11,0.1)",   border: "rgba(245,158,11,0.25)", text: "#f59e0b", badge: "#f59e0b" },
  LOW:    { bg: "rgba(100,116,139,0.08)", border: "rgba(100,116,139,0.2)", text: "#64748b", badge: "#64748b" },
};

function fmtDuration(s) {
  if (!s) return "—";
  return s >= 60 ? `${Math.floor(s / 60)}m ${Math.round(s % 60)}s` : `${Math.round(s)}s`;
}

function fmtTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function RiskBadge({ score }) {
  const band = score < 20 ? "LOW" : score < 50 ? "MEDIUM" : "HIGH";
  const colors = { LOW: "#22c55e", MEDIUM: "#f59e0b", HIGH: "#ef4444" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: `conic-gradient(${colors[band]} ${score * 3.6}deg, #1e293b 0deg)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "#0f1117",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.9rem", fontWeight: 700, color: colors[band],
        }}>{score}</div>
      </div>
      <div>
        <div style={{ fontSize: "0.7rem", color: "#64748b" }}>Advisory Risk</div>
        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: colors[band] }}>{band}</div>
      </div>
    </div>
  );
}

export default function ProctorReportModal({ sessionId, studentName, onClose }) {
  const { user, token } = useAuth();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedFlags, setExpandedFlags] = useState(new Set());

  // Filters
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [filterFlag, setFilterFlag] = useState("ALL");
  const [filterMinDuration, setFilterMinDuration] = useState(0);
  const [filterHasImage, setFilterHasImage] = useState("ALL");

  const API_BASE = getApiBase();

  useEffect(() => {
    if (!sessionId) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = buildAuthHeaders(token, user);
        const res = await fetch(`${API_BASE}/api/v1/proctor/report/${sessionId}`, { headers });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || "Failed to load report");
        setReport(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sessionId, token, user]);

  const toggleExpand = (flag) => {
    setExpandedFlags((prev) => {
      const next = new Set(prev);
      next.has(flag) ? next.delete(flag) : next.add(flag);
      return next;
    });
  };

  // Filtered timeline
  const filteredTimeline = report?.timeline?.filter((ev) => {
    if (filterSeverity !== "ALL" && ev.severity !== filterSeverity) return false;
    if (filterFlag !== "ALL" && ev.flag !== filterFlag) return false;
    if (filterMinDuration > 0 && (ev.duration_s || 0) < filterMinDuration) return false;
    if (filterHasImage === "WITH" && !ev.thumbnail_path) return false;
    if (filterHasImage === "WITHOUT" && ev.thumbnail_path) return false;
    return true;
  }) || [];

  return (
    <div className="pr-overlay">
      <div className="pr-modal">
        {/* Header */}
        <div className="pr-header">
          <div>
            <h2 className="pr-title">
              <Shield size={18} /> Proctor Report
            </h2>
            <p className="pr-subtitle">{studentName}</p>
          </div>
          <button className="pr-close" onClick={onClose}><X size={20} /></button>
        </div>

        {loading && (
          <div className="pr-loading">
            <div className="pr-spinner" />
            <span>Loading report…</span>
          </div>
        )}

        {error && (
          <div className="pr-error">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {report && !loading && (
          <>
            {/* Summary strip */}
            <div className="pr-summary-strip">
              <RiskBadge score={Math.round(report.risk_score)} />
              <div className="pr-stat">
                <div className="pr-stat-value">{report.raw_event_count}</div>
                <div className="pr-stat-label">Total Events</div>
              </div>
              <div className="pr-stat">
                <div className="pr-stat-value">{report.reconnect_count}</div>
                <div className="pr-stat-label">Reconnects</div>
              </div>
              <div className="pr-stat">
                <div className="pr-stat-value" style={{ color: report.consent_given ? "#22c55e" : "#ef4444" }}>
                  {report.consent_given ? "Yes" : "No"}
                </div>
                <div className="pr-stat-label">Consent</div>
              </div>
            </div>

            {/* Summary cards (compressed) */}
            {report.summary?.length > 0 && (
              <div className="pr-section">
                <h3 className="pr-section-title">Event Summary</h3>
                <div className="pr-summary-grid">
                  {report.summary.map((item) => {
                    const cfg = FLAG_CONFIG[item.flag] || { label: item.flag, color: "#64748b" };
                    const sev = SEVERITY_COLORS[item.severity] || SEVERITY_COLORS.LOW;
                    const isExpanded = expandedFlags.has(item.flag);
                    const rawEvents = filteredTimeline.filter((e) => e.flag === item.flag);

                    return (
                      <div key={item.flag} className="pr-summary-card" style={{ borderColor: sev.border, background: sev.bg }}>
                        <div className="pr-summary-card-header" onClick={() => toggleExpand(item.flag)}>
                          <span style={{ color: cfg.color, fontWeight: 700, fontSize: "0.8rem" }}>
                            {cfg.label}
                          </span>
                          <span className="pr-badge" style={{ background: sev.badge + "22", color: sev.badge }}>
                            {item.severity}
                          </span>
                          <div className="pr-summary-stats">
                            <span>{item.occurrences} ×</span>
                            <span>Total: {fmtDuration(item.total_duration_s)}</span>
                            <span>Longest: {fmtDuration(item.longest_duration_s)}</span>
                          </div>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>

                        {isExpanded && rawEvents.length > 0 && (
                          <div className="pr-raw-events">
                            {rawEvents.map((ev) => (
                              <div key={ev.id} className="pr-raw-event">
                                <Clock size={11} />
                                <span>{fmtTime(ev.started_at)}</span>
                                <span>→</span>
                                <span>{fmtTime(ev.ended_at)}</span>
                                {ev.duration_s != null && <span className="pr-dur">{fmtDuration(ev.duration_s)}</span>}
                                {ev.thumbnail_path && <Image size={11} style={{ color: "#6366f1" }} title="Has image" />}
                                <span className="pr-conf">{Math.round(ev.confidence * 100)}%</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter bar */}
            <div className="pr-filter-bar">
              <Filter size={13} />
              <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
                <option value="ALL">All Severities</option>
                <option value="HIGH">HIGH only</option>
                <option value="MEDIUM">MEDIUM+</option>
              </select>
              <select value={filterFlag} onChange={(e) => setFilterFlag(e.target.value)}>
                <option value="ALL">All Types</option>
                {Object.entries(FLAG_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
              <select value={filterMinDuration} onChange={(e) => setFilterMinDuration(Number(e.target.value))}>
                <option value={0}>Any Duration</option>
                <option value={5}>&gt; 5s</option>
                <option value={10}>&gt; 10s</option>
                <option value={30}>&gt; 30s</option>
              </select>
              <select value={filterHasImage} onChange={(e) => setFilterHasImage(e.target.value)}>
                <option value="ALL">All Images</option>
                <option value="WITH">With Image</option>
                <option value="WITHOUT">Without Image</option>
              </select>
            </div>

            {/* Raw timeline */}
            <div className="pr-section">
              <h3 className="pr-section-title">Timeline ({filteredTimeline.length} events)</h3>
              {filteredTimeline.length === 0 ? (
                <p className="pr-empty">No events match the current filters.</p>
              ) : (
                <div className="pr-timeline">
                  {filteredTimeline.map((ev) => {
                    const cfg = FLAG_CONFIG[ev.flag] || { label: ev.flag, color: "#64748b" };
                    const sev = SEVERITY_COLORS[ev.severity] || SEVERITY_COLORS.LOW;
                    return (
                      <div key={ev.id} className="pr-timeline-row" style={{ borderLeftColor: cfg.color }}>
                        <div className="pr-tl-time">{fmtTime(ev.started_at)}</div>
                        <div className="pr-tl-flag" style={{ color: cfg.color }}>{cfg.label}</div>
                        <div className="pr-tl-meta">
                          <span className="pr-badge" style={{ background: sev.badge + "22", color: sev.badge }}>{ev.severity}</span>
                          {ev.duration_s != null && <span>{fmtDuration(ev.duration_s)}</span>}
                          <span className="pr-conf">{Math.round(ev.confidence * 100)}%</span>
                          {ev.thumbnail_path && <Image size={11} style={{ color: "#6366f1" }} title="Thumbnail available" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        .pr-overlay {
          position: fixed; inset: 0; z-index: 10000;
          background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; padding: 1rem;
        }
        .pr-modal {
          background: #0f1117; border: 1px solid #2a2f3e; border-radius: 1rem;
          width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto;
          display: flex; flex-direction: column; gap: 0;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6);
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: none; opacity: 1; } }
        .pr-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 1.25rem 1.5rem; border-bottom: 1px solid #1e293b; position: sticky; top: 0;
          background: #0f1117; z-index: 1;
        }
        .pr-title { display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem; font-weight: 700; color: #f1f5f9; margin: 0 0 0.25rem; }
        .pr-subtitle { font-size: 0.8rem; color: #64748b; margin: 0; }
        .pr-close { background: none; border: none; color: #475569; cursor: pointer; padding: 0.25rem; border-radius: 0.4rem; }
        .pr-close:hover { color: #f1f5f9; background: #1e293b; }
        .pr-loading, .pr-error { display: flex; align-items: center; gap: 0.75rem; padding: 2rem 1.5rem; color: #64748b; font-size: 0.875rem; }
        .pr-error { color: #ef4444; }
        .pr-spinner { width: 20px; height: 20px; border: 2px solid #1e293b; border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .pr-summary-strip { display: flex; align-items: center; gap: 1.5rem; padding: 1rem 1.5rem; border-bottom: 1px solid #1e293b; flex-wrap: wrap; }
        .pr-stat { text-align: center; }
        .pr-stat-value { font-size: 1.4rem; font-weight: 700; color: #f1f5f9; }
        .pr-stat-label { font-size: 0.7rem; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
        .pr-section { padding: 1rem 1.5rem; }
        .pr-section-title { font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 0.75rem; }
        .pr-summary-grid { display: flex; flex-direction: column; gap: 0.5rem; }
        .pr-summary-card { border: 1px solid; border-radius: 0.5rem; overflow: hidden; }
        .pr-summary-card-header { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.875rem; cursor: pointer; flex-wrap: wrap; }
        .pr-summary-card-header:hover { background: rgba(255,255,255,0.02); }
        .pr-badge { font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 999px; }
        .pr-summary-stats { display: flex; gap: 0.75rem; font-size: 0.75rem; color: #64748b; margin-left: auto; flex-wrap: wrap; }
        .pr-raw-events { background: rgba(0,0,0,0.2); padding: 0.5rem 0.875rem; display: flex; flex-direction: column; gap: 0.35rem; border-top: 1px solid rgba(255,255,255,0.05); }
        .pr-raw-event { display: flex; align-items: center; gap: 0.4rem; font-size: 0.72rem; color: #64748b; }
        .pr-dur { font-weight: 600; color: #94a3b8; }
        .pr-conf { font-size: 0.68rem; color: #475569; margin-left: auto; }
        .pr-filter-bar { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-top: 1px solid #1e293b; border-bottom: 1px solid #1e293b; background: #0a0c12; flex-wrap: wrap; }
        .pr-filter-bar select { background: #1e293b; border: 1px solid #2a3444; color: #94a3b8; font-size: 0.75rem; padding: 0.3rem 0.5rem; border-radius: 0.4rem; cursor: pointer; }
        .pr-filter-bar svg { color: #475569; flex-shrink: 0; }
        .pr-timeline { display: flex; flex-direction: column; gap: 0.35rem; }
        .pr-timeline-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 0.75rem; border-left: 2px solid; border-radius: 0 0.4rem 0.4rem 0; background: rgba(255,255,255,0.025); font-size: 0.75rem; flex-wrap: wrap; }
        .pr-tl-time { color: #475569; font-size: 0.7rem; min-width: 56px; }
        .pr-tl-flag { font-weight: 600; }
        .pr-tl-meta { display: flex; align-items: center; gap: 0.5rem; margin-left: auto; color: #64748b; flex-wrap: wrap; }
        .pr-empty { color: #475569; font-size: 0.8rem; padding: 1rem 0; }
      `}</style>
    </div>
  );
}
