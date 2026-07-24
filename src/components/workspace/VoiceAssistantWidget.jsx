"use client";

import React, { useState } from "react";
import { Sparkles, ChevronDown, ChevronUp, Mic, Volume2 } from "lucide-react";

export default function VoiceAssistantWidget({
  messages = [],
  isListening = false,
  isSpeaking = false,
  onToggleListen = () => {}
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full bg-[#11101d]/90 border border-indigo-500/20 rounded-xl overflow-hidden shadow-lg transition-all">
      {/* Header Bar */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-indigo-950/20 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="h-7 w-7 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Sparkles size={14} className="animate-pulse" />
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-300">
              Voice Developer Assistant
            </h4>
            <p className="text-[10px] text-slate-400 font-medium leading-none">
              Ready to explain security & algorithms.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isSpeaking && (
            <span className="flex items-center space-x-1 text-[10px] text-indigo-400 font-bold bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-500/30">
              <Volume2 size={11} className="animate-bounce" />
              <span>Speaking</span>
            </span>
          )}
          <button className="text-slate-400 hover:text-slate-200 p-1">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expandable panel */}
      {expanded && (
        <div className="p-4 border-t border-indigo-500/10 bg-[#0d0c17] space-y-3">
          <div className="max-h-48 overflow-y-auto space-y-2 text-xs">
            {messages.length === 0 ? (
              <p className="text-slate-500 italic text-[11px]">
                Click the microphone button to ask a voice question about this problem or algorithm...
              </p>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg max-w-[85%] text-xs ${
                    m.role === "user"
                      ? "ml-auto bg-indigo-600 text-white rounded-br-none"
                      : "mr-auto bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-[10px] text-slate-400">
              {isListening ? "Listening to your voice..." : "Voice input ready"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleListen();
              }}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isListening
                  ? "bg-rose-500 text-white animate-pulse"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
              }`}
            >
              <Mic size={13} />
              <span>{isListening ? "Listening..." : "Ask Voice AI"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
