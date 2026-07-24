"use client";

import { useEffect, useState, useCallback } from "react";
import { AlertTriangle, Eye, EyeOff, Users, Sun, Camera, Mic } from "lucide-react";

/**
 * ProctoringToast — Non-intrusive flag alerts for the student.
 * Auto-dismisses after 4 seconds. Never blocks exam UI.
 * Props:
 *   flags: FlagResult[]  — array from useProctor.onFlag callback
 */

const FLAG_CONFIG = {
  NO_FACE: {
    icon: Eye,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.3)",
    message: "Face not visible. Please stay in frame.",
  },
  MULTIPLE_FACE: {
    icon: Users,
    color: "#f97316",
    bg: "rgba(249,115,22,0.12)",
    border: "rgba(249,115,22,0.3)",
    message: "Multiple faces detected in frame.",
  },
  LOOK_AWAY_LONG: {
    icon: Eye,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.3)",
    message: "Please look at the screen.",
  },
  MOUTH_MOVEMENT: {
    icon: Mic,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
    border: "rgba(139,92,246,0.3)",
    message: "Talking detected.",
  },
  LOW_LIGHT: {
    icon: Sun,
    color: "#64748b",
    bg: "rgba(100,116,139,0.12)",
    border: "rgba(100,116,139,0.3)",
    message: "Lighting is poor. Please improve visibility.",
  },
  CAMERA_BLOCKED: {
    icon: Camera,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
    border: "rgba(239,68,68,0.3)",
    message: "Camera appears blocked.",
  },
  BLURRY_CAMERA: {
    icon: Camera,
    color: "#64748b",
    bg: "rgba(100,116,139,0.12)",
    border: "rgba(100,116,139,0.3)",
    message: "Camera image is blurry.",
  },
};

let toastId = 0;

export default function ProctoringToast({ flags = [] }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((flag) => {
    const config = FLAG_CONFIG[flag.type];
    if (!config) return;

    const id = ++toastId;
    setToasts((prev) => {
      // Avoid duplicating same flag within 5 seconds
      const exists = prev.some((t) => t.flag === flag.type);
      if (exists) return prev;
      return [...prev, { id, flag: flag.type, config }];
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  useEffect(() => {
    flags.forEach((flag) => {
      if (flag.severity === "HIGH" || flag.severity === "MEDIUM") {
        addToast(flag);
      }
    });
  }, [flags, addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="proctor-toasts">
      {toasts.map((toast) => {
        const Icon = toast.config.icon;
        return (
          <div
            key={toast.id}
            className="proctor-toast"
            style={{
              background: toast.config.bg,
              borderColor: toast.config.border,
              color: toast.config.color,
            }}
          >
            <Icon size={15} />
            <span>{toast.config.message}</span>
          </div>
        );
      })}

      <style>{`
        .proctor-toasts {
          position: fixed;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1100;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
          pointer-events: none;
        }

        .proctor-toast {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          border-radius: 999px;
          border: 1px solid;
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          backdrop-filter: blur(8px);
          animation: toastIn 0.25s ease;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        }

        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
