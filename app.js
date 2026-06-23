/******************************
 * CANVASFLOW CREATIVE STUDIO V2
 * Dual Output Engine (Meta + YT)
 ******************************/

const state = {
  state.mode: "both",
  validModes: ["meta", "youtube", "both"]
};


/* ---------------------------
   CORE CREATIVE ENGINE
----------------------------*/
function generateCreativeCore(prompt) {
  return {
    title: prompt || "Untitled Idea",
    hook: "Stop scrolling. This matters.",
    mainIdea: "Core message derived from prompt.",
    visualTheme: "Futuristic electric blue aesthetic",
    colors: ["#0A84FF", "#000000"],
    textOverlay: "Build smarter. Move faster.",
    cta: "Learn more"
  };
}

/* ---------------------------
   META RENDER
----------------------------*/
function renderMeta(data) {
  return `
    <div class="meta-post">
      <h2>${data.title}</h2>
      <p><strong>${data.hook}</strong></p>
      <p>${data.textOverlay}</p>
      <small>${data.cta}</small>
    </div>
  `;
}

/* ---------------------------
   YOUTUBE RENDER
----------------------------*/
function renderYouTube(data) {
  return `
    <div class="youtube-thumb">
      <h1>${data.hook}</h1>
      <p>${data.textOverlay}</p>
      <span>${data.cta}</span>
    </div>
  `;
}

/* ---------------------------
   MAIN GENERATION (DUAL OUTPUT)
----------------------------*/
function generate() {
  const prompt = document.getElementById("prompt").value;
  const output = document.getElementById("output");

  const data = generateCreativeCore(prompt);

  let html = "";

  if (mode === "meta") {
    html = renderMeta(data);
  }

  if (state.mode === "youtube") {
    html = renderYouTube(data);
  }

  if (state.mode === "both") {
    html = `
      <div class="split">
        ${renderMeta(data)}
        ${renderYouTube(data)}
      </div>
    `;
  }

  output.innerHTML = html;
}

/* ---------------------------
   MODE SWITCHERS
----------------------------*/
function setmode(newMode) {
  if (state.validModes.includes(newMode)) 
  {
    state.mode = newMode;
    mode = newMode;
  } else {
    console.warn("Invalid mode:", 
 newMode);
  }
}

/* ---------------------------
   INIT
----------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("generateBtn").onclick = generate;

  document.getElementById("metaBtn").onclick = () => setMode("meta");
  document.getElementById("youtubeBtn").onclick = () => setMode("youtube");

  // default = both
  setMode("both");
});
