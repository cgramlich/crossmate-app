// Build a standalone page that renders the REAL Builder out of index.html, with
// stubbed API calls, so the builder can be driven without signing in.
//
// WHY THIS LIVES IN THE REPO: it was written from scratch three times because the
// session scratchpad gets cleared between sessions. It is a dev tool, not shipped
// code - nothing in index.html references it.
//
//   node tools/build-builder-harness.js
//   python -m http.server 8803      (then open /tools/builder-harness.html)
//
// It lifts source out of index.html by marker rather than copying it, so the
// harness can never drift from what actually ships.

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "index.html");
const OUT = path.join(__dirname, "builder-harness.html");

const src = fs.readFileSync(SRC, "utf8");
const style = src.slice(src.indexOf("<style>") + 7, src.indexOf("</style>"));

function cut(from, to) {
  const a = src.indexOf(from);
  const b = src.indexOf(to, a);
  if (a < 0 || b < 0) throw new Error("could not lift section starting: " + from);
  return src.slice(a, b);
}

// parsePuzzle + wordAt + KB_ROWS + Solver, then the builder helpers + Builder.
const solverBits = cut("function parsePuzzle(data){", "/* SoloSolve - loads a puzzle");
const builderBits = cut("const BUILD_SIZES = [", "/* ============================================================\n   FRIENDS");

const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"><\/script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.5/babel.min.js"><\/script>
<style>body{margin:0;font-family:"Outfit",system-ui,sans-serif;background:var(--paper);}
.app-pad{max-width:640px;margin:0 auto;padding:16px;}
${style}</style></head><body><div id="root"></div>
<script type="text/babel" data-presets="react">
const { useState, useEffect, useCallback, useRef } = React;
const log = () => {};
const STORE = { profile: { username: "tester", display_name: "Test Builder" } };

// Stubs. Each records what it was called with so a test can assert on it.
const Api = {
  puzzleCreate: async (p) => { window.__saved = p; return { ok: true, id: "pz_test_123" }; },
  wordsSuggest: async (pattern, limit) => {
    window.__lastPattern = pattern;
    const pool = ["ARC","PROOF","ARGUE","ROUND","WET","ARROW","ROGUE","COUNT","PAR","FED","APPLE","ANGLE"];
    const words = pool
      .filter(w => w.length === pattern.length && [...pattern].every((ch, i) => ch === "?" || w[i] === ch))
      .map(w => ({ word: w, score: 50 }));
    return { pattern, words, attribution: "test" };
  },
  wordsFill: async (width, height, blocks, letters) => {
    window.__fillCalled = { width, height, blocks, letters };
    if (window.__fillFails) return { solved: false, reason: window.__fillFails, letters };
    return { solved: true, attribution: "test", letters: {
      "0,1":"A","0,2":"R","0,3":"C",
      "1,0":"P","1,1":"R","1,2":"O","1,3":"O","1,4":"F",
      "2,0":"A","2,1":"R","2,2":"G","2,3":"U","2,4":"E",
      "3,0":"R","3,1":"O","3,2":"U","3,3":"N","3,4":"D",
      "4,1":"W","4,2":"E","4,3":"T" } };
  },
  aiClues: async (answer) => {
    window.__clueAsked = answer;
    return { content: [{ type: "text", text: "Curved path\\nA rainbow forms one\\nBow shape" }] };
  },
};

${solverBits}
${builderBits}

function Harness(){
  return <div className="app-pad">
    <Builder store={STORE} toast={(m)=>{window.__toast=m;}} go={(t)=>{window.__went=t;}} />
  </div>;
}
ReactDOM.createRoot(document.getElementById("root")).render(<Harness/>);
<\/script></body></html>`;

fs.writeFileSync(OUT, html);
console.log("wrote " + path.relative(ROOT, OUT) +
            "  (style " + style.length + ", solver " + solverBits.length +
            ", builder " + builderBits.length + " chars)");
