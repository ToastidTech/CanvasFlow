 /******************************
 * CANVAS FLOW CREATIVE STUDIO
 * Dual Output Engine (Meta + YT)
 ******************************/

const state = {
  mode: "both",
  validModes: [
  "meta",
  "youtube",
  "instagram",
  "tiktok",
  "all"
],
  adminUnlocked: localStorage.getItem("canvasflow_admin") === "true"
};


/* ---------------------------
   MODE CONTROL
----------------------------*/

function setMode(newMode) {

  if (state.validModes.includes(newMode)) {

    state.mode = newMode;

  } else {

    console.warn("Invalid mode:", newMode);

  }

}


/* ---------------------------
   CREATIVE CORE ENGINE
----------------------------*/

function generateCreativeCore(prompt) {

  return {

    title: prompt || "Untitled Idea",

    hook:
      "Stop scrolling. This matters.",

    mainIdea:
      "Core message derived from prompt.",

    visualTheme:
      "Futuristic electric blue aesthetic",

    colors:
      [
        "#0A84FF",
        "#000000"
      ],

    textOverlay:
      "Build smarter. Move faster.",

    cta:
      "Learn more"

  };

}


/* ---------------------------
   META OUTPUT
----------------------------*/

function renderMeta(data) {

  return `

    <div class="meta-post">

      <h2>${data.title}</h2>

      <p>
        <strong>
          ${data.hook}
        </strong>
      </p>

      <p>
        ${data.textOverlay}
      </p>

      <small>
        ${data.cta}
      </small>

    </div>

  `;

}


/* ---------------------------
   YOUTUBE OUTPUT
----------------------------*/

function renderYouTube(data) {

  return `

    <div class="youtube-thumb">

      <h1>
        ${data.hook}
      </h1>

      <p>
        ${data.textOverlay}
      </p>

      <span>
        ${data.cta}
      </span>

    </div>

  `;

}


/* ---------------------------
   MAIN GENERATOR
----------------------------*/

function generate() {

  const promptInput =
    document.getElementById("prompt");

  const output =
    document.getElementById("output");


  if (!promptInput || !output) {

    console.error(
      "CanvasFlow elements missing."
    );

    return;

  }


  const prompt =
    promptInput.value.trim();


  const data =
    generateCreativeCore(prompt);


  let html = "";


  switch (state.mode) {


    case "meta":

      html =
        renderMeta(data);

      break;


    case "youtube":

      html =
        renderYouTube(data);

      break;


    case "both":

    default:

      html = `

        <div class="split">

          ${renderMeta(data)}

          ${renderYouTube(data)}

        </div>

      `;

      break;

  }


  output.innerHTML = html;

}


/* ---------------------------
   INITIALIZATION
----------------------------*/

document.addEventListener(
"DOMContentLoaded",
() => {


  const generateBtn =
    document.getElementById(
      "generateBtn"
    );


  const metaBtn =
    document.getElementById(
      "metaBtn"
    );


  const youtubeBtn =
    document.getElementById(
      "youtubeBtn"
    );


  if (generateBtn) {

    generateBtn.onclick =
      generate;

  }


  if (metaBtn) {

    metaBtn.onclick =
      () => setMode("meta");

  }


  if (youtubeBtn) {

    youtubeBtn.onclick =
      () => setMode("youtube");

  }


  setMode("both");


});
