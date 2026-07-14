"use client";

import React, { useState, useEffect } from "react";
import { Play, Sparkles, RefreshCw, Send, CheckCircle2, AlertCircle, HelpCircle, Layers, Cpu, Award } from "lucide-react";

// Widget 1: Prompt Playground
export function PromptPlayground() {
  const [role, setRole] = useState("Professional Marketer");
  const [context, setContext] = useState("We are launching a solar-powered coffee mug.");
  const [task, setTask] = useState("Write a catchy social media announcement.");
  const [format, setFormat] = useState("One paragraph, bullet points of key features, and 3 hashtags.");
  const [response, setResponse] = useState("");
  const [score, setScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const testPrompt = () => {
    setIsGenerating(true);
    setResponse("");
    
    // Calculate prompt completeness score
    let tempScore = 0;
    if (role.trim()) tempScore += 25;
    if (context.trim()) tempScore += 25;
    if (task.trim()) tempScore += 25;
    if (format.trim()) tempScore += 25;
    setScore(tempScore);

    setTimeout(() => {
      let resultText = "";
      const lowerRole = role.toLowerCase();
      const lowerContext = context.toLowerCase();
      
      // Dynamic response builder
      if (lowerRole.includes("pirate")) {
        resultText = `Arrr! Listen up, ye landlubbers! 🏴‍☠️\n\nWe be launchin' the finest treasure on the high seas: a mug powered by the mighty sun itself! Keep yer grog steaming hot while ye sail through cold winds!\n\n☠️ Hot grog all day long\n☠️ Powered by daylight\n☠️ No plugs needed on deck\n\n#HotGrog #PirateLife #SolarSails`;
      } else if (lowerRole.includes("teacher") || lowerRole.includes("kindergarten")) {
        resultText = `Good morning, class! ☀️\n\nToday, we have a super exciting discovery! Look at this magical mug that uses the sunshine to keep your hot cocoa cozy and warm. Isn't science amazing?\n\n✨ Cozy drinks\n✨ Powered by sunbeams\n✨ Eco-friendly for our earth\n\n#ScienceIsFun #SolarMug #CozyCocoa`;
      } else if (lowerRole.includes("developer") || lowerRole.includes("programmer") || lowerRole.includes("tech")) {
        resultText = `// Release Announcement: SolarMug v1.0.0\n\n🚀 Introducing the ultimate hardware stack upgrade for your morning compile cycles. Powered by high-efficiency solar cells, this mug maintains optimal beverage temperature through continuous background threads.\n\n*   [Feature] Passive solar recharge\n*   [Feature] Infinite loop temperature control\n*   [Feature] Zero plugin overhead\n\n#DevLife #HardwareHacks #CoffeeOps`;
      } else {
        // Default marketer
        resultText = `🚀 Big news! Say goodbye to lukewarm drinks forever.\n\nWe are thrilled to introduce our new revolutionary solar-powered coffee mug! Designed for busy commuters and outdoor enthusiasts, this mug captures daylight to maintain your drink's perfect temperature.\n\n🔋 Infinite solar heating\n🔋 Double-walled insulation\n🔋 Zero battery chargers required\n\n#Innovation #GreenEnergy #MorningBoost`;
      }

      if (tempScore < 75) {
        resultText = `⚠️ PROMPT ANALYSIS: YOUR PROMPT LACKS IMPORTANT CONTEXT.\n\n[AI Response with low precision]:\nHello. Here is a generic announcement about a mug: We have a new mug. It runs on solar energy. It is good for coffee. Thank you.`;
      }

      setResponse(resultText);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-50 text-zinc-600">
          <Sparkles size={16} />
        </div>
        <h4 className="font-bold text-slate-800 text-sm">Interactive Prompt Engineering Sandbox</h4>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">1. Role / Persona ("Act as a...")</label>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:border-zinc-500 focus:outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Senior JavaScript Developer, Pirate Captain, etc."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">2. Context / Background (The scenario)</label>
          <textarea
            className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:border-zinc-500 focus:outline-none h-14 resize-none"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Describe the product or situation..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">3. Specific Task (What to do)</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:border-zinc-500 focus:outline-none"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g., Write a product email, slogan, etc."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">4. Format & Constraints</label>
            <input
              type="text"
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:border-zinc-500 focus:outline-none"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="e.g., 3 bullet points, under 100 words..."
            />
          </div>
        </div>

        <button
          onClick={testPrompt}
          disabled={isGenerating}
          className="flex w-full items-center justify-center space-x-1.5 rounded-lg bg-zinc-600 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors disabled:bg-slate-300"
        >
          {isGenerating ? (
            <>
              <RefreshCw size={14} className="animate-spin" />
              <span>Model Thinking...</span>
            </>
          ) : (
            <>
              <Play size={14} />
              <span>Simulate Prompt Response</span>
            </>
          )}
        </button>

        {response && (
          <div className="mt-4 rounded-lg bg-slate-50 p-4 border border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-200/50 pb-2">
              <span className="font-semibold text-slate-600">Prompt Score:</span>
              <div className="flex items-center space-x-2">
                <span className={`font-bold ${score >= 75 ? "text-emerald-600" : "text-amber-500"}`}>{score}% Structured</span>
                <span className="text-[10px] text-slate-400">(Role, Context, Task, Format)</span>
              </div>
            </div>
            <pre className="whitespace-pre-wrap text-[11px] font-mono text-slate-700 bg-white border border-slate-200/50 p-3 rounded-md overflow-x-auto max-h-48 leading-relaxed">
              {response}
            </pre>
            <div className="flex items-start space-x-1.5 text-[10px] text-slate-500">
              {score >= 75 ? (
                <>
                  <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Excellent! Giving the AI all 4 parts of the framework ensures a highly targeted output. Try changing the Role to <strong>"Pirate Captain"</strong> or <strong>"Kindergarten Teacher"</strong> to see how the tone adjusts.</span>
                </>
              ) : (
                <>
                  <AlertCircle size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <span>Your prompt is missing structural components. Try filling in all 4 inputs to raise your prompt score and get a high-quality answer.</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Widget 2: Token Visualizer
export function TokenVisualizer() {
  const [text, setText] = useState("Generative AI is revolutionary because it understands complex patterns.");
  const [tokens, setTokens] = useState([]);
  const [stats, setStats] = useState({ chars: 0, words: 0, tokensCount: 0 });

  useEffect(() => {
    // Simple tokenizer simulation: split by spaces/punctuation and slice long chunks
    if (!text.trim()) {
      setTokens([]);
      setStats({ chars: 0, words: 0, tokensCount: 0 });
      return;
    }

    const wordsArray = text.trim().split(/\s+/);
    const tokenList = [];
    const colors = [
      "bg-zinc-100 text-zinc-800 border-zinc-200",
      "bg-violet-100 text-violet-800 border-violet-200",
      "bg-pink-100 text-pink-800 border-pink-200",
      "bg-emerald-100 text-emerald-800 border-emerald-200",
      "bg-sky-100 text-sky-800 border-sky-200",
      "bg-amber-100 text-amber-800 border-amber-200"
    ];

    let colorIndex = 0;

    wordsArray.forEach((w) => {
      // simulate word splits if word is longer than 5 chars
      if (w.length > 6) {
        const mid = Math.ceil(w.length / 2);
        const tok1 = w.slice(0, mid);
        const tok2 = w.slice(mid);
        tokenList.push({ text: tok1, color: colors[colorIndex % colors.length] });
        colorIndex++;
        tokenList.push({ text: tok2, color: colors[colorIndex % colors.length] });
        colorIndex++;
      } else {
        tokenList.push({ text: w, color: colors[colorIndex % colors.length] });
        colorIndex++;
      }
    });

    setTokens(tokenList);
    setStats({
      chars: text.length,
      words: wordsArray.length,
      tokensCount: tokenList.length
    });
  }, [text]);

  const fillExample = (ex) => {
    setText(ex);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
          <Layers size={16} />
        </div>
        <h4 className="font-bold text-slate-800 text-sm">Interactive Token Visualizer</h4>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Enter Text to Tokenize:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-700 focus:border-zinc-500 focus:outline-none h-20 resize-none leading-relaxed"
            placeholder="Type your sentences here..."
          />
        </div>

        {/* Quick Examples */}
        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] text-slate-400 font-medium self-center mr-1">Examples:</span>
          <button
            onClick={() => fillExample("Supercalifragilisticexpialidocious")}
            className="rounded bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600"
          >
            Long Word
          </button>
          <button
            onClick={() => fillExample("function add(a, b) {\n  return a + b;\n}")}
            className="rounded bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600"
          >
            Code Block
          </button>
          <button
            onClick={() => fillExample("Hello, how are you today? 🌸")}
            className="rounded bg-slate-100 hover:bg-slate-200 px-2 py-0.5 text-[10px] text-slate-600"
          >
            Short Query
          </button>
        </div>

        {/* Output Metrics */}
        <div className="grid grid-cols-3 gap-3 border-y border-slate-100 py-3 bg-slate-50/50 rounded-lg px-2">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-800">{stats.chars}</div>
            <div className="text-[9px] font-semibold text-slate-400 uppercase">Characters</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-slate-800">{stats.words}</div>
            <div className="text-[9px] font-semibold text-slate-400 uppercase">Words</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-zinc-600">{stats.tokensCount}</div>
            <div className="text-[9px] font-semibold text-zinc-400 uppercase">Est. Tokens</div>
          </div>
        </div>

        {/* Token Highlights Box */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Tokenized View (Alternating Colors):</label>
          <div className="flex flex-wrap gap-1 rounded-lg border border-slate-150 p-3 bg-slate-50 min-h-[50px]">
            {tokens.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No input to show.</span>
            ) : (
              tokens.map((tok, idx) => (
                <span
                  key={idx}
                  className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono border ${tok.color}`}
                >
                  {tok.text}
                </span>
              ))
            )}
          </div>
        </div>

        {/* Context Window Capacity Meter */}
        <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-semibold text-slate-500">Context Window Occupied (4,000 Token Cap):</span>
            <span className="font-bold text-slate-600">{((stats.tokensCount / 4000) * 100).toFixed(2)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-zinc-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (stats.tokensCount / 4000) * 100)}%` }}
            />
          </div>
          <p className="text-[9px] text-slate-400 leading-normal">
            For models like older GPT-3.5 (4k limit), this text leaves roughly {4000 - stats.tokensCount} tokens for the conversation response.
          </p>
        </div>
      </div>
    </div>
  );
}

// Widget 3: ML Spam Classifier
export function ClassifierSandbox() {
  const [emails, setEmails] = useState([
    { text: "GET FREE BITCOIN NOW! CLICK THIS SECURE LINK!", actual: "Spam", pred: null, conf: null },
    { text: "Hey! Just wanted to check if you are free for lunch tomorrow around noon.", actual: "Ham", pred: null, conf: null },
    { text: "URGENT: Your account password has been compromised. Verify credit card details.", actual: "Spam", pred: null, conf: null },
    { text: "Hi team, please find attached the draft agenda file for the marketing review.", actual: "Ham", pred: null, conf: null }
  ]);
  const [customText, setCustomText] = useState("");
  const [isTraining, setIsTraining] = useState(false);
  const [isTrained, setIsTrained] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [accuracy, setAccuracy] = useState(50);
  const [customPred, setCustomPred] = useState(null);

  // Train algorithm loop
  const trainModel = () => {
    setIsTraining(true);
    setEpoch(0);
    setAccuracy(50);
    setIsTrained(false);

    let currentEpoch = 0;
    const interval = setInterval(() => {
      currentEpoch += 1;
      setEpoch(currentEpoch);
      // Graph curve calculation
      setAccuracy((prev) => Math.min(98.4, +(prev + Math.random() * 10).toFixed(1)));

      if (currentEpoch >= 10) {
        clearInterval(interval);
        setIsTraining(false);
        setIsTrained(true);

        // Run inferences on default list
        setEmails((prev) =>
          prev.map((e) => {
            const pred = predictText(e.text);
            return { ...e, pred: pred.label, conf: pred.conf };
          })
        );
      }
    }, 150);
  };

  const predictText = (input) => {
    const raw = input.toLowerCase();
    const spamWords = ["free", "bitcoin", "crypto", "click", "secure", "urgent", "credit card", "verify", "won", "gift card", "millions"];
    let score = 0;
    spamWords.forEach((word) => {
      if (raw.includes(word)) score += 1;
    });

    if (score >= 1) {
      return { label: "Spam", conf: Math.min(99, 70 + score * 10) };
    } else {
      return { label: "Ham", conf: Math.min(99, 85 + Math.random() * 10) };
    }
  };

  const handleCustomPredict = () => {
    if (!isTrained) return;
    const pred = predictText(customText || "No text entered");
    setCustomPred(pred);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <Cpu size={16} />
        </div>
        <h4 className="font-bold text-slate-800 text-sm">Supervised Learning Sandbox: Spam Classifier</h4>
      </div>

      <div className="space-y-4">
        {/* Model State & Training Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-100 gap-3">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-center sm:justify-start gap-1">
              <span>Model Status:</span>
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${isTrained ? "bg-emerald-500 animate-pulse" : isTraining ? "bg-amber-500 animate-spin" : "bg-slate-300"}`} />
              <span className="font-semibold">{isTrained ? "Trained (Epoch 10/10)" : isTraining ? `Training (Epoch ${epoch}/10)` : "Untrained"}</span>
            </div>
            <p className="text-[10px] text-slate-400">Epoch: {epoch}/10 | Classification Accuracy: {accuracy}%</p>
          </div>

          <button
            onClick={trainModel}
            disabled={isTraining}
            className="flex items-center space-x-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-2 transition-colors disabled:bg-slate-300"
          >
            <RefreshCw size={12} className={isTraining ? "animate-spin" : ""} />
            <span>{isTrained ? "Retrain Classifier" : isTraining ? "Fitting Weights..." : "Train Model"}</span>
          </button>
        </div>

        {/* Dataset Table */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-2">Training / Inference Dataset:</label>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full divide-y divide-slate-150 text-left text-[11px]">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="px-3 py-2">Email Text</th>
                  <th className="px-3 py-2 w-20">Actual</th>
                  <th className="px-3 py-2 w-24">AI Prediction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 bg-white text-slate-700 font-medium">
                {emails.map((e, idx) => (
                  <tr key={idx}>
                    <td className="px-3 py-2 max-w-[200px] truncate">{e.text}</td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${e.actual === "Spam" ? "bg-red-50 text-red-700 border border-red-100" : "bg-slate-100 text-slate-700 border border-slate-200"}`}>
                        {e.actual}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      {e.pred ? (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${e.pred === "Spam" ? "bg-red-100 text-red-800 border border-red-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"}`}>
                          {e.pred} ({e.conf}%)
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[10px]">Await Training</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Try Custom Text */}
        {isTrained && (
          <div className="space-y-2 border-t border-slate-100 pt-3">
            <label className="block text-xs font-semibold text-slate-500">Test Custom Email (Inference):</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-grow rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:border-zinc-500 focus:outline-none"
                placeholder="Type something like: You won a cash reward..."
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
              />
              <button
                onClick={handleCustomPredict}
                className="flex items-center space-x-1 rounded-lg bg-zinc-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zinc-700 transition-colors"
              >
                <Send size={12} />
                <span>Predict</span>
              </button>
            </div>

            {customPred && (
              <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Prediction Results:</span>
                <span className={`px-2 py-0.5 rounded font-bold ${customPred.label === "Spam" ? "bg-red-100 text-red-800 border border-red-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"}`}>
                  {customPred.label} ({customPred.conf.toFixed(0)}% Confidence)
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
