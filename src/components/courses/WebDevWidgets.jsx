"use client";

import { useState, useEffect } from "react";
import { Play, RotateCcw, Layout, Layers, Sparkles, Terminal, Code, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

/* ─── HTML & CSS Live Editor ─────────────────────── */
export function HtmlCssSandbox() {
  const [html, setHtml] = useState(`<h1>Hello World!</h1>\n<p>Edit this code live inside this browser compiler box.</p>`);
  const [css, setCss] = useState(`h1 {\n  color: #6366f1;\n  font-size: 24px;\n  margin-bottom: 8px;\n}\np {\n  color: #475569;\n  font-size: 14px;\n}`);

  const srcDoc = `
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 12px; margin: 0; background-color: transparent; }
          ${css}
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  return (
    <div className="rounded-2xl border border-[var(--border-primary)] overflow-hidden flex flex-col shadow-lg" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
      {/* Editor Title Bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-hover)" }}>
        <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="text-[11px] font-mono ml-2 font-bold" style={{ color: "var(--text-muted)" }}>live_editor.html</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px border-b" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--border-primary)" }}>
        {/* HTML input */}
        <div className="p-3 flex flex-col" style={{ backgroundColor: "var(--bg-card)" }}>
          <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>HTML Content</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full h-28 font-mono text-xs outline-none p-2 rounded-lg resize-none"
            style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" }}
          />
        </div>

        {/* CSS input */}
        <div className="p-3 flex flex-col" style={{ backgroundColor: "var(--bg-card)" }}>
          <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>CSS Styles</label>
          <textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            className="w-full h-28 font-mono text-xs outline-none p-2 rounded-lg resize-none"
            style={{ backgroundColor: "var(--bg-input)", border: "1px solid var(--border-primary)", color: "var(--text-primary)" }}
          />
        </div>
      </div>

      {/* Frame Preview Container */}
      <div className="p-3 flex flex-col" style={{ backgroundColor: "var(--bg-card)" }}>
        <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
          <Play size={10} style={{ color: "var(--text-accent)" }} /> Live Sandbox Canvas Preview
        </label>
        <iframe
          srcDoc={srcDoc}
          title="Sandbox Preview Frame"
          sandbox="allow-scripts"
          className="w-full h-32 rounded-xl border border-[var(--border-primary)] bg-white shadow-inner"
          style={{ borderColor: "var(--border-primary)" }}
        />
      </div>
    </div>
  );
}

/* ─── Interactive Flexbox Lab ───────────────────── */
export function FlexboxLab() {
  const [direction, setDirection] = useState("row");
  const [justify, setJustify] = useState("center");
  const [align, setAlign] = useState("center");
  const [gap, setGap] = useState("16px");

  const items = [
    { id: 1, label: "Item A", color: "#6366f1" },
    { id: 2, label: "Item B", color: "#06b6d4" },
    { id: 3, label: "Item C", color: "#10b981" },
  ];

  return (
    <div className="rounded-2xl border border-[var(--border-primary)] p-5 space-y-6 shadow-md" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
      <div className="flex items-center gap-2">
        <Layout size={18} style={{ color: "var(--text-accent)" }} />
        <h4 className="text-sm font-bold font-display" style={{ color: "var(--text-primary)" }}>Visual Flexbox Controls</h4>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        {/* flex-direction */}
        <div className="space-y-1.5">
          <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>flex-direction</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="w-full p-2 rounded-lg outline-none cursor-pointer border"
            style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
          >
            <option value="row">row</option>
            <option value="column">column</option>
          </select>
        </div>

        {/* justify-content */}
        <div className="space-y-1.5">
          <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>justify-content</label>
          <select
            value={justify}
            onChange={(e) => setJustify(e.target.value)}
            className="w-full p-2 rounded-lg outline-none cursor-pointer border"
            style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
          >
            <option value="flex-start">flex-start</option>
            <option value="center">center</option>
            <option value="flex-end">flex-end</option>
            <option value="space-between">space-between</option>
            <option value="space-around">space-around</option>
          </select>
        </div>

        {/* align-items */}
        <div className="space-y-1.5">
          <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>align-items</label>
          <select
            value={align}
            onChange={(e) => setAlign(e.target.value)}
            className="w-full p-2 rounded-lg outline-none cursor-pointer border"
            style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
          >
            <option value="stretch">stretch</option>
            <option value="flex-start">flex-start</option>
            <option value="center">center</option>
            <option value="flex-end">flex-end</option>
          </select>
        </div>

        {/* gap */}
        <div className="space-y-1.5">
          <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>gap</label>
          <select
            value={gap}
            onChange={(e) => setGap(e.target.value)}
            className="w-full p-2 rounded-lg outline-none cursor-pointer border"
            style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
          >
            <option value="8px">8px</option>
            <option value="16px">16px</option>
            <option value="32px">32px</option>
          </select>
        </div>
      </div>

      {/* Render Canvas Workspace */}
      <div 
        className="rounded-xl border border-[var(--border-primary)] p-4 h-48 flex transition-all duration-300 shadow-inner" 
        style={{
          display: "flex",
          flexDirection: direction,
          justifyContent: justify,
          alignItems: align,
          gap: gap,
          backgroundColor: "var(--bg-code)",
          borderColor: "var(--border-primary)"
        }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            layout
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="h-10 w-20 flex items-center justify-center rounded-lg text-white font-bold text-xs shadow-md select-none"
            style={{ backgroundColor: item.color }}
          >
            {item.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ─── Interactive JS DOM Debugger ───────────────── */
export function JsDomDebugger() {
  const [text, setText] = useState("Hello DOM!");
  const [hasGradient, setHasGradient] = useState(false);
  const [hasBorder, setHasBorder] = useState(false);
  const [code, setCode] = useState("// Click buttons to trigger DOM methods live");

  const handleTextChange = () => {
    const newText = text === "Hello DOM!" ? "Compiled Sandbox Text!" : "Hello DOM!";
    setText(newText);
    setCode(`const element = document.querySelector("#element");\nelement.textContent = "${newText}";`);
  };

  const handleGradientToggle = () => {
    setHasGradient(!hasGradient);
    setCode(`const element = document.querySelector("#element");\nelement.classList.toggle("text-gradient");`);
  };

  const handleBorderToggle = () => {
    setHasBorder(!hasBorder);
    setCode(`const element = document.querySelector("#element");\nelement.classList.toggle("border-glow");`);
  };

  const handleReset = () => {
    setText("Hello DOM!");
    setHasGradient(false);
    setHasBorder(false);
    setCode("// State parameters reset successfully");
  };

  return (
    <div className="rounded-2xl border border-[var(--border-primary)] p-5 space-y-6 shadow-md" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
      <div className="flex items-center gap-2">
        <Layers size={18} style={{ color: "var(--text-accent)" }} />
        <h4 className="text-sm font-bold font-display" style={{ color: "var(--text-primary)" }}>JS DOM Mutation Lab</h4>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleTextChange}
          className="px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm border border-[var(--border-primary)] hover:shadow transition-all"
          style={{ backgroundColor: "var(--bg-hover)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
        >
          Change Text
        </button>
        <button
          onClick={handleGradientToggle}
          className="px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm border border-[var(--border-primary)] hover:shadow transition-all"
          style={{ backgroundColor: "var(--bg-hover)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
        >
          Toggle Gradient
        </button>
        <button
          onClick={handleBorderToggle}
          className="px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm border border-[var(--border-primary)] hover:shadow transition-all"
          style={{ backgroundColor: "var(--bg-hover)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
        >
          Toggle Border Glow
        </button>
        <button
          onClick={handleReset}
          className="px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm border border-[var(--border-primary)] hover:shadow transition-all ml-auto flex items-center gap-1 bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20"
        >
          <RotateCcw size={10} /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mock DOM representation */}
        <div className="rounded-xl border border-[var(--border-primary)] p-6 flex flex-col items-center justify-center min-h-[120px] relative overflow-hidden transition-all duration-300"
          style={{
            backgroundColor: "var(--bg-code)",
            borderColor: hasBorder ? "var(--accent-primary)" : "var(--border-primary)",
            boxShadow: hasBorder ? "0 0 16px var(--accent-glow)" : "none"
          }}
        >
          <div className="absolute top-2 left-2 text-[8px] uppercase tracking-wider font-mono" style={{ color: "var(--text-muted)" }}>#element node</div>
          <span 
            className="text-lg font-extrabold transition-all duration-300"
            style={hasGradient ? {
              background: "var(--accent-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            } : {
              color: "var(--text-primary)"
            }}
          >
            {text}
          </span>
        </div>

        {/* Code Visualizer */}
        <div className="rounded-xl border border-[var(--border-primary)] p-4 min-h-[120px]" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-primary)" }}>
          <div className="text-[8px] uppercase tracking-wider font-mono mb-2" style={{ color: "var(--text-muted)" }}>Dynamic code output</div>
          <pre className="font-mono text-xs leading-relaxed overflow-x-auto" style={{ color: "var(--text-accent)" }}>{code}</pre>
        </div>
      </div>
    </div>
  );
}

/* ─── Premium HTML/CSS/JS Practice Playground ───── */
export function PracticePlayground() {
  const templates = {
    basics: {
      name: "HTML Skeleton (Basics)",
      html: `<h1>Welcome to the Practice Lab!</h1>
<p>Start learning HTML by editing this text or writing new tags.</p>
<button id="alert-btn">Click Me for an Alert</button>`,
      css: `h1 {
  color: var(--accent-primary);
  font-size: 28px;
  margin-bottom: 8px;
}
p {
  color: var(--text-secondary);
  font-size: 15px;
  line-height: 1.6;
}
button {
  padding: 10px 20px;
  background: var(--accent-gradient);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px var(--accent-glow);
  transition: transform 0.2s;
}
button:hover {
  transform: translateY(-2px);
}`,
      js: `// JS runs inside the compiled iframe
console.log("HTML Skeleton Template Loaded successfully!");

const btn = document.getElementById("alert-btn");
btn.addEventListener("click", () => {
  alert("Hello from the Sandboxed JS execution!");
  console.log("Alert button was clicked!");
});`
    },
    counter: {
      name: "Dynamic Counter (DOM)",
      html: `<div class="counter-card">
  <h2>Interactive Counter</h2>
  <div id="counter-val">0</div>
  <div class="actions">
    <button id="btn-dec">- Decrement</button>
    <button id="btn-inc">+ Increment</button>
  </div>
</div>`,
      css: `.counter-card {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid var(--border-primary);
  background: var(--bg-card);
  text-align: center;
  max-width: 300px;
  margin: 20px auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}
h2 {
  font-size: 18px;
  margin-bottom: 12px;
  color: var(--text-primary);
}
#counter-val {
  font-size: 48px;
  font-weight: 800;
  margin: 16px 0;
  color: var(--text-accent);
}
.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
button {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-primary);
  background: var(--bg-hover);
  color: var(--text-primary);
  font-weight: bold;
  cursor: pointer;
}
button:hover {
  background: var(--border-accent);
  color: var(--text-accent);
}`,
      js: `console.log("Counter Template initialized.");
let count = 0;
const valEl = document.getElementById("counter-val");

document.getElementById("btn-inc").addEventListener("click", () => {
  count++;
  valEl.textContent = count;
  console.log("Counter incremented to " + count);
});

document.getElementById("btn-dec").addEventListener("click", () => {
  count--;
  valEl.textContent = count;
  console.log("Counter decremented to " + count);
});`
    },
    flexbox: {
      name: "Flexbox Card Grid (CSS)",
      html: `<div class="flex-workspace">
  <div class="box box-1">Card A</div>
  <div class="box box-2">Card B</div>
  <div class="box box-3">Card C</div>
</div>`,
      css: `.flex-workspace {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  gap: 16px;
  background: var(--bg-hover);
  padding: 24px;
  border-radius: 16px;
  min-height: 160px;
  border: 1px dashed var(--border-primary);
}
.box {
  width: 90px;
  height: 90px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-weight: 800;
  font-size: 13px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.box-1 { background: #6366f1; }
.box-2 { background: #06b6d4; }
.box-3 { background: #10b981; }`,
      js: `console.log("Flexbox grid loaded. Try editing CSS flex properties (e.g. change flex-direction to 'column' or justify-content to 'center')!");`
    },
    list: {
      name: "Dynamic List Builder (DOM)",
      html: `<div class="list-container">
  <h3>Interactive Shopping List</h3>
  <div class="input-row">
    <input type="text" id="item-input" placeholder="Type items to add...">
    <button id="add-btn">Add Item</button>
  </div>
  <ul id="items-list">
    <li>Learn HTML/CSS basics</li>
  </ul>
</div>`,
      css: `.list-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
}
h3 {
  margin-bottom: 15px;
  color: var(--text-primary);
}
.input-row {
  display: flex;
  gap: 8px;
}
input {
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border-primary);
  background: var(--bg-input);
  color: var(--text-primary);
  outline: none;
}
button {
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}
button:hover { background: #059669; }
ul {
  margin-top: 16px;
  padding-left: 20px;
}
li {
  padding: 6px 0;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-primary);
}`,
      js: `console.log("Dynamic list builder ready.");
const input = document.getElementById("item-input");
const btn = document.getElementById("add-btn");
const list = document.getElementById("items-list");

btn.addEventListener("click", () => {
  const text = input.value.trim();
  if (text) {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
    console.log("Successfully added: '" + text + "' to list.");
    input.value = "";
  } else {
    console.warn("Input box is empty!");
  }
});`
    }
  };

  const [activeTemplate, setActiveTemplate] = useState("basics");
  const [activeEditorTab, setActiveEditorTab] = useState("html");
  const [htmlCode, setHtmlCode] = useState(templates.basics.html);
  const [cssCode, setCssCode] = useState(templates.basics.css);
  const [jsCode, setJsCode] = useState(templates.basics.js);
  const [logs, setLogs] = useState(["Workspace initialized. Choose template above."]);
  const [runKey, setRunKey] = useState(0);

  // Load selected template
  const handleTemplateChange = (key) => {
    setActiveTemplate(key);
    setHtmlCode(templates[key].html);
    setCssCode(templates[key].css);
    setJsCode(templates[key].js);
    setLogs([`Switched workspace template to "${templates[key].name}"`]);
    setRunKey(prev => prev + 1);
  };

  // Reset current code to template default
  const handleReset = () => {
    setHtmlCode(templates[activeTemplate].html);
    setCssCode(templates[activeTemplate].css);
    setJsCode(templates[activeTemplate].js);
    setLogs(["Code reset successfully to template defaults."]);
    setRunKey(prev => prev + 1);
  };

  // Listen to messages from compiled iframe console logs
  useEffect(() => {
    const handleLogMessage = (e) => {
      if (e.data && e.data.type === "SANDBOX_CONSOLE_LOG") {
        setLogs(prev => [...prev, e.data.data]);
      }
    };
    window.addEventListener("message", handleLogMessage);
    return () => window.removeEventListener("message", handleLogMessage);
  }, []);

  const handleRun = () => {
    setLogs(prev => [...prev, "Compiling and running code..."]);
    setRunKey(prev => prev + 1);
  };

  // Build sandboxed HTML page with console capture script
  const srcDoc = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          :root {
            --bg-primary: #faf9f6;
            --bg-card: #ffffff;
            --bg-hover: #f1f5f9;
            --bg-input: #f8fafc;
            --text-primary: #0f172a;
            --text-secondary: #475569;
            --text-muted: #94a3b8;
            --text-accent: #4f46e5;
            --border-primary: #e2e8f0;
            --border-accent: #c7d2fe;
            --accent-primary: #4f46e5;
            --accent-secondary: #7c3aed;
            --accent-gradient: linear-gradient(135deg, #4f46e5, #7c3aed);
            --accent-glow: rgba(99, 102, 241, 0.15);
          }
          
          body.theme-dark {
            --bg-primary: #0b0f19;
            --bg-card: #161d2e;
            --bg-hover: #1e293b;
            --bg-input: #1e2740;
            --text-primary: #e2e8f0;
            --text-secondary: #94a3b8;
            --text-muted: #4b5563;
            --text-accent: #818cf8;
            --border-primary: #1e293b;
            --border-accent: #3730a3;
            --accent-primary: #6366f1;
            --accent-secondary: #8b5cf6;
            --accent-gradient: linear-gradient(135deg, #6366f1, #8b5cf6);
            --accent-glow: rgba(99, 102, 241, 0.25);
          }

          body.theme-mint {
            --bg-primary: #f0fbf7;
            --bg-card: #ffffff;
            --bg-hover: #d1fae5;
            --bg-input: #ecfdf5;
            --text-primary: #064e3b;
            --text-secondary: #065f46;
            --text-muted: #6ee7b7;
            --text-accent: #059669;
            --border-primary: #a7f3d0;
            --border-accent: #6ee7b7;
            --accent-primary: #10b981;
            --accent-secondary: #0d9488;
            --accent-gradient: linear-gradient(135deg, #10b981, #0d9488);
            --accent-glow: rgba(16, 185, 129, 0.28);
          }

          body.theme-violet {
            --bg-primary: #0d0818;
            --bg-card: #1a1030;
            --bg-hover: #2a1b48;
            --bg-input: #1f1438;
            --text-primary: #e9d5ff;
            --text-secondary: #c4b5fd;
            --text-muted: #6b21a8;
            --text-accent: #e879f9;
            --border-primary: #2d1b54;
            --border-accent: #7c3aed;
            --accent-primary: #d946ef;
            --accent-secondary: #a855f7;
            --accent-gradient: linear-gradient(135deg, #d946ef, #a855f7, #6366f1);
            --accent-glow: rgba(217, 70, 239, 0.35);
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 20px;
            margin: 0;
            background-color: var(--bg-primary);
            color: var(--text-primary);
            transition: background-color 0.3s, color 0.3s;
          }
          ${cssCode}
        </style>
        <script>
          (function() {
            const sendLog = function(type, message) {
              window.parent.postMessage({ type: "SANDBOX_CONSOLE_LOG", data: message }, "*");
            };

            console.log = function(...args) {
              sendLog("log", args.join(" "));
            };

            console.warn = function(...args) {
              sendLog("warn", "⚠️ " + args.join(" "));
            };

            console.error = function(...args) {
              sendLog("error", "❌ " + args.join(" "));
            };

            window.addEventListener("error", function(err) {
              sendLog("error", "❌ Uncaught Runtime Error: " + err.message);
            });
          })();
        </script>
      </head>
      <body>
        ${htmlCode}
        <script>
          try {
            // Check parent theme settings
            const parentClasses = window.parent.document.documentElement.classList;
            if (parentClasses.contains('theme-dark')) {
              document.body.classList.add('theme-dark');
            } else if (parentClasses.contains('theme-mint')) {
              document.body.classList.add('theme-mint');
            } else if (parentClasses.contains('theme-violet')) {
              document.body.classList.add('theme-violet');
            }
          } catch (e) {}
        </script>
        <script>
          try {
            ${jsCode}
          } catch (e) {
            console.error(e.message);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Template Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-gradient" style={{ color: "var(--text-accent)" }} />
            <h2 className="text-base font-bold font-display" style={{ color: "var(--text-primary)" }}>Interactive Practice Lab</h2>
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>Write HTML, CSS, and JS in real-time. Test your concepts using sandboxed presets.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-[10px] font-bold uppercase shrink-0" style={{ color: "var(--text-muted)" }}>Preset template:</label>
          <select
            value={activeTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="p-2 rounded-lg text-xs outline-none cursor-pointer border border-[var(--border-primary)] font-semibold"
            style={{ backgroundColor: "var(--bg-hover)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
          >
            {Object.keys(templates).map((key) => (
              <option key={key} value={key}>{templates[key].name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. Workspace: Editor (Left) & Canvas Output + Console (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Editor */}
        <div className="rounded-2xl border border-[var(--border-primary)] overflow-hidden flex flex-col shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
          {/* Tab buttons switcher */}
          <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-hover)" }}>
            <div className="flex gap-1.5 text-[11px] font-bold font-mono">
              <button
                onClick={() => setActiveEditorTab("html")}
                className="px-3 py-1.5 rounded-lg transition-colors border"
                style={activeEditorTab === "html"
                  ? { backgroundColor: "var(--bg-card)", color: "var(--text-accent)", borderColor: "var(--border-accent)" }
                  : { color: "var(--text-muted)", borderColor: "transparent" }
                }
              >
                index.html
              </button>
              <button
                onClick={() => setActiveEditorTab("css")}
                className="px-3 py-1.5 rounded-lg transition-colors border"
                style={activeEditorTab === "css"
                  ? { backgroundColor: "var(--bg-card)", color: "var(--text-accent)", borderColor: "var(--border-accent)" }
                  : { color: "var(--text-muted)", borderColor: "transparent" }
                }
              >
                styles.css
              </button>
              <button
                onClick={() => setActiveEditorTab("js")}
                className="px-3 py-1.5 rounded-lg transition-colors border"
                style={activeEditorTab === "js"
                  ? { backgroundColor: "var(--bg-card)", color: "var(--text-accent)", borderColor: "var(--border-accent)" }
                  : { color: "var(--text-muted)", borderColor: "transparent" }
                }
              >
                main.js
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold border border-[var(--border-primary)] transition-colors bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20"
                title="Reset code to default template parameters"
              >
                <RotateCcw size={10} /> Reset
              </button>
              <button
                onClick={handleRun}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-[var(--text-on-accent)] shadow-sm transition-all"
                style={{ background: "var(--accent-gradient)" }}
              >
                <Play size={10} fill="white" /> Run Code
              </button>
            </div>
          </div>

          {/* Code text areas editor tabs */}
          <div className="relative p-4 flex-1" style={{ backgroundColor: "var(--bg-code)" }}>
            {activeEditorTab === "html" && (
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="w-full h-80 font-mono text-xs outline-none p-3 rounded-xl resize-none leading-relaxed border"
                style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
                spellCheck="false"
                placeholder="<!-- Enter HTML here -->"
              />
            )}
            {activeEditorTab === "css" && (
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                className="w-full h-80 font-mono text-xs outline-none p-3 rounded-xl resize-none leading-relaxed border"
                style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
                spellCheck="false"
                placeholder="/* Enter CSS here */"
              />
            )}
            {activeEditorTab === "js" && (
              <textarea
                value={jsCode}
                onChange={(e) => setJsCode(e.target.value)}
                className="w-full h-80 font-mono text-xs outline-none p-3 rounded-xl resize-none leading-relaxed border"
                style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
                spellCheck="false"
                placeholder="// Enter JavaScript here"
              />
            )}
          </div>
        </div>

        {/* Right Side: Preview Frame & Mock Console */}
        <div className="space-y-6 flex flex-col justify-between">
          {/* Canvas Live Output Container */}
          <div className="rounded-2xl border border-[var(--border-primary)] overflow-hidden flex flex-col shadow-sm flex-grow" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <div className="flex items-center px-4 py-3 border-b" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-hover)" }}>
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                <Play size={10} style={{ color: "var(--text-accent)" }} /> Live Sandbox Canvas Preview
              </span>
            </div>
            <div className="p-4 bg-[#f8fafc] dark:bg-[#080b11] min-h-[200px] flex items-center justify-center flex-grow">
              <iframe
                srcDoc={srcDoc}
                key={runKey}
                title="Interactive Workspace Sandbox"
                sandbox="allow-scripts allow-modals"
                className="w-full h-full min-h-[220px] rounded-xl border border-[var(--border-primary)] bg-white shadow-inner"
                style={{ borderColor: "var(--border-primary)" }}
              />
            </div>
          </div>

          {/* Console Logger Terminal Output */}
          <div className="rounded-2xl border border-[var(--border-primary)] overflow-hidden flex flex-col shadow-sm" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
            <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-hover)" }}>
              <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 font-mono" style={{ color: "var(--text-muted)" }}>
                <Terminal size={12} style={{ color: "var(--text-accent)" }} /> Execution Console
              </span>
              <button
                onClick={() => setLogs([])}
                className="flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold transition-all border border-[var(--border-primary)] hover:bg-slate-200/10"
                style={{ borderColor: "var(--border-primary)", color: "var(--text-muted)" }}
                title="Clear console output logs"
              >
                <Trash2 size={10} /> Clear
              </button>
            </div>
            
            <div className="p-3 font-mono text-[10px] leading-relaxed h-32 overflow-y-auto" style={{ backgroundColor: "var(--bg-code)" }}>
              {logs.length === 0 ? (
                <div className="text-[10px] italic h-full flex items-center justify-center" style={{ color: "var(--text-muted)" }}>
                  No logs captured. Click "Run Code" to inspect program logs.
                </div>
              ) : (
                <div className="space-y-1">
                  {logs.map((log, lIdx) => (
                    <div key={lIdx} className="border-b pb-0.5 border-[var(--border-primary)]/10" style={{ color: log.startsWith("❌") ? "rgb(239, 68, 68)" : log.startsWith("⚠️") ? "rgb(245, 158, 11)" : "var(--text-accent)" }}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
