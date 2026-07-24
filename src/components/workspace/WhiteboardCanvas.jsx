"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Trash2, Eraser, Palette } from "lucide-react";

export default function WhiteboardCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState("#6366f1");
  const [lineWidth, setLineWidth] = useState(3);
  const [isEraser, setIsEraser] = useState(false);

  // Store completed paths for re-drawing on resize / tab switch
  const pathsRef = useRef([]); // [{ color, size, isEraser, points: [{x, y}] }]
  const currentPathRef = useRef(null);

  const colors = [
    { name: "Indigo", value: "#6366f1" },
    { name: "Emerald", value: "#10b981" },
    { name: "Red", value: "#ef4444" },
    { name: "Amber", value: "#f59e0b" },
    { name: "Sky", value: "#38bdf8" },
    { name: "White", value: "#f8fafc" }
  ];

  // Redraw all stored paths onto canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pathsRef.current.forEach(path => {
      if (!path.points || path.points.length === 0) return;
      ctx.beginPath();
      ctx.strokeStyle = path.isEraser ? "#07080d" : path.color;
      ctx.lineWidth = path.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.moveTo(path.points[0].x, path.points[0].y);
      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }
      ctx.stroke();
    });
  }, []);

  // Resize canvas to match container size without clearing drawings
  const fitCanvasToContainer = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width;
      canvas.height = rect.height;
      redrawCanvas();
    }
  }, [redrawCanvas]);

  useEffect(() => {
    fitCanvasToContainer();
    window.addEventListener("resize", fitCanvasToContainer);
    return () => window.removeEventListener("resize", fitCanvasToContainer);
  }, [fitCanvasToContainer]);

  // Helper to get coordinates relative to canvas
  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    const newPath = {
      color: drawColor,
      size: lineWidth,
      isEraser: isEraser,
      points: [{ x, y }]
    };
    currentPathRef.current = newPath;
    pathsRef.current.push(newPath);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.strokeStyle = isEraser ? "#07080d" : drawColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || !currentPathRef.current) return;
    const { x, y } = getCoordinates(e);
    currentPathRef.current.points.push({ x, y });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      currentPathRef.current = null;
    }
  };

  const handleClear = () => {
    pathsRef.current = [];
    currentPathRef.current = null;
    redrawCanvas();
  };

  return (
    <div className="flex flex-col h-full w-full space-y-3 font-sans">
      {/* Dynamic Sketch Toolbar */}
      <div className="bg-[#0e1017] border border-slate-800/90 rounded-2xl p-3 px-4 flex flex-wrap items-center justify-between gap-3 shadow-lg shrink-0">
        {/* Left Side: Color Palette & Swatches */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {colors.map(col => {
              const isSelected = !isEraser && drawColor === col.value;
              return (
                <button
                  key={col.value}
                  onClick={() => {
                    setDrawColor(col.value);
                    setIsEraser(false);
                  }}
                  className={`h-6 w-6 rounded-full border cursor-pointer transition-all ${
                    isSelected
                      ? "scale-125 border-white shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                      : "border-slate-700/80 hover:scale-110"
                  }`}
                  style={{ backgroundColor: col.value }}
                  title={col.name}
                />
              );
            })}
          </div>

          <span className="h-4 w-px bg-slate-800" />

          {/* Eraser Tool Toggle */}
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              isEraser
                ? "bg-rose-950/60 text-rose-400 border-rose-500/40"
                : "bg-[#141622] text-slate-400 border-slate-800 hover:text-slate-200"
            }`}
            title="Toggle Eraser"
          >
            <Eraser size={13} />
            <span>Eraser</span>
          </button>

          <span className="h-4 w-px bg-slate-800" />

          {/* Brush Size Slider */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-400">Size:</span>
            <input
              type="range"
              min="1"
              max="12"
              value={lineWidth}
              onChange={(e) => setLineWidth(parseInt(e.target.value))}
              className="w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <span className="text-[11px] font-mono font-bold text-emerald-400 min-w-[20px]">
              {lineWidth}px
            </span>
          </div>
        </div>

        {/* Right Side: Clear Sketch Button */}
        <button
          onClick={handleClear}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
        >
          <Trash2 size={13} />
          <span>Clear Sketch</span>
        </button>
      </div>

      {/* Interactive Drawing Canvas Container with Grid Pattern */}
      <div
        ref={containerRef}
        className="flex-1 w-full border border-slate-800/90 rounded-2xl overflow-hidden bg-[#07080d] relative shadow-inner min-h-[380px]"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block cursor-crosshair touch-none"
        />
      </div>
    </div>
  );
}
