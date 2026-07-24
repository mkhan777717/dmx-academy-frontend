import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Custom React hook to guard live classes against duplicate tab playback.
 * If the user opens the same live class URL in 2 tabs of the same browser:
 * - The older tab is notified & marked as duplicate.
 * - Clicking 'Re-join' on any tab claims active status and terminates other tabs.
 *
 * @param {string|number} sessionId - Unique live session ID or room identifier
 * @returns {Object} { isDuplicateTab, claimActiveTab }
 */
export function useDuplicateTabGuard(sessionId) {
  const [isDuplicateTab, setIsDuplicateTab] = useState(false);
  const tabIdRef = useRef(null);
  const channelRef = useRef(null);

  if (!tabIdRef.current) {
    tabIdRef.current = `tab_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;
  }

  const claimActiveTab = useCallback(() => {
    setIsDuplicateTab(false);
    if (channelRef.current && sessionId) {
      try {
        channelRef.current.postMessage({
          type: "CLAIM_TAB",
          tabId: tabIdRef.current,
          sessionId: String(sessionId),
          timestamp: Date.now(),
        });
      } catch (err) {
        console.error("Failed to broadcast tab claim:", err);
      }
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || typeof window === "undefined" || !("BroadcastChannel" in window)) {
      return;
    }

    const channelName = `eduvantix_live_session_${sessionId}`;
    const bc = new BroadcastChannel(channelName);
    channelRef.current = bc;

    // Broadcast that this tab is claiming the live session
    try {
      bc.postMessage({
        type: "CLAIM_TAB",
        tabId: tabIdRef.current,
        sessionId: String(sessionId),
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error("BroadcastChannel postMessage error:", err);
    }

    const handleMessage = (event) => {
      const data = event.data;
      if (!data || String(data.sessionId) !== String(sessionId)) return;

      if (data.type === "CLAIM_TAB" && data.tabId !== tabIdRef.current) {
        // Another tab has claimed active status for this live session
        setIsDuplicateTab(true);
      }
    };

    bc.addEventListener("message", handleMessage);

    return () => {
      bc.removeEventListener("message", handleMessage);
      bc.close();
      channelRef.current = null;
    };
  }, [sessionId]);

  return { isDuplicateTab, claimActiveTab };
}

export default useDuplicateTabGuard;
