"use client";

import { useState, useEffect } from "react";
import { Play, RotateCcw, Layers, Database, Globe, Server, ArrowRight, CheckCircle2, AlertTriangle, Cpu, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── 1. React State & Props Lab ─────────────────── */
export function ReactStatePropsLab() {
  const [username, setUsername] = useState("Jane Doe");
  const [role, setRole] = useState("Lead Developer");
  const [theme, setTheme] = useState("indigo");
  const [clickCount, setClickCount] = useState(0);
  const [logs, setLogs] = useState(["Component mounted.", "Props received: username, role, theme."]);
  const [renderHighlight, setRenderHighlight] = useState(false);

  const triggerStateUpdate = () => {
    setClickCount(prev => prev + 1);
    setRenderHighlight(true);
    addLog(`State changed: clickCount = ${clickCount + 1}. React schedules re-render.`);
  };

  const handlePropChange = (field, value) => {
    if (field === "username") setUsername(value);
    if (field === "role") setRole(value);
    if (field === "theme") setTheme(value);
    setRenderHighlight(true);
    addLog(`Prop updated: ${field} = "${value}". Virtual DOM runs reconciliation.`);
  };

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 5)]);
  };

  useEffect(() => {
    if (renderHighlight) {
      const timer = setTimeout(() => setRenderHighlight(false), 800);
      return () => clearTimeout(timer);
    }
  }, [renderHighlight]);

  const themeColors = {
    indigo: { accent: "#6366f1", bg: "rgba(99, 102, 241, 0.08)", border: "rgba(99, 102, 241, 0.25)" },
    emerald: { accent: "#10b981", bg: "rgba(16, 185, 129, 0.08)", border: "rgba(16, 185, 129, 0.25)" },
    fuchsia: { accent: "#d946ef", bg: "rgba(217, 70, 239, 0.08)", border: "rgba(217, 70, 239, 0.25)" },
  };

  return (
    <div className="rounded-2xl border border-[var(--border-primary)] p-5 space-y-6 shadow-md" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
      <div className="flex items-center gap-2">
        <Layers size={18} style={{ color: "var(--text-accent)" }} />
        <h4 className="text-sm font-bold font-display" style={{ color: "var(--text-primary)" }}>React State & Props Lab</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Input Controller */}
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>Parent Prop: Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => handlePropChange("username", e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[var(--border-primary)] outline-none font-medium"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
            />
          </div>

          <div className="space-y-1">
            <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>Parent Prop: Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => handlePropChange("role", e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[var(--border-primary)] outline-none font-medium"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
            />
          </div>

          <div className="space-y-1">
            <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>Parent Prop: Component Color</label>
            <div className="flex gap-2.5 pt-1">
              {["indigo", "emerald", "fuchsia"].map((color) => (
                <button
                  key={color}
                  onClick={() => handlePropChange("theme", color)}
                  className={`px-3 py-1.5 rounded-lg border border-[var(--border-primary)] capitalize font-semibold transition-all ${theme === color ? "scale-105" : ""}`}
                  style={{
                    backgroundColor: theme === color ? themeColors[color].bg : "var(--bg-hover)",
                    borderColor: theme === color ? themeColors[color].accent : "var(--border-primary)",
                    color: theme === color ? themeColors[color].accent : "var(--text-secondary)",
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Render Preview */}
        <div className="flex flex-col gap-4">
          <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Rendered Output (Virtual DOM Diffing View)
          </label>
          
          <div
            className="rounded-xl border border-[var(--border-primary)] p-5 relative overflow-hidden transition-all duration-500 flex flex-col justify-between h-40 shadow-inner"
            style={{
              backgroundColor: "var(--bg-code)",
              borderColor: renderHighlight ? themeColors[theme].accent : "var(--border-primary)",
              boxShadow: renderHighlight ? `0 0 16px ${themeColors[theme].accent}40` : "none",
            }}
          >
            {/* Diff Highlighting Layer */}
            {renderHighlight && (
              <motion.div
                initial={{ opacity: 0.15 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundColor: themeColors[theme].accent }}
              />
            )}

            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] uppercase tracking-wider font-mono opacity-60" style={{ color: "var(--text-muted)" }}>
                  &lt;ProfileCard /&gt; {renderHighlight && "✨ Re-rendered"}
                </span>
                <h3 className="text-lg font-extrabold mt-1" style={{ color: "var(--text-primary)" }}>{username}</h3>
                <p className="text-xs font-semibold" style={{ color: themeColors[theme].accent }}>{role}</p>
              </div>

              <div className="text-right">
                <span className="text-[9px] uppercase tracking-wider font-mono opacity-60" style={{ color: "var(--text-muted)" }}>State</span>
                <p className="text-xl font-black" style={{ color: "var(--text-primary)" }}>{clickCount}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: "var(--border-primary)" }}>
              <button
                onClick={triggerStateUpdate}
                className="text-[10px] font-bold px-3 py-1.5 rounded-md text-white transition-all hover:brightness-115"
                style={{ backgroundColor: themeColors[theme].accent }}
              >
                Trigger State Change
              </button>
              <span className="text-[9px] font-mono" style={{ color: "var(--text-muted)" }}>Props &rarr; Read Only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Compiler Log Box */}
      <div className="rounded-xl p-3.5 border border-[var(--border-primary)] font-mono text-[10px] space-y-1.5" style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-primary)" }}>
        <div className="flex items-center gap-1.5 pb-1 border-b" style={{ borderColor: "var(--border-primary)", color: "var(--text-muted)" }}>
          <Cpu size={10} />
          <span>REACT FIBER MONITOR LOGS</span>
        </div>
        <div className="space-y-1 max-h-24 overflow-y-auto leading-relaxed">
          {logs.map((log, index) => (
            <div key={index} className="flex gap-1">
              <span style={{ color: "var(--text-accent)" }}>&gt;</span>
              <span style={{ color: index === 0 ? "var(--text-primary)" : "var(--text-secondary)" }}>{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 2. Express REST Client API Simulator ───────── */
export function ExpressRestController() {
  const [method, setMethod] = useState("GET");
  const [route, setRoute] = useState("/api/users");
  const [requestBody, setRequestBody] = useState('{\n  "username": "coder_jack",\n  "email": "jack@example.com"\n}');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [serverLogs, setServerLogs] = useState([
    "Express server started on port 5000.",
    "DB Connection checklist verified: MongoDB Connected successfully."
  ]);

  const handleSend = () => {
    setLoading(true);
    setResponse(null);

    // Add server request middleware entry
    const timestamp = new Date().toLocaleTimeString();
    const newLogs = [
      `[${timestamp}] Incoming Request: ${method} ${route}`,
      `[${timestamp}] Middleware: body-parser processed JSON payload.`,
      `[${timestamp}] Middleware: CORS configuration validation check passed.`
    ];

    setTimeout(() => {
      let status = 200;
      let data = {};

      if (route === "/api/users") {
        if (method === "GET") {
          status = 200;
          data = [
            { id: "u1", username: "alice_dev", email: "alice@synapse.com" },
            { id: "u2", username: "bob_engineer", email: "bob@synapse.com" }
          ];
          newLogs.push(`[${timestamp}] Controller: Querying all User models from MongoDB cluster...`);
          newLogs.push(`[${timestamp}] Controller: Database returned 2 documents.`);
        } else if (method === "POST") {
          try {
            const parsed = JSON.parse(requestBody);
            if (!parsed.username || !parsed.email) {
              status = 400;
              data = { success: false, error: "Validation Failed: username and email are required." };
              newLogs.push(`[${timestamp}] Controller: Schema validation error: username/email missing.`);
            } else {
              status = 201;
              data = { success: true, message: "User written into Database", user: { id: "u_" + Math.random().toString(36).substr(2, 4), ...parsed } };
              newLogs.push(`[${timestamp}] Controller: Cryptography block hashing password parameters...`);
              newLogs.push(`[${timestamp}] Controller: Model.save() successful, committed document to DB.`);
            }
          } catch (e) {
            status = 400;
            data = { success: false, error: "SyntaxError: Invalid JSON syntax in request body." };
            newLogs.push(`[${timestamp}] Middleware Error: Body parser crashed parsing invalid JSON body.`);
          }
        } else {
          status = 405;
          data = { success: false, error: `Method ${method} not allowed on route ${route}` };
          newLogs.push(`[${timestamp}] Warning: Endpoint matched route, but request verb method failed.`);
        }
      } else if (route.startsWith("/api/users/")) {
        const id = route.split("/")[3];
        if (method === "GET") {
          status = 200;
          data = { id, username: "dev_user_" + id, email: `user_${id}@example.com` };
          newLogs.push(`[${timestamp}] Controller: Fetching User by ID: ${id}`);
        } else if (method === "DELETE") {
          status = 200;
          data = { success: true, message: `User ${id} deleted successfully.` };
          newLogs.push(`[${timestamp}] Controller: Intercepted DELETE parameters. Deleting document from collection...`);
        } else {
          status = 405;
          data = { error: `Method ${method} not supported` };
        }
      } else {
        status = 404;
        data = { success: false, error: `Route ${route} not found` };
        newLogs.push(`[${timestamp}] Warning: No middleware routes mapped path: ${route}`);
      }

      newLogs.push(`[${timestamp}] Response sent: Status ${status}`);

      setServerLogs(prev => [...newLogs.reverse(), ...prev].slice(0, 10));
      setResponse({ status, data });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="rounded-2xl border border-[var(--border-primary)] overflow-hidden flex flex-col shadow-lg" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--border-primary)", backgroundColor: "var(--bg-hover)" }}>
        <div className="flex items-center gap-2">
          <Globe size={14} style={{ color: "var(--text-accent)" }} />
          <span className="text-[11px] font-mono font-bold" style={{ color: "var(--text-primary)" }}>Express.js API Router Lab</span>
        </div>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-[var(--border-primary)] border-emerald-500/20">
          Server: Running (Port 5000)
        </span>
      </div>

      {/* Core Interface Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-slate-200" style={{ backgroundColor: "var(--border-primary)" }}>
        
        {/* Left 5 cols: Request Panel */}
        <div className="lg:col-span-5 p-4 space-y-4 flex flex-col" style={{ backgroundColor: "var(--bg-card)" }}>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>HTTP Client Configuration</span>
          
          <div className="flex gap-2">
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="p-2.5 rounded-lg border border-[var(--border-primary)] outline-none text-xs font-bold shrink-0 cursor-pointer"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="DELETE">DELETE</option>
            </select>

            <select
              value={route}
              onChange={(e) => setRoute(e.target.value)}
              className="p-2.5 rounded-lg border border-[var(--border-primary)] outline-none text-xs font-semibold flex-1 cursor-pointer"
              style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
            >
              <option value="/api/users">/api/users (All users)</option>
              <option value="/api/users/99">/api/users/99 (Specific user)</option>
              <option value="/api/invalid-route">/api/invalid-route (404 Test)</option>
            </select>
          </div>

          {method === "POST" && (
            <div className="space-y-1">
              <label className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>JSON Request Body</label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                className="w-full h-24 p-2 rounded-lg font-mono text-[11px] outline-none border border-[var(--border-primary)] resize-none leading-relaxed"
                style={{ backgroundColor: "var(--bg-input)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}
              />
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-lg text-xs font-bold text-[var(--text-on-accent)] shadow transition-all flex items-center justify-center gap-1.5 hover:brightness-110 disabled:opacity-50"
            style={{ background: "var(--accent-gradient)" }}
          >
            {loading ? "Waiting..." : <>Send Request <Play size={10} fill="white" /></>}
          </button>
        </div>

        {/* Right 7 cols: Response Panel & Server Logs */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-[300px]" style={{ backgroundColor: "var(--bg-card)" }}>
          
          {/* Top Half: HTTP Response */}
          <div className="p-4 border-b flex-1 flex flex-col" style={{ borderColor: "var(--border-primary)" }}>
            <span className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>HTTP Client Response</span>
            
            <div className="flex-grow rounded-lg border border-[var(--border-primary)] p-3 font-mono text-[11px] overflow-auto flex flex-col justify-between" style={{ backgroundColor: "var(--bg-code)", borderColor: "var(--border-primary)" }}>
              {loading ? (
                <div className="flex items-center justify-center h-28 gap-2" style={{ color: "var(--text-muted)" }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-4 h-4 border-2 border-t-transparent rounded-full" style={{ borderColor: "var(--text-accent)" }} />
                  <span>Awaiting server processing response...</span>
                </div>
              ) : response ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: "var(--border-primary)" }}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">Status:</span>
                      <span className="font-bold px-2 py-0.5 rounded text-[10px]"
                        style={{
                          backgroundColor: response.status >= 300 ? "rgba(239, 68, 68, 0.1)" : "rgba(16, 185, 129, 0.1)",
                          color: response.status >= 300 ? "#ef4444" : "#10b981"
                        }}
                      >
                        {response.status} {response.status === 201 ? "Created" : response.status === 200 ? "OK" : response.status === 400 ? "Bad Request" : response.status === 404 ? "Not Found" : "Method Not Allowed"}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400">Content-Type: application/json</span>
                  </div>
                  <pre className="overflow-x-auto leading-relaxed max-h-36" style={{ color: "var(--text-primary)" }}>
                    <code>{JSON.stringify(response.data, null, 2)}</code>
                  </pre>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 h-28 text-center text-xs space-y-1">
                  <Globe size={20} style={{ color: "var(--text-muted)" }} />
                  <span>No requests fired yet. Set method and trigger client above.</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Half: Express Server Console */}
          <div className="p-4 flex flex-col bg-[var(--bg-card)] text-slate-300 font-mono text-[10px] h-40">
            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-[var(--border-primary)] text-slate-400 shrink-0">
              <Server size={10} />
              <span>EXPRESS MIDDLEWARE TERMINAL LOGGER</span>
            </div>
            
            <div className="flex-grow overflow-y-auto space-y-1.5 scrollbar-thin">
              {serverLogs.map((log, index) => (
                <div key={index} className="flex gap-1.5">
                  <span className="text-slate-500 shrink-0 select-none">$</span>
                  <span className={log.includes("Error") || log.includes("Warning") ? "text-rose-400" : log.includes("Incoming") ? "text-cyan-300" : "text-slate-300"}>{log}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

/* ─── 3. Next.js App Router File Explorer Map ────── */
export function NextRouterMap() {
  const [activeRoute, setActiveRoute] = useState("/");

  const routeFiles = {
    "/": {
      desc: "Root Landing page of Academy app. Fetches static files directly.",
      boundary: "React Server Component (RSC) by default. Zero bundle size, SEO optimized.",
      files: ["app/layout.jsx (Global Frame)", "app/page.jsx (Index Page)"],
      type: "Server"
    },
    "/dashboard": {
      desc: "Protected analytics workspace dashboard portal.",
      boundary: "Hybrid. Layout is Server Component, Widgets use 'use client' boundaries.",
      files: ["app/dashboard/layout.jsx (Dashboard Shell)", "app/dashboard/page.jsx (RSC Data Load)"],
      type: "Serverless"
    },
    "/dashboard/settings": {
      desc: "Forms panel updating user theme and profiles details.",
      boundary: "Client Component. Marked with 'use client' at top to access useState hooks.",
      files: ["app/dashboard/settings/page.jsx (Controlled Forms UI)"],
      type: "Client"
    },
    "/api/products": {
      desc: "Static custom Route Handler endpoint returning products collections.",
      boundary: "Backend API Endpoint. Operates serverless functions inside Next routing.",
      files: ["app/api/products/route.js (API GET/POST Endpoint)"],
      type: "API"
    }
  };

  const current = routeFiles[activeRoute];

  return (
    <div className="rounded-2xl border border-[var(--border-primary)] p-5 space-y-6 shadow-md" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)" }}>
      <div className="flex items-center gap-2">
        <Server size={18} style={{ color: "var(--text-accent)" }} />
        <h4 className="text-sm font-bold font-display" style={{ color: "var(--text-primary)" }}>Next.js 15 App Router Explorer</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left 5 cols: Route Tree Directory map */}
        <div className="md:col-span-5 space-y-3.5 text-xs font-semibold">
          <label className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: "var(--text-muted)" }}>
            APP ROUTER SUBFOLDERS MAP
          </label>

          <div className="space-y-1.5 pl-1.5 border-l-2" style={{ borderColor: "var(--border-primary)" }}>
            
            {/* Route 1 */}
            <button
              onClick={() => setActiveRoute("/")}
              className="flex w-full items-center justify-between p-2 rounded-lg text-left transition-colors"
              style={{
                backgroundColor: activeRoute === "/" ? "var(--bg-badge)" : "transparent",
                color: activeRoute === "/" ? "var(--text-accent)" : "var(--text-primary)"
              }}
            >
              <span>📁 app/</span>
              <span className="text-[9px] font-mono px-1 rounded border border-[var(--border-primary)] opacity-60">/</span>
            </button>

            {/* Route 2 */}
            <div className="pl-4 space-y-1">
              <button
                onClick={() => setActiveRoute("/dashboard")}
                className="flex w-full items-center justify-between p-2 rounded-lg text-left transition-colors"
                style={{
                  backgroundColor: activeRoute === "/dashboard" ? "var(--bg-badge)" : "transparent",
                  color: activeRoute === "/dashboard" ? "var(--text-accent)" : "var(--text-primary)"
                }}
              >
                <span>📁 dashboard/</span>
                <span className="text-[9px] font-mono px-1 rounded border border-[var(--border-primary)] opacity-60">/dashboard</span>
              </button>

              {/* Route 3 */}
              <div className="pl-4">
                <button
                  onClick={() => setActiveRoute("/dashboard/settings")}
                  className="flex w-full items-center justify-between p-2 rounded-lg text-left transition-colors"
                  style={{
                    backgroundColor: activeRoute === "/dashboard/settings" ? "var(--bg-badge)" : "transparent",
                    color: activeRoute === "/dashboard/settings" ? "var(--text-accent)" : "var(--text-primary)"
                  }}
                >
                  <span>📁 settings/</span>
                  <span className="text-[9px] font-mono px-1 rounded border border-[var(--border-primary)] opacity-60">/settings</span>
                </button>
              </div>
            </div>

            {/* Route 4 */}
            <div className="pl-4 space-y-1">
              <div className="pl-1 text-slate-400 select-none pointer-events-none text-[10px]">📁 api/</div>
              <div className="pl-4">
                <button
                  onClick={() => setActiveRoute("/api/products")}
                  className="flex w-full items-center justify-between p-2 rounded-lg text-left transition-colors"
                  style={{
                    backgroundColor: activeRoute === "/api/products" ? "var(--bg-badge)" : "transparent",
                    color: activeRoute === "/api/products" ? "var(--text-accent)" : "var(--text-primary)"
                  }}
                >
                  <span>📁 products/</span>
                  <span className="text-[9px] font-mono px-1 rounded border border-[var(--border-primary)] opacity-60">/api/products</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right 7 cols: Route Metadata Viewer */}
        <div className="md:col-span-7 space-y-4">
          <label className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: "var(--text-muted)" }}>
            ROUTE DETAILS & BOUNDARY
          </label>

          <div className="rounded-xl border border-[var(--border-primary)] p-4.5 space-y-4" style={{ backgroundColor: "var(--bg-hover)", borderColor: "var(--border-primary)" }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: "var(--text-accent)" }}>Route: {activeRoute}</span>
              <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold tracking-wide uppercase border`}
                style={{
                  backgroundColor: current.type === "Server" ? "rgba(99, 102, 241, 0.1)" : current.type === "Client" ? "rgba(217, 70, 239, 0.1)" : "rgba(16, 185, 129, 0.1)",
                  color: current.type === "Server" ? "#6366f1" : current.type === "Client" ? "#d946ef" : "#10b981",
                  borderColor: current.type === "Server" ? "rgba(99, 102, 241, 0.2)" : current.type === "Client" ? "rgba(217, 70, 239, 0.2)" : "rgba(16, 185, 129, 0.2)"
                }}
              >
                {current.type} Component
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold" style={{ color: "var(--text-secondary)" }}>Description:</span>
                <p style={{ color: "var(--text-secondary)" }}>{current.desc}</p>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold" style={{ color: "var(--text-secondary)" }}>Boundary Environment:</span>
                <p style={{ color: "var(--text-secondary)" }}>{current.boundary}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold block" style={{ color: "var(--text-secondary)" }}>Assigned File Nodes:</span>
                <div className="flex flex-col gap-1 text-[11px] font-mono">
                  {current.files.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 p-1 px-2.5 rounded border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-primary)", color: "var(--text-primary)" }}>
                      <CheckCircle2 size={10} className="text-emerald-500" />
                      <span>{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
