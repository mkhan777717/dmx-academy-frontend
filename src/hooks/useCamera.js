/**
 * useCamera.js — React hook for WebRTC camera access.
 * Manages getUserMedia lifecycle, permission states, and graceful fallback.
 */
"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export const CAMERA_STATES = {
  IDLE: "IDLE",
  REQUESTING: "REQUESTING",
  ACTIVE: "ACTIVE",
  DENIED: "DENIED",
  UNAVAILABLE: "UNAVAILABLE",
  STOPPED: "STOPPED",
};

export function useCamera({ width = 1280, height = 720, audio = false } = {}) {
  const [cameraState, setCameraState] = useState(CAMERA_STATES.IDLE);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const startCamera = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices) {
      setCameraState(CAMERA_STATES.UNAVAILABLE);
      setError("Camera API not available in this browser.");
      return false;
    }

    setCameraState(CAMERA_STATES.REQUESTING);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode: "user",
        },
        audio,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play().catch(() => {});
      }

      // Listen for track ending (camera disconnected)
      stream.getVideoTracks().forEach((track) => {
        track.onended = () => {
          setCameraState(CAMERA_STATES.STOPPED);
        };
      });

      setCameraState(CAMERA_STATES.ACTIVE);
      return true;
    } catch (err) {
      const isDenied = err.name === "NotAllowedError" || err.name === "PermissionDeniedError";
      setCameraState(isDenied ? CAMERA_STATES.DENIED : CAMERA_STATES.UNAVAILABLE);
      setError(isDenied ? "Camera permission denied by user." : err.message);
      return false;
    }
  }, [width, height, audio]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState(CAMERA_STATES.STOPPED);
  }, []);

  /**
   * Captures a single JPEG frame from the video element.
   * Returns a Blob or null.
   */
  const captureFrame = useCallback(
    (jpegQuality = 0.8) => {
      if (cameraState !== CAMERA_STATES.ACTIVE || !videoRef.current) return null;
      const video = videoRef.current;
      if (video.videoWidth === 0 || video.videoHeight === 0) return null;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0);

      return new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", jpegQuality);
      });
    },
    [cameraState]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    cameraState,
    error,
    isActive: cameraState === CAMERA_STATES.ACTIVE,
    isDenied: cameraState === CAMERA_STATES.DENIED,
    startCamera,
    stopCamera,
    captureFrame,
  };
}
