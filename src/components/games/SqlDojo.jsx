"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Script from "next/script";
import {
  ArrowLeft, ArrowRight, Play, CheckCircle2, XCircle,
  Trophy, RotateCcw, Database, Table2, AlertTriangle,
  ChevronRight, Lightbulb, Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── SQL Levels ────────────────────────────────────────────────────────────────
const LEVELS = [
  {
    id: 1,
    title: "Select All Employees",
    topic: "SELECT",
    difficulty: "Easy",
    instructions: "Retrieve all columns and all rows from the `employees` table.",
    hint: "Use `SELECT *` to select all columns. Then specify `FROM employees` to choose the table.",
    setupSQL: `
      CREATE TABLE employees (id INTEGER, name TEXT, department TEXT, salary INTEGER, age INTEGER);
      INSERT INTO employees VALUES (1,'Alice','Engineering',85000,29);
      INSERT INTO employees VALUES (2,'Bob','Marketing',62000,34);
      INSERT INTO employees VALUES (3,'Carol','Engineering',91000,41);
      INSERT INTO employees VALUES (4,'Dave','HR',54000,27);
      INSERT INTO employees VALUES (5,'Eve','Marketing',73000,38);
    `,
    solutionSQL: `SELECT * FROM employees;`,
    validate: (rows) => rows.length === 5,
    expectedDescription: "5 rows with all columns",
  },
  {
    id: 2,
    title: "Engineers Only",
    topic: "WHERE",
    difficulty: "Easy",
    instructions: "Retrieve the `name` and `salary` of all employees in the `Engineering` department.",
    hint: "Use `WHERE department = 'Engineering'` to filter rows. String values in SQL need single quotes.",
    setupSQL: `
      CREATE TABLE employees (id INTEGER, name TEXT, department TEXT, salary INTEGER, age INTEGER);
      INSERT INTO employees VALUES (1,'Alice','Engineering',85000,29);
      INSERT INTO employees VALUES (2,'Bob','Marketing',62000,34);
      INSERT INTO employees VALUES (3,'Carol','Engineering',91000,41);
      INSERT INTO employees VALUES (4,'Dave','HR',54000,27);
      INSERT INTO employees VALUES (5,'Eve','Marketing',73000,38);
    `,
    solutionSQL: `SELECT name, salary FROM employees WHERE department = 'Engineering';`,
    validate: (rows) => rows.length === 2 && rows.every(r => r.salary !== undefined),
    expectedDescription: "2 rows: Alice and Carol with their salaries",
  },
  {
    id: 3,
    title: "Sort by Salary",
    topic: "ORDER BY",
    difficulty: "Easy",
    instructions: "List all employee names and salaries, sorted from highest to lowest salary.",
    hint: "Use `ORDER BY salary DESC` to sort in descending order. `ASC` is the default (low to high).",
    setupSQL: `
      CREATE TABLE employees (id INTEGER, name TEXT, department TEXT, salary INTEGER, age INTEGER);
      INSERT INTO employees VALUES (1,'Alice','Engineering',85000,29);
      INSERT INTO employees VALUES (2,'Bob','Marketing',62000,34);
      INSERT INTO employees VALUES (3,'Carol','Engineering',91000,41);
      INSERT INTO employees VALUES (4,'Dave','HR',54000,27);
      INSERT INTO employees VALUES (5,'Eve','Marketing',73000,38);
    `,
    solutionSQL: `SELECT name, salary FROM employees ORDER BY salary DESC;`,
    validate: (rows) => {
      if (rows.length !== 5) return false;
      for (let i = 0; i < rows.length - 1; i++) {
        if (rows[i].salary < rows[i + 1].salary) return false;
      }
      return true;
    },
    expectedDescription: "5 rows sorted by salary descending (Carol first at 91000)",
  },
  {
    id: 4,
    title: "Salary Statistics",
    topic: "GROUP BY",
    difficulty: "Medium",
    instructions: "Show each department with the total number of employees and their average salary. Round the average salary to 0 decimal places.",
    hint: "Use `GROUP BY department` with `COUNT(*)` and `ROUND(AVG(salary), 0)` as aggregation functions.",
    setupSQL: `
      CREATE TABLE employees (id INTEGER, name TEXT, department TEXT, salary INTEGER, age INTEGER);
      INSERT INTO employees VALUES (1,'Alice','Engineering',85000,29);
      INSERT INTO employees VALUES (2,'Bob','Marketing',62000,34);
      INSERT INTO employees VALUES (3,'Carol','Engineering',91000,41);
      INSERT INTO employees VALUES (4,'Dave','HR',54000,27);
      INSERT INTO employees VALUES (5,'Eve','Marketing',73000,38);
    `,
    solutionSQL: `SELECT department, COUNT(*) AS employee_count, ROUND(AVG(salary), 0) AS avg_salary FROM employees GROUP BY department;`,
    validate: (rows) => rows.length === 3 && rows.every(r => r.employee_count !== undefined || r["COUNT(*)"] !== undefined),
    expectedDescription: "3 rows: one per department with count and avg salary",
  },
  {
    id: 5,
    title: "High Earners",
    topic: "HAVING",
    difficulty: "Medium",
    instructions: "Show departments where the average salary exceeds 70,000.",
    hint: "Use `HAVING AVG(salary) > 70000` after `GROUP BY`. `HAVING` filters groups, while `WHERE` filters individual rows.",
    setupSQL: `
      CREATE TABLE employees (id INTEGER, name TEXT, department TEXT, salary INTEGER, age INTEGER);
      INSERT INTO employees VALUES (1,'Alice','Engineering',85000,29);
      INSERT INTO employees VALUES (2,'Bob','Marketing',62000,34);
      INSERT INTO employees VALUES (3,'Carol','Engineering',91000,41);
      INSERT INTO employees VALUES (4,'Dave','HR',54000,27);
      INSERT INTO employees VALUES (5,'Eve','Marketing',73000,38);
    `,
    solutionSQL: `SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department HAVING AVG(salary) > 70000;`,
    validate: (rows) => rows.length === 2,
    expectedDescription: "2 rows: Engineering and Marketing (avg > 70k)",
  },
  {
    id: 6,
    title: "Employee Projects",
    topic: "JOIN",
    difficulty: "Medium",
    instructions: "Show each employee's name alongside the project they are assigned to. Use an INNER JOIN between `employees` and `projects`.",
    hint: "Join on the shared key: `ON employees.id = projects.employee_id`. An INNER JOIN only returns matching rows.",
    setupSQL: `
      CREATE TABLE employees (id INTEGER, name TEXT, department TEXT, salary INTEGER, age INTEGER);
      INSERT INTO employees VALUES (1,'Alice','Engineering',85000,29);
      INSERT INTO employees VALUES (2,'Bob','Marketing',62000,34);
      INSERT INTO employees VALUES (3,'Carol','Engineering',91000,41);
      INSERT INTO employees VALUES (4,'Dave','HR',54000,27);
      INSERT INTO employees VALUES (5,'Eve','Marketing',73000,38);
      CREATE TABLE projects (id INTEGER, employee_id INTEGER, project_name TEXT, deadline TEXT);
      INSERT INTO projects VALUES (1,1,'API Redesign','2025-03-01');
      INSERT INTO projects VALUES (2,3,'Auth Module','2025-04-15');
      INSERT INTO projects VALUES (3,2,'Campaign Portal','2025-02-28');
      INSERT INTO projects VALUES (4,5,'Social Ads','2025-05-10');
    `,
    solutionSQL: `SELECT employees.name, projects.project_name FROM employees INNER JOIN projects ON employees.id = projects.employee_id;`,
    validate: (rows) => rows.length === 4 && rows[0].name !== undefined,
    expectedDescription: "4 rows: each employee with their project (Dave has none)",
  },
  {
    id: 7,
    title: "All Employees + Projects",
    topic: "LEFT JOIN",
    difficulty: "Medium",
    instructions: "Show ALL employees and their projects. Employees without a project should appear with NULL as the project name.",
    hint: "Use `LEFT JOIN` to include all rows from the left table (employees) even if no match exists in the right table (projects).",
    setupSQL: `
      CREATE TABLE employees (id INTEGER, name TEXT, department TEXT, salary INTEGER, age INTEGER);
      INSERT INTO employees VALUES (1,'Alice','Engineering',85000,29);
      INSERT INTO employees VALUES (2,'Bob','Marketing',62000,34);
      INSERT INTO employees VALUES (3,'Carol','Engineering',91000,41);
      INSERT INTO employees VALUES (4,'Dave','HR',54000,27);
      INSERT INTO employees VALUES (5,'Eve','Marketing',73000,38);
      CREATE TABLE projects (id INTEGER, employee_id INTEGER, project_name TEXT, deadline TEXT);
      INSERT INTO projects VALUES (1,1,'API Redesign','2025-03-01');
      INSERT INTO projects VALUES (2,3,'Auth Module','2025-04-15');
      INSERT INTO projects VALUES (3,2,'Campaign Portal','2025-02-28');
      INSERT INTO projects VALUES (4,5,'Social Ads','2025-05-10');
    `,
    solutionSQL: `SELECT employees.name, projects.project_name FROM employees LEFT JOIN projects ON employees.id = projects.employee_id;`,
    validate: (rows) => rows.length === 5,
    expectedDescription: "5 rows: all employees, Dave has NULL project",
  },
  {
    id: 8,
    title: "Top Earner in Each Dept",
    topic: "Subquery",
    difficulty: "Hard",
    instructions: "Find the name and salary of the highest-paid employee in each department using a subquery.",
    hint: "Use a subquery in the WHERE clause: `WHERE salary = (SELECT MAX(salary) FROM employees e2 WHERE e2.department = employees.department)`.",
    setupSQL: `
      CREATE TABLE employees (id INTEGER, name TEXT, department TEXT, salary INTEGER, age INTEGER);
      INSERT INTO employees VALUES (1,'Alice','Engineering',85000,29);
      INSERT INTO employees VALUES (2,'Bob','Marketing',62000,34);
      INSERT INTO employees VALUES (3,'Carol','Engineering',91000,41);
      INSERT INTO employees VALUES (4,'Dave','HR',54000,27);
      INSERT INTO employees VALUES (5,'Eve','Marketing',73000,38);
    `,
    solutionSQL: `SELECT name, department, salary FROM employees WHERE salary = (SELECT MAX(salary) FROM employees e2 WHERE e2.department = employees.department);`,
    validate: (rows) => rows.length === 3,
    expectedDescription: "3 rows: Carol (Eng), Eve (Mktg), Dave (HR) — top earner per dept",
  },
  {
    id: 9,
    title: "Senior Engineers",
    topic: "WHERE + AND",
    difficulty: "Medium",
    instructions: "Find employees in Engineering who are older than 30.",
    hint: "Combine conditions with `AND`: `WHERE department = 'Engineering' AND age > 30`.",
    setupSQL: `
      CREATE TABLE employees (id INTEGER, name TEXT, department TEXT, salary INTEGER, age INTEGER);
      INSERT INTO employees VALUES (1,'Alice','Engineering',85000,29);
      INSERT INTO employees VALUES (2,'Bob','Marketing',62000,34);
      INSERT INTO employees VALUES (3,'Carol','Engineering',91000,41);
      INSERT INTO employees VALUES (4,'Dave','HR',54000,27);
      INSERT INTO employees VALUES (5,'Eve','Marketing',73000,38);
    `,
    solutionSQL: `SELECT name, age FROM employees WHERE department = 'Engineering' AND age > 30;`,
    validate: (rows) => rows.length === 1 && rows[0].name === "Carol",
    expectedDescription: "1 row: Carol (age 41, Engineering)",
  },
  {
    id: 10,
    title: "Limited Top Earners",
    topic: "LIMIT",
    difficulty: "Easy",
    instructions: "Show the top 3 highest-paid employees (name and salary only).",
    hint: "Sort by salary descending using `ORDER BY salary DESC` then restrict results with `LIMIT 3`.",
    setupSQL: `
      CREATE TABLE employees (id INTEGER, name TEXT, department TEXT, salary INTEGER, age INTEGER);
      INSERT INTO employees VALUES (1,'Alice','Engineering',85000,29);
      INSERT INTO employees VALUES (2,'Bob','Marketing',62000,34);
      INSERT INTO employees VALUES (3,'Carol','Engineering',91000,41);
      INSERT INTO employees VALUES (4,'Dave','HR',54000,27);
      INSERT INTO employees VALUES (5,'Eve','Marketing',73000,38);
    `,
    solutionSQL: `SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3;`,
    validate: (rows) => rows.length === 3 && rows[0].name === "Carol",
    expectedDescription: "3 rows: Carol (91k), Alice (85k), Eve (73k)",
  },
];

const STORAGE_KEY = "game_progress_sql-dojo";
const DIFF_COLOR = {
  Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  Medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  Hard: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

function loadProgress() {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function saveProgress(data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─── Simple result table renderer ─────────────────────────────────────────────
function ResultTable({ columns, rows }) {
  if (!columns || columns.length === 0) return null;
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-primary)] border-white/8">
      <table className="min-w-full text-xs font-mono">
        <thead>
          <tr className="bg-white/5 border-b border-white/8">
            {columns.map(col => (
              <th key={col} className="px-3 py-2 text-left text-emerald-400 font-bold uppercase tracking-wider whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-b border-white/4 ${i % 2 === 0 ? "bg-white/2" : ""}`}>
              {columns.map(col => (
                <td key={col} className="px-3 py-2 text-white/60 whitespace-nowrap">
                  {row[col] == null ? <span className="text-white/20 italic">NULL</span> : String(row[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SqlDojo({ onBack }) {
  const [sqlReady, setSqlReady] = useState(false);
  const [levelIdx, setLevelIdx] = useState(0);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null); // { columns, rows } | null
  const [error, setError] = useState(null);
  const [phase, setPhase] = useState("playing"); // playing | correct | wrong | finished
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [progress, setProgress] = useState(loadProgress);
  const [activeTab, setActiveTab] = useState("query"); // query | schema | result

  const dbRef = useRef(null);
  const level = LEVELS[levelIdx];
  const total = LEVELS.length;

  // ─── Initialize sql.js DB for current level ────────────────────────────────
  const initDB = useCallback(() => {
    if (typeof window === "undefined" || !window.initSqlJs) return;
    window.initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
    }).then(SQL => {
      const db = new SQL.Database();
      db.run(level.setupSQL);
      dbRef.current = db;
      setSqlReady(true);
    }).catch(err => {
      console.error("sql.js init error:", err);
    });
  }, [level.setupSQL]);

  useEffect(() => {
    setSqlReady(false);
    setQuery("");
    setResult(null);
    setError(null);
    setPhase("playing");
    setShowHint(false);
    setShowSolution(false);
    setActiveTab("query");
    if (typeof window !== "undefined" && window.initSqlJs) {
      initDB();
    }
  }, [levelIdx, initDB]);

  // ─── Run query ──────────────────────────────────────────────────────────────
  function runQuery() {
    if (!dbRef.current) return;
    setError(null);
    setResult(null);
    try {
      const stmts = dbRef.current.exec(query);
      if (!stmts || stmts.length === 0) {
        setResult({ columns: [], rows: [] });
        return;
      }
      const stmt = stmts[0];
      const columns = stmt.columns;
      const rows = stmt.values.map(row => {
        const obj = {};
        columns.forEach((col, i) => { obj[col] = row[i]; });
        return obj;
      });
      setResult({ columns, rows });
      setActiveTab("result");

      // Validate
      if (level.validate(rows)) {
        const key = `level_${level.id}`;
        const newProg = {
          ...progress,
          completedLevels: Array.from(new Set([...(progress.completedLevels || []), String(level.id)])),
          [key]: { completed: true },
        };
        setProgress(newProg);
        saveProgress(newProg);
        setPhase("correct");
      }
    } catch (e) {
      setError(e.message);
      setActiveTab("result");
    }
  }

  // ─── Navigation ─────────────────────────────────────────────────────────────
  function next() {
    if (levelIdx + 1 >= total) {
      setPhase("finished");
    } else {
      setLevelIdx(l => l + 1);
    }
  }

  const completedCount = (progress.completedLevels || []).length;

  // ─── Keyboard shortcut Ctrl+Enter ──────────────────────────────────────────
  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      runQuery();
    }
  }

  if (phase === "finished") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#090B14] via-[#0C1021] to-[#070A12] text-white flex items-center justify-center p-6">
        <div className="fixed top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 border border-[var(--border-primary)] border-emerald-500/20 rounded-3xl p-8 text-center space-y-6 relative z-10"
        >
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-amber-500/15 border border-[var(--border-primary)] border-amber-500/25">
              <Trophy size={36} className="text-amber-300" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-black">SQL Dojo — Cleared!</h2>
            <p className="text-sm text-white/40 font-mono mt-1">
              You completed all {total} SQL challenges
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 border border-[var(--border-primary)] border-white/6 rounded-2xl p-4">
              <div className="text-3xl font-black text-emerald-300">{completedCount}</div>
              <div className="text-[9px] uppercase tracking-wider text-white/30 font-bold mt-1">Solved</div>
            </div>
            <div className="bg-white/5 border border-[var(--border-primary)] border-white/6 rounded-2xl p-4">
              <div className="text-3xl font-black text-cyan-300">{total}</div>
              <div className="text-[9px] uppercase tracking-wider text-white/30 font-bold mt-1">Total</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => { setLevelIdx(0); setPhase("playing"); }}
              className="px-5 py-2.5 rounded-xl border border-[var(--border-primary)] border-white/10 bg-white/5 text-white/70 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <RotateCcw size={13} /> Play Again
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft size={13} /> Arcade Hub
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* Load sql.js from CDN */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js"
        strategy="lazyOnload"
        onLoad={initDB}
      />

      <div className="min-h-screen bg-gradient-to-br from-[#090B14] via-[#0C1021] to-[#070A12] text-white p-4 md:p-6">
        <div className="fixed top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-cyan-500/6 blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto space-y-5 relative z-10">

          {/* ── Nav ──────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-primary)] border-emerald-500/20 bg-emerald-950/20 text-emerald-300 hover:text-white hover:border-emerald-400/40 transition-all text-xs font-bold font-mono cursor-pointer"
            >
              <ArrowLeft size={13} /> Exit Arena
            </button>
            <div className="flex items-center gap-2 text-xs font-mono text-white/30">
              <Database size={12} className="text-emerald-400" />
              <span>{completedCount}/{total} solved</span>
            </div>
          </div>

          {/* ── Header ───────────────────────────────────────────────── */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-[var(--border-primary)] border-emerald-500/20">
                <Database size={20} className="text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black">SQL Dojo</h1>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--border-primary)] font-mono ${DIFF_COLOR[level.difficulty]}`}>
                    {level.difficulty}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-[var(--border-primary)] border-cyan-500/20 bg-cyan-500/8 text-cyan-400 font-mono">
                    {level.topic}
                  </span>
                </div>
                <p className="text-xs text-white/35 font-mono">Level {levelIdx + 1}/{total}: {level.title}</p>
              </div>
            </div>
          </div>

          {/* ── Level progress dots ───────────────────────────────────── */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {LEVELS.map((l, i) => {
              const done = (progress.completedLevels || []).includes(String(l.id));
              const isActive = i === levelIdx;
              return (
                <button
                  key={l.id}
                  onClick={() => setLevelIdx(i)}
                  className={`w-7 h-7 rounded-full text-[9px] font-bold font-mono border border-[var(--border-primary)] transition-all cursor-pointer flex items-center justify-center ${
                    isActive
                      ? "bg-emerald-500 border-emerald-400 text-black shadow-[0_0_10px_rgba(52,211,153,0.4)]"
                      : done
                      ? "bg-emerald-900/40 border-emerald-500/30 text-emerald-400"
                      : "bg-white/3 border-white/10 text-white/30 hover:text-white/60"
                  }`}
                >
                  {done && !isActive ? <CheckCircle2 size={11} /> : i + 1}
                </button>
              );
            })}
          </div>

          {/* ── Main 2-col layout ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* LEFT: Instructions + Schema Preview */}
            <div className="space-y-4">
              <div className="bg-[#0D1117]/80 border border-[var(--border-primary)] border-white/8 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <Table2 size={15} className="text-emerald-400" />
                  {level.title}
                </h3>
                <p className="text-xs text-white/55 leading-relaxed">{level.instructions}</p>
                <p className="text-[10px] text-white/25 font-mono">Expected: {level.expectedDescription}</p>

                {/* Hint */}
                <button
                  onClick={() => setShowHint(h => !h)}
                  className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-amber-400 transition-colors cursor-pointer font-mono"
                >
                  <Lightbulb size={12} />
                  {showHint ? "Hide hint" : "Show hint"}
                </button>
                <AnimatePresence>
                  {showHint && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-amber-500/8 border border-[var(--border-primary)] border-amber-500/20 rounded-xl p-3">
                        <p className="text-xs text-amber-200/70 leading-relaxed font-mono">{level.hint}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Solution reveal */}
                <button
                  onClick={() => setShowSolution(s => !s)}
                  className="flex items-center gap-1.5 text-[11px] text-white/20 hover:text-rose-400 transition-colors cursor-pointer font-mono"
                >
                  <Star size={12} />
                  {showSolution ? "Hide solution" : "Reveal solution"}
                </button>
                <AnimatePresence>
                  {showSolution && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-rose-500/8 border border-[var(--border-primary)] border-rose-500/20 rounded-xl p-3">
                        <p className="text-[10px] text-rose-300/50 mb-1 font-bold uppercase tracking-wider">Solution</p>
                        <pre className="text-xs text-rose-200/70 font-mono whitespace-pre-wrap break-all">{level.solutionSQL}</pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Data table preview */}
              <div className="bg-[#0D1117]/80 border border-[var(--border-primary)] border-white/8 rounded-2xl p-4 space-y-2">
                <p className="text-[10px] font-bold font-mono uppercase tracking-wider text-white/30">
                  employees table (preview)
                </p>
                <ResultTable
                  columns={["id", "name", "department", "salary", "age"]}
                  rows={[
                    { id: 1, name: "Alice", department: "Engineering", salary: 85000, age: 29 },
                    { id: 2, name: "Bob", department: "Marketing", salary: 62000, age: 34 },
                    { id: 3, name: "Carol", department: "Engineering", salary: 91000, age: 41 },
                    { id: 4, name: "Dave", department: "HR", salary: 54000, age: 27 },
                    { id: 5, name: "Eve", department: "Marketing", salary: 73000, age: 38 },
                  ]}
                />
              </div>
            </div>

            {/* RIGHT: Query Editor + Results */}
            <div className="space-y-4">
              {/* Tabs */}
              <div className="flex items-center gap-1 bg-white/3 border border-[var(--border-primary)] border-white/6 rounded-xl p-1 w-fit">
                {["query", "result"].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer capitalize ${
                      activeTab === tab
                        ? "bg-emerald-500/20 border border-[var(--border-primary)] border-emerald-500/30 text-emerald-300"
                        : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "query" && (
                <div className="bg-[#0D1117]/80 border border-[var(--border-primary)] border-white/8 rounded-2xl overflow-hidden">
                  <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5">
                    <span className="w-2 h-2 rounded-full bg-rose-500/60" />
                    <span className="w-2 h-2 rounded-full bg-amber-500/60" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
                    <span className="ml-2 text-[10px] font-mono text-white/20">query.sql</span>
                    <span className="ml-auto text-[9px] font-mono text-white/15">Ctrl+Enter to run</span>
                  </div>
                  <textarea
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Write your SQL query here..."
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="off"
                    rows={10}
                    className="w-full bg-transparent text-white/80 font-mono text-sm p-4 outline-none resize-none placeholder:text-white/15 leading-7"
                  />
                </div>
              )}

              {activeTab === "result" && (
                <div className="bg-[#0D1117]/80 border border-[var(--border-primary)] border-white/8 rounded-2xl p-4 min-h-[280px] space-y-3">
                  {!result && !error && (
                    <div className="flex flex-col items-center justify-center h-48 text-center space-y-2">
                      <Database size={28} className="text-white/15" />
                      <p className="text-xs text-white/20 font-mono">Run a query to see results here</p>
                    </div>
                  )}
                  {error && (
                    <div className="bg-rose-500/10 border border-[var(--border-primary)] border-rose-500/20 rounded-xl p-3 flex items-start gap-2">
                      <AlertTriangle size={14} className="text-rose-400 shrink-0 mt-0.5" />
                      <pre className="text-xs text-rose-300/70 font-mono whitespace-pre-wrap break-all">{error}</pre>
                    </div>
                  )}
                  {result && !error && (
                    <>
                      <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
                        {result.rows.length} row{result.rows.length !== 1 ? "s" : ""} returned
                      </p>
                      {result.rows.length > 0
                        ? <ResultTable columns={result.columns} rows={result.rows} />
                        : <p className="text-xs text-white/30 font-mono">No rows returned.</p>
                      }
                    </>
                  )}
                </div>
              )}

              {/* Run button */}
              <div className="flex items-center gap-3">
                {!sqlReady && (
                  <p className="text-[10px] text-white/25 font-mono animate-pulse">Loading SQL engine…</p>
                )}
                <button
                  onClick={runQuery}
                  disabled={!sqlReady || !query.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black text-xs transition-all hover:shadow-[0_0_14px_rgba(52,211,153,0.4)] cursor-pointer"
                >
                  <Play size={13} />
                  Run Query
                </button>
                <button
                  onClick={() => { setQuery(""); setResult(null); setError(null); setActiveTab("query"); }}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[var(--border-primary)] border-white/8 bg-white/3 text-white/40 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <RotateCcw size={12} /> Clear
                </button>
              </div>

              {/* Feedback */}
              <AnimatePresence>
                {phase === "correct" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-emerald-500/10 border border-[var(--border-primary)] border-emerald-500/25 rounded-2xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-emerald-400" />
                      <div>
                        <p className="text-sm font-black text-emerald-300">Correct Query!</p>
                        <p className="text-xs text-white/40 font-mono">Results match expected output</p>
                      </div>
                    </div>
                    <button
                      onClick={next}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      {levelIdx + 1 >= total ? <><Trophy size={12} /> Finish</> : <>Next <ChevronRight size={12} /></>}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
