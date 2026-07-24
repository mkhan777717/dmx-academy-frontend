"use client";

import { useState } from "react";
import { ShieldCheck, ShieldAlert, Eye, EyeOff, Lock } from "lucide-react";

/**
 * ConsentModal — Shown once before webcam monitoring begins.
 * Props:
 *   onAccept(): void
 *   onDecline(): void
 *   examTitle: string
 */
export default function ConsentModal({ onAccept, onDecline, examTitle = "this exam" }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="proctor-consent-overlay">
      <div className="proctor-consent-modal">
        {/* Header */}
        <div className="proctor-consent-header">
          <div className="proctor-consent-icon">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h2 className="proctor-consent-title">Exam Monitoring Notice</h2>
            <p className="proctor-consent-subtitle">Required for {examTitle}</p>
          </div>
        </div>

        {/* Summary */}
        <p className="proctor-consent-intro">
          This exam uses <strong>AI-assisted proctoring</strong> to monitor webcam activity.
          Monitoring is <strong>advisory only</strong> — no automated decisions will be made.
          All flagged events are reviewed by your instructor.
        </p>

        {/* What is monitored */}
        <div className="proctor-consent-list">
          <h3 className="proctor-consent-list-title">What is monitored:</h3>
          <ul>
            <li><Eye size={14} /><span>Webcam video (no audio by default)</span></li>
            <li><Eye size={14} /><span>Face presence and head orientation</span></li>
            <li><Eye size={14} /><span>Browser tab visibility changes</span></li>
            <li><Eye size={14} /><span>Window focus/blur events</span></li>
          </ul>
        </div>

        {/* What is NOT monitored */}
        <div className="proctor-consent-list proctor-consent-list--safe">
          <h3 className="proctor-consent-list-title">What is NOT monitored:</h3>
          <ul>
            <li><EyeOff size={14} /><span>Audio (disabled by default)</span></li>
            <li><EyeOff size={14} /><span>Screen content or keystrokes</span></li>
            <li><EyeOff size={14} /><span>Files on your device</span></li>
          </ul>
        </div>

        {/* Data Retention */}
        <button
          className="proctor-consent-toggle"
          onClick={() => setShowDetails((v) => !v)}
        >
          {showDetails ? "Hide" : "Show"} data retention details
        </button>

        {showDetails && (
          <div className="proctor-consent-details">
            <p>
              <Lock size={12} style={{ display: "inline", marginRight: 4 }} />
              Flagged thumbnail images (640×360 px) are stored securely for up to{" "}
              <strong>30 days</strong>, then automatically deleted. Video is{" "}
              <strong>never recorded</strong> — only individual frames on suspicious events.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="proctor-consent-actions">
          <button
            className="proctor-btn proctor-btn--decline"
            onClick={onDecline}
          >
            <ShieldAlert size={16} />
            Decline Monitoring
          </button>
          <button
            className="proctor-btn proctor-btn--accept"
            onClick={onAccept}
          >
            <ShieldCheck size={16} />
            I Agree — Start Exam
          </button>
        </div>

        <p className="proctor-consent-note">
          Declining does not cancel your exam, but your instructor will be notified.
        </p>
      </div>

      <style>{`
        .proctor-consent-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .proctor-consent-modal {
          background: #0f1117;
          border: 1px solid #2a2f3e;
          border-radius: 1rem;
          padding: 2rem;
          max-width: 520px;
          width: 100%;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6);
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .proctor-consent-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .proctor-consent-icon {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .proctor-consent-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: #f1f5f9;
          margin: 0 0 0.2rem;
        }

        .proctor-consent-subtitle {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0;
        }

        .proctor-consent-intro {
          font-size: 0.875rem;
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 1.25rem;
        }

        .proctor-consent-list {
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 0.5rem;
          padding: 0.875rem 1rem;
          margin-bottom: 0.75rem;
        }

        .proctor-consent-list--safe {
          background: rgba(16, 185, 129, 0.06);
          border-color: rgba(16, 185, 129, 0.2);
        }

        .proctor-consent-list-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #cbd5e1;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0 0 0.5rem;
        }

        .proctor-consent-list ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .proctor-consent-list ul li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #94a3b8;
        }

        .proctor-consent-toggle {
          background: none;
          border: none;
          color: #6366f1;
          cursor: pointer;
          font-size: 0.8rem;
          padding: 0.25rem 0;
          text-decoration: underline;
          margin-bottom: 0.5rem;
        }

        .proctor-consent-details {
          background: rgba(255,255,255,0.04);
          border-radius: 0.5rem;
          padding: 0.75rem;
          font-size: 0.8rem;
          color: #94a3b8;
          line-height: 1.5;
          margin-bottom: 0.75rem;
        }

        .proctor-consent-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.25rem;
        }

        .proctor-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.6rem;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .proctor-btn--decline {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .proctor-btn--decline:hover {
          background: rgba(239, 68, 68, 0.2);
        }

        .proctor-btn--accept {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
        }

        .proctor-btn--accept:hover {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .proctor-consent-note {
          text-align: center;
          font-size: 0.72rem;
          color: #475569;
          margin-top: 0.75rem;
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
}
