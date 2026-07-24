/**
 * useProctor.js — Proctoring orchestration hook.
 *
 * Features:
 * - WebSocket primary channel (binary JPEG frames)
 * - REST fallback when WebSocket is blocked
 * - Adaptive frame sampling: 3s normal → 1s during active flag
 * - Browser event relay (tab hidden, window blur, network lost)
 * - UUID trace IDs per frame for distributed debugging
 * - Camera disconnect detection
 */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buildAuthHeaders, getApiBase } from "@/utils/api";

const API_BASE = typeof window !== "undefined" ? getApiBase() : "";
const WS_BASE = API_BASE.replace(/^http/, "ws");

// Sampling intervals
const INTERVAL_NORMAL = 3000;
const INTERVAL_BURST = 1000;
const INTERVAL_COOLDOWN_MS = 5000;

export function useProctor({
  sessionId,
  user,
  token,
  captureFrame,
  isCameraActive,
  onFlag,            // (flags: FlagResult[]) => void
  enabled = false,
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [activeFlags, setActiveFlags] = useState(new Set());

  const wsRef = useRef(null);
  const captureIntervalRef = useRef(null);
  const flagClearTimerRef = useRef(null);
  const frameNumberRef = useRef(0);
  const usingRestFallbackRef = useRef(false);
  const isTabVisibleRef = useRef(true);
  const lastFlagTimeRef = useRef(0);

  // ── Utilities ────────────────────────────────────────────────────────────

  const generateTraceId = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  };

  const buildTraceHeader = (traceId) => {
    const encoded = new TextEncoder().encode(traceId);
    const header = new Uint8Array(4);
    new DataView(header.buffer).setUint32(0, encoded.length, false);
    const result = new Uint8Array(4 + encoded.length);
    result.set(header, 0);
    result.set(encoded, 4);
    return result;
  };

  const getCurrentInterval = useCallback(() => {
    const timeSinceLastFlag = Date.now() - lastFlagTimeRef.current;
    if (timeSinceLastFlag < INTERVAL_COOLDOWN_MS && lastFlagTimeRef.current > 0) {
      return INTERVAL_BURST;
    }
    return INTERVAL_NORMAL;
  }, []);

  // ── REST fallback ─────────────────────────────────────────────────────────

  const sendFrameREST = useCallback(
    async (frameBlob, traceId) => {
      try {
        const form = new FormData();
        form.append("session_id", sessionId);
        form.append("trace_id", traceId);
        form.append("frame", frameBlob, "frame.jpg");

        const headers = buildAuthHeaders(token, user);
        delete headers["Content-Type"]; // let browser set multipart boundary

        const res = await fetch(`${API_BASE}/api/v1/proctor/frame`, {
          method: "POST",
          headers,
          body: form,
        });

        if (!res.ok) return;
        const data = await res.json();
        handleServerResponse(data);
      } catch {
        // Silent failure on REST fallback
      }
    },
    [sessionId, token, user]
  );

  // ── Frame sender ──────────────────────────────────────────────────────────

  const handleServerResponse = useCallback(
    (data) => {
      if (!data?.flags) return;
      const flags = data.flags || [];
      if (flags.length > 0) {
        lastFlagTimeRef.current = Date.now();
        setActiveFlags(new Set(flags.map((f) => f.type)));
        onFlag?.(flags);
      } else {
        setActiveFlags(new Set());
      }
    },
    [onFlag]
  );

  const sendFrame = useCallback(async () => {
    if (!isCameraActive || !isTabVisibleRef.current || !sessionId) return;

    const frameBlob = await captureFrame(0.85);
    if (!frameBlob) return;

    frameNumberRef.current += 1;
    const traceId = generateTraceId();

    // ── WebSocket path ──────────────────────────────────────────────────────
    if (!usingRestFallbackRef.current && wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        const frameBytes = new Uint8Array(await frameBlob.arrayBuffer());
        const traceHeader = buildTraceHeader(traceId);
        const combined = new Uint8Array(traceHeader.length + frameBytes.length);
        combined.set(traceHeader, 0);
        combined.set(frameBytes, traceHeader.length);
        wsRef.current.send(combined.buffer);
        return;
      } catch {
        // Fall through to REST
      }
    }

    // ── REST fallback ───────────────────────────────────────────────────────
    await sendFrameREST(frameBlob, traceId);
  }, [captureFrame, isCameraActive, sessionId, sendFrameREST]);

  // ── Capture loop ──────────────────────────────────────────────────────────

  const startCaptureLoop = useCallback(() => {
    if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);

    const tick = async () => {
      await sendFrame();
      // Restart with possibly different interval
      if (captureIntervalRef.current) clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = setTimeout(tick, getCurrentInterval());
    };

    captureIntervalRef.current = setTimeout(tick, getCurrentInterval());
  }, [sendFrame, getCurrentInterval]);

  const stopCaptureLoop = useCallback(() => {
    if (captureIntervalRef.current) {
      clearTimeout(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
  }, []);

  // ── WebSocket connection ──────────────────────────────────────────────────

  const connectWebSocket = useCallback(() => {
    if (!sessionId) return;

    const wsUrl = `${WS_BASE}/api/v1/proctor/ws/${sessionId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      usingRestFallbackRef.current = false;
      startCaptureLoop();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "connected") return;
        handleServerResponse(data);
      } catch {
        // Ignore malformed messages
      }
    };

    ws.onerror = () => {
      usingRestFallbackRef.current = true;
    };

    ws.onclose = () => {
      setIsConnected(false);
      // Try REST fallback if WS fails
      if (!usingRestFallbackRef.current) {
        usingRestFallbackRef.current = true;
        startCaptureLoop();
      }
    };

    wsRef.current = ws;
  }, [sessionId, handleServerResponse, startCaptureLoop]);

  // ── Browser event relay ───────────────────────────────────────────────────

  const sendBrowserEvent = useCallback(
    async (flag, metadata = null) => {
      if (!sessionId) return;
      try {
        const headers = buildAuthHeaders(token, user);
        await fetch(`${API_BASE}/api/v1/proctor/event/browser`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            session_id: sessionId,
            flag,
            trace_id: generateTraceId(),
            timestamp: new Date().toISOString(),
            metadata,
          }),
        });
      } catch {
        // Silent failure for browser events
      }
    },
    [sessionId, token, user]
  );

  // ── Browser event listeners ───────────────────────────────────────────────

  useEffect(() => {
    if (!enabled || !sessionId) return;

    const handleVisibilityChange = () => {
      const isHidden = document.hidden;
      isTabVisibleRef.current = !isHidden;
      sendBrowserEvent(isHidden ? "TAB_HIDDEN" : "TAB_RESTORED");
      if (isHidden) {
        stopCaptureLoop();
      } else {
        startCaptureLoop();
      }
    };

    const handleBlur = () => sendBrowserEvent("WINDOW_BLUR");
    const handleFocus = () => sendBrowserEvent("WINDOW_FOCUS");
    const handleOffline = () => sendBrowserEvent("NETWORK_LOST");

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("offline", handleOffline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("offline", handleOffline);
    };
  }, [enabled, sessionId, sendBrowserEvent, startCaptureLoop, stopCaptureLoop]);

  // ── Main lifecycle ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!enabled || !sessionId || !isCameraActive) {
      stopCaptureLoop();
      return;
    }

    connectWebSocket();

    return () => {
      stopCaptureLoop();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [enabled, sessionId, isCameraActive]);

  return {
    isConnected,
    activeFlags,
    sendBrowserEvent,
  };
}
