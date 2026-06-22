/****************************
 *  CANVASFLOW CREATIVE ENGINE
 *  Meta + YouTube Generator
 ****************************/

/* ---------------------------
   STATE (controls selection)
----------------------------*/
let metaSelected = true;
let youtubeSelected = false;

/* ---------------------------
   CORE GENERATOR (single brain)
----------------------------*/
function generateCreativeCore(prompt) {
  // This is where you'd later plug AI in
  return {
    title: prompt || "Untitled Creative",
    hook: "Stop the scroll instantly.",
    mainIdea: "Core message built from prompt.",
    visualTheme: "Futuristic blue tech aesthetic",
    colors: ["#0A84FF", "#000000"],
    textOverlay: "Build smarter. Move faster.",
    cta: "Learn more"
  };
}

/* ---------------------------
   META FEED RENDER
----------------------------*/
function renderMetaPost(data) {
  const output = document.getElementById("output");

  output.innerHTML = `
    <div class="meta-post">
      <h2>${data.title}</h2>
      <p><strong>${data.hook}</strong></p>
      <p>${data.textOverlay}</p>
      <small>${data.cta}</small>
    </div>
  `;
}

/* ---------------------------
   YOUTUBE THUMBNAIL RENDER
----------------------------*/
function renderYouTubeThumbnail(data) {
  const output = document.getElementById("output");

  output.innerHTML = `
    <div class="youtube-thumb">
      <h1 style="font-size: 32px; font-weight: 900;">
        ${data.hook}
      </h1>
      <p style="font-size: 18px;">
        ${data.textOverlay}
      </p>
      <span>${data.cta}</span>
    </div>
  `;
}

/* ---------------------------
   FORMAT TOGGLE HANDLERS
   (your 2-option system)
----------------------------*/
function setMetaMode() {
  metaSelected = true;
  youtubeSelected = false;
}

function setYouTubeMode() {
  metaSelected = false;
  youtubeSelected = true;
}

/* ---------------------------
   MAIN GENERATE BUTTON
----------------------------*/
function initGenerator() {
  const generateBtn = document.getElementById("generateBtn");

  if (!generateBtn) return;

  generateBtn.onclick = () => {
    const promptInput = document.getElementById("prompt");
    const prompt = promptInput ? promptInput.value : "";

    const data = generateCreativeCore(prompt);

    if (metaSelected) {
      renderMetaPost(data);
    }

    if (youtubeSelected) {
      renderYouTubeThumbnail(data);
    }
  };
}

/* ---------------------------
   FORMAT BUTTONS INIT
----------------------------*/
function initFormatButtons() {
  const metaBtn = document.getElementById("metaBtn");
  const ytBtn = document.getElementById("youtubeBtn");

  if (metaBtn) {
    metaBtn.onclick = setMetaMode;
  }

  if (ytBtn) {
    ytBtn.onclick = setYouTubeMode;
  }
}

/* ---------------------------
   INIT APP
----------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  initGenerator();
  initFormatButtons();
});
