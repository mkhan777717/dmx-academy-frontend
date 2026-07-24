"use client";

import { useEffect, useRef } from "react";
import { CAMERA_STATES } from "@/hooks/useCamera";
import { Video, VideoOff, Loader2 } from "lucide-react";

/**
 * ProctoringCamera — Floating corner webcam preview during exam.
 * Non-intrusive: positioned bottom-right, semi-transparent.
 * Props:
 *   videoRef: RefObject<HTMLVideoElement>
 *   cameraState: CAMERA_STATES
 *   isConnected: boolean
 */
export default function ProctoringCamera({ videoRef, cameraState, isConnected }) {
  const isActive = cameraState === CAMERA_STATES.ACTIVE;
  const isDenied = cameraState === CAMERA_STATES.DENIED;
  const isRequesting = cameraState === CAMERA_STATES.REQUESTING;

  return (
    <div className={`proctor-cam-container ${isActive ? "proctor-cam--active" : "proctor-cam--inactive"}`}>
      {/* Status indicator dot */}
      <div className={`proctor-cam-status-dot ${isActive && isConnected ? "dot--live" : isActive ? "dot--cam-only" : "dot--off"}`} />

      {/* Video element (always mounted to keep stream alive) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="proctor-cam-video"
        style={{ display: isActive ? "block" : "none" }}
      />

      {/* Overlay icon when camera is off */}
      {!isActive && (
        <div className="proctor-cam-placeholder">
          {isRequesting ? (
            <Loader2 size={18} className="proctor-cam-spin" />
          ) : isDenied ? (
            <VideoOff size={18} />
          ) : (
            <Video size={18} />
          )}
        </div>
      )}

      {/* Status label */}
      <div className="proctor-cam-label">
        {isActive && isConnected
          ? "🔴 Monitored"
          : isActive
          ? "📷 Camera"
          : isDenied
          ? "🚫 Denied"
          : "⏳ Starting..."}
      </div>

      <style>{`
        .proctor-cam-container {
          position: fixed;
          bottom: 1.25rem;
          right: 1.25rem;
          z-index: 1000;
          width: 120px;
          border-radius: 0.6rem;
          overflow: hidden;
          background: #0f1117;
          border: 1px solid #2a2f3e;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          transition: all 0.3s ease;
          user-select: none;
        }

        .proctor-cam-container:hover {
          width: 160px;
        }

        .proctor-cam--active {
          border-color: rgba(239, 68, 68, 0.5);
        }

        .proctor-cam-video {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
          display: block;
          transform: scaleX(-1);
        }

        .proctor-cam-placeholder {
          width: 100%;
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #475569;
          background: #0a0c12;
        }

        .proctor-cam-label {
          padding: 0.3rem 0.5rem;
          font-size: 0.62rem;
          font-weight: 600;
          color: #64748b;
          text-align: center;
          background: #0a0c12;
          letter-spacing: 0.03em;
        }

        .proctor-cam-status-dot {
          position: absolute;
          top: 0.4rem;
          right: 0.4rem;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          z-index: 2;
        }

        .dot--live {
          background: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
          animation: pulse-dot 2s infinite;
        }

        .dot--cam-only {
          background: #f59e0b;
        }

        .dot--off {
          background: #475569;
        }

        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3); }
          50% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0.1); }
        }

        .proctor-cam-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
