/* ============================================================
   CanvasFlow — by Toastid Tech, LLC
   app.js — Editor logic, trial/unlock system, export
   ============================================================ */

/* ===================== CONFIG ===================== */
const CONFIG = {
  trialDays: 7,
  unlockPrice: '$29.95',
  squareCheckoutUrl: 'https://square.link/u/8Y2zQGoR',
  watermarkText: 'Made with CanvasFlow — Toastid Tech, LLC',
  storageKeys: {
    firstLaunch: 'cf_first_launch',
    unlocked: 'cf_unlocked',
    project: 'cf_project'
  }
};

/* ===================== STATE ===================== */
const canvas = document.getElementById('design-canvas');
const ctx = canvas.getContext('2d');

let state = {
  objects: [],      // {id, type, x, y, w, h, fill, stroke, text, fontSize, fontFamily, rotation, opacity, src(img), radius}
  selectedId: null,
  tool: 'select',
  history: [],
  historyIndex: -1,
  dragging: false,
  resizing: false,
  resizeHandle: null,
  dragOffset: {x:0, y:0},
  nextId: 1
};

/* ===================== LICENSE / TRIAL SYSTEM ===================== */
function isUnlocked(){
  return localStorage.getItem(CONFIG.storageKeys.unlocked) === 'true';
}

function getTrialInfo(){
  let first = localStorage.getItem(CONFIG.storageKeys.firstLaunch);
  if(!first){
    first = Date.now().toString();
    localStorage.setItem(CONFIG.storageKeys.firstLaunch, first);
  }
  const startTime = parseInt(first, 10);
  const elapsedMs = Date.now() - startTime;
  const trialMs = CONFIG.trialDays * 24 * 60 * 60 * 1000;
  const remainingMs = trialMs - elapsedMs;
  const daysLeft = Math.ceil(remainingMs / (24*60*60*1000));
  return {
    expired: remainingMs <= 0,
    daysLeft: Math.max(daysLeft, 0)
  };
}

function updateTrialUI(){
  const banner = document.getElementById('trial-banner');
  const unlockBtn = document.getElementById('unlock-btn');
  const watermark = document.getElementById('watermark-overlay');

  if(isUnlocked()){
    banner.classList.remove('show');
    unlockBtn.style.display = 'none';
    watermark.style.display = 'none';
    return;
  }

  unlockBtn.style.display = 'inline-block';
  watermark.style.display = 'block';

  const trial = getTrialInfo();
  banner.classList.add('show');

  if(trial.expired){
    banner.textContent = 'Your free trial has expired — Unlock CanvasFlow for full access.';
    banner.classList.add('expired');
    openModal('expired-modal');
  } else {
    banner.classList.remove('expired');
    banner.textContent = `Free Trial: ${trial.daysLeft} day${trial.daysLeft === 1 ? '' : 's'} remaining — exports include a watermark until unlocked.`;
  }
}

function openModal(id){
  document.getElementById(id).classList.add('open');
}
function closeModal(id){
  document.getElementById(id).classList.remove('open');
}

function goToCheckout(){
  window.open(CONFIG.squareCheckoutUrl, '_blank');
}

// Manual unlock trigger (for testing / support-issued codes)
// Run in browser console: unlockCanvasFlow()
window.unlockCanvasFlow = function(){
  localStorage.setItem(CONFIG.storageKeys.unlocked, 'true');
  updateTrialUI();
  closeModal('unlock-modal');
  closeModal('expired-modal');
  alert('CanvasFlow unlocked! Thanks for supporting Toastid Tech, LLC.');
};

/* ===================== HISTORY (UNDO/REDO) ===================== */
function pushHistory(){
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push(JSON.stringify(state.objects));
  state.historyIndex++;
  if(state.history.length > 50){
    state.history.shift();
    state.historyIndex--;
  }
  updateUndoRedoButtons();
}

function undo(){
  if(state.historyIndex > 0){
    state.historyIndex--;
    state.objects = JSON.parse(state.history[state.historyIndex]);
    state.selectedId = null;
    render();
    renderLayers();
    renderProps();
  }
  updateUndoRedoButtons();
}

function redo(){
  if(state.historyIndex < state.history.length - 1){
    state.historyIndex++;
    state.objects = JSON.parse(state.history[state.historyIndex]);
    state.selectedId = null;
    render();
    renderLayers();
    renderProps();
  }
  updateUndoRedoButtons();
}

function updateUndoRedoButtons(){
  document.getElementById('undo-btn').style.opacity = state.historyIndex > 0 ? '1' : '0.4';
  document.getElementById('redo-btn').style.opacity = state.historyIndex < state.history.length - 1 ? '1' : '0.4';
}

/* ===================== OBJECT HELPERS ===================== */
function createObject(type, opts={}){
  const base = {
    id: state.nextId++,
    type,
    x: 100, y: 100, w: 150, h: 100,
    rotation: 0,
    opacity: 1,
    fill: '#C9A84C',
    stroke: '#0A1628',
    strokeWidth: 0,
    text: 'Edit me',
    fontSize: 32,
    fontFamily: 'DM Sans',
    color: '#0A1628',
    radius: 0
  };
  return Object.assign(base, opts);
}

function getObjectById(id){
  return state.objects.find(o => o.id === id);
}

function getSelected(){
  return getObjectById(state.selectedId);
}

/* ===================== RENDER ===================== */
function render(){
  ctx.save();
  ctx.clearRect(0,0,canvas.width, canvas.height);

  // background
  ctx.fillStyle = document.getElementById('bg-color').value;
  ctx.fillRect(0,0,canvas.width, canvas.height);

  state.objects.forEach(obj => drawObject(obj));

  // selection box
  const sel = getSelected();
  if(sel) drawSelection(sel);

  ctx.restore();
}

function drawObject(obj){
  ctx.save();
  ctx.globalAlpha = obj.opacity;
  ctx.translate(obj.x + obj.w/2, obj.y + obj.h/2);
  ctx.rotate((obj.rotation || 0) * Math.PI / 180);
  ctx.translate(-obj.w/2, -obj.h/2);

  if(obj.type === 'rect'){
    if(obj.radius > 0){
      roundRect(ctx, 0, 0, obj.w, obj.h, obj.radius);
    } else {
      ctx.beginPath();
      ctx.rect(0,0,obj.w,obj.h);
    }
    ctx.fillStyle = obj.fill;
    ctx.fill();
    if(obj.strokeWidth > 0){
      ctx.lineWidth = obj.strokeWidth;
      ctx.strokeStyle = obj.stroke;
      ctx.stroke();
    }
  } else if(obj.type === 'circle'){
    ctx.beginPath();
    ctx.ellipse(obj.w/2, obj.h/2, obj.w/2, obj.h/2, 0, 0, Math.PI*2);
    ctx.fillStyle = obj.fill;
    ctx.fill();
    if(obj.strokeWidth > 0){
      ctx.lineWidth = obj.strokeWidth;
      ctx.strokeStyle = obj.stroke;
      ctx.stroke();
    }
  } else if(obj.type === 'text'){
    ctx.fillStyle = obj.color;
    ctx.font = `${obj.fontSize}px '${obj.fontFamily}', sans-serif`;
    ctx.textBaseline = 'top';
    wrapText(ctx, obj.text, 0, 0, obj.w, obj.fontSize * 1.2);
  } else if(obj.type === 'image' && obj._img){
    ctx.drawImage(obj._img, 0, 0, obj.w, obj.h);
  }

  ctx.restore();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  const words = text.split(' ');
  let line = '';
  let yy = y;
  for(let n=0; n<words.length; n++){
    const testLine = line + words[n] + ' ';
    if(ctx.measureText(testLine).width > maxWidth && n > 0){
      ctx.fillText(line, x, yy);
      line = words[n] + ' ';
      yy += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, yy);
}

function roundRect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath();
}

const HANDLE_SIZE = 10;
function drawSelection(obj){
  ctx.save();
  ctx.strokeStyle = '#C9A84C';
  ctx.lineWidth = 2;
  ctx.setLineDash([6,4]);
  ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
  ctx.setLineDash([]);

  // resize handle (bottom-right)
  ctx.fillStyle = '#C9A84C';
  ctx.fillRect(obj.x + obj.w - HANDLE_SIZE/2, obj.y + obj.h - HANDLE_SIZE/2, HANDLE_SIZE, HANDLE_SIZE);
  ctx.restore();
}

/* ===================== LAYERS PANEL ===================== */
function renderLayers(){
  const list = document.getElementById('layers-list');
  list.innerHTML = '';
  if(state.objects.length === 0){
    list.innerHTML = '<div class="empty-state">No layers yet.</div>';
    return;
  }
  // show topmost first
  for(let i = state.objects.length - 1; i >= 0; i--){
    const obj = state.objects[i];
    const item = document.createElement('div');
    item.className = 'layer-item' + (obj.id === state.selectedId ? ' selected' : '');
    const label = obj.type === 'text' ? `Text: ${obj.text.slice(0,14)}` :
                   obj.type === 'image' ? 'Image' :
                   obj.type === 'circle' ? 'Circle' : 'Rectangle';
    item.innerHTML = `<span>${label}</span>
      <div class="layer-actions">
        <button data-action="up" title="Bring forward">↑</button>
        <button data-action="down" title="Send backward">↓</button>
        <button data-action="del" title="Delete">🗑</button>
      </div>`;
    item.addEventListener('click', (e) => {
      if(e.target.dataset.action) return;
      state.selectedId = obj.id;
      render(); renderLayers(); renderProps();
    });
    item.querySelector('[data-action="up"]').addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = state.objects.indexOf(obj);
      if(idx < state.objects.length - 1){
        [state.objects[idx], state.objects[idx+1]] = [state.objects[idx+1], state.objects[idx]];
        pushHistory(); render(); renderLayers();
      }
    });
    item.querySelector('[data-action="down"]').addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = state.objects.indexOf(obj);
      if(idx > 0){
        [state.objects[idx], state.objects[idx-1]] = [state.objects[idx-1], state.objects[idx]];
        pushHistory(); render(); renderLayers();
      }
    });
    item.querySelector('[data-action="del"]').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteObject(obj.id);
    });
    list.appendChild(item);
  }
}

function deleteObject(id){
  state.objects = state.objects.filter(o => o.id !== id);
  if(state.selectedId === id) state.selectedId = null;
  pushHistory(); render(); renderLayers(); renderProps();
}

/* ===================== PROPERTIES PANEL ===================== */
function renderProps(){
  const panel = document.getElementById('object-props');
  const obj = getSelected();
  if(!obj){
    panel.innerHTML = '<div class="empty-state">Select an element to edit its properties, or add a new shape/text from the toolbar.</div>';
    return;
  }

  let html = `
    <div class="prop-group">
      <label>Position</label>
      <div class="row-2">
        <input type="number" id="prop-x" value="${Math.round(obj.x)}" placeholder="X">
        <input type="number" id="prop-y" value="${Math.round(obj.y)}" placeholder="Y">
      </div>
    </div>
    <div class="prop-group">
      <label>Size</label>
      <div class="row-2">
        <input type="number" id="prop-w" value="${Math.round(obj.w)}" placeholder="Width">
        <input type="number" id="prop-h" value="${Math.round(obj.h)}" placeholder="Height">
      </div>
    </div>
    <div class="prop-group">
      <label>Rotation (${obj.rotation}°)</label>
      <input type="range" id="prop-rotation" min="0" max="360" value="${obj.rotation}">
    </div>
    <div class="prop-group">
      <label>Opacity (${Math.round(obj.opacity*100)}%)</label>
      <input type="range" id="prop-opacity" min="0" max="1" step="0.01" value="${obj.opacity}">
    </div>
  `;

  if(obj.type === 'rect' || obj.type === 'circle'){
    html += `
    <div class="prop-group">
      <label>Fill Color</label>
      <input type="color" id="prop-fill" value="${obj.fill}">
    </div>
    <div class="prop-group">
      <label>Border Width</label>
      <input type="number" id="prop-strokewidth" min="0" max="20" value="${obj.strokeWidth}">
    </div>
    <div class="prop-group">
      <label>Border Color</label>
      <input type="color" id="prop-stroke" value="${obj.stroke}">
    </div>`;
    if(obj.type === 'rect'){
      html += `
    <div class="prop-group">
      <label>Corner Radius</label>
      <input type="number" id="prop-radius" min="0" max="100" value="${obj.radius}">
    </div>`;
    }
  }

  if(obj.type === 'text'){
    html += `
    <div class="prop-group">
      <label>Text Content</label>
      <input type="text" id="prop-text" value="${escapeHtml(obj.text)}">
    </div>
    <div class="prop-group">
      <label>Font Size</label>
      <input type="number" id="prop-fontsize" min="8" max="200" value="${obj.fontSize}">
    </div>
    <div class="prop-group">
      <label>Font Family</label>
      <select id="prop-fontfamily">
        <option value="DM Sans" ${obj.fontFamily==='DM Sans'?'selected':''}>DM Sans</option>
        <option value="Playfair Display" ${obj.fontFamily==='Playfair Display'?'selected':''}>Playfair Display</option>
        <option value="Arial" ${obj.fontFamily==='Arial'?'selected':''}>Arial</option>
        <option value="Georgia" ${obj.fontFamily==='Georgia'?'selected':''}>Georgia</option>
        <option value="Courier New" ${obj.fontFamily==='Courier New'?'selected':''}>Courier New</option>
      </select>
    </div>
    <div class="prop-group">
      <label>Text Color</label>
      <input type="color" id="prop-color" value="${obj.color}">
    </div>`;
  }

  panel.innerHTML = html;

  // wire up events
  const bind = (id, fn) => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('input', fn);
    if(el) el.addEventListener('change', () => pushHistory());
  };

  bind('prop-x', e => { obj.x = parseFloat(e.target.value) || 0; render(); });
  bind('prop-y', e => { obj.y = parseFloat(e.target.value) || 0; render(); });
  bind('prop-w', e => { obj.w = parseFloat(e.target.value) || 1; render(); });
  bind('prop-h', e => { obj.h = parseFloat(e.target.value) || 1; render(); });
  bind('prop-rotation', e => { obj.rotation = parseFloat(e.target.value); render(); renderProps(); });
  bind('prop-opacity', e => { obj.opacity = parseFloat(e.target.value); render(); renderProps(); });
  bind('prop-fill', e => { obj.fill = e.target.value; render(); });
  bind('prop-stroke', e => { obj.stroke = e.target.value; render(); });
  bind('prop-strokewidth', e => { obj.strokeWidth = parseFloat(e.target.value) || 0; render(); });
  bind('prop-radius', e => { obj.radius = parseFloat(e.target.value) || 0; render(); });
  bind('prop-text', e => { obj.text = e.target.value; render(); renderLayers(); });
  bind('prop-fontsize', e => { obj.fontSize = parseFloat(e.target.value) || 12; render(); });
  bind('prop-fontfamily', e => { obj.fontFamily = e.target.value; render(); });
  bind('prop-color', e => { obj.color = e.target.value; render(); });

  // refresh rotation/opacity labels live without full re-render
  document.getElementById('prop-rotation')?.addEventListener('input', e => {
    const label = e.target.closest('.prop-group').querySelector('label');
    label.textContent = `Rotation (${e.target.value}°)`;
  });
  document.getElementById('prop-opacity')?.addEventListener('input', e => {
    const label = e.target.closest('.prop-group').querySelector('label');
    label.textContent = `Opacity (${Math.round(e.target.value*100)}%)`;
  });
}

function escapeHtml(str){
  return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* ===================== CANVAS INTERACTION ===================== */
function getCanvasPos(e){
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height)
  };
}

function hitTest(pos){
  for(let i = state.objects.length - 1; i >= 0; i--){
    const obj = state.objects[i];
    if(pos.x >= obj.x && pos.x <= obj.x + obj.w && pos.y >= obj.y && pos.y <= obj.y + obj.h){
      return obj;
    }
  }
  return null;
}

function hitTestHandle(pos, obj){
  if(!obj) return false;
  const hx = obj.x + obj.w;
  const hy = obj.y + obj.h;
  return Math.abs(pos.x - hx) <= HANDLE_SIZE && Math.abs(pos.y - hy) <= HANDLE_SIZE;
}

function onPointerDown(e){
  e.preventDefault();
  const pos = getCanvasPos(e);

  if(state.tool === 'rect' || state.tool === 'circle'){
    const obj = createObject(state.tool, {x: pos.x, y: pos.y, w: 150, h: 100});
    state.objects.push(obj);
    state.selectedId = obj.id;
    state.tool = 'select';
    setActiveTool('select');
    pushHistory(); render(); renderLayers(); renderProps();
    return;
  }

  if(state.tool === 'text'){
    const obj = createObject('text', {x: pos.x, y: pos.y, w: 200, h: 50, text:'Edit me', fill:'transparent'});
    state.objects.push(obj);
    state.selectedId = obj.id;
    state.tool = 'select';
    setActiveTool('select');
    pushHistory(); render(); renderLayers(); renderProps();
    return;
  }

  // select tool
  const sel = getSelected();
  if(sel && hitTestHandle(pos, sel)){
    state.resizing = true;
    return;
  }

  const hit = hitTest(pos);
  if(hit){
    state.selectedId = hit.id;
    state.dragging = true;
    state.dragOffset = {x: pos.x - hit.x, y: pos.y - hit.y};
  } else {
    state.selectedId = null;
  }
  render(); renderLayers(); renderProps();
}

function onPointerMove(e){
  if(!state.dragging && !state.resizing) return;
  e.preventDefault();
  const pos = getCanvasPos(e);
  const obj = getSelected();
  if(!obj) return;

  if(state.dragging){
    obj.x = pos.x - state.dragOffset.x;
    obj.y = pos.y - state.dragOffset.y;
  } else if(state.resizing){
    obj.w = Math.max(10, pos.x - obj.x);
    obj.h = Math.max(10, pos.y - obj.y);
  }
  render();
}

function onPointerUp(e){
  if(state.dragging || state.resizing){
    pushHistory();
    renderProps();
  }
  state.dragging = false;
  state.resizing = false;
}

canvas.addEventListener('mousedown', onPointerDown);
canvas.addEventListener('mousemove', onPointerMove);
canvas.addEventListener('mouseup', onPointerUp);
canvas.addEventListener('touchstart', onPointerDown, {passive:false});
canvas.addEventListener('touchmove', onPointerMove, {passive:false});
canvas.addEventListener('touchend', onPointerUp);

// double-click to edit text inline
canvas.addEventListener('dblclick', (e) => {
  const pos = getCanvasPos(e);
  const hit = hitTest(pos);
  if(hit && hit.type === 'text'){
    openTextEditor(hit);
  }
});

function openTextEditor(obj){
  const editor = document.getElementById('text-editor');
  const rect = canvas.getBoundingClientRect();
  const scaleX = rect.width / canvas.width;
  const scaleY = rect.height / canvas.height;

  editor.style.display = 'block';
  editor.style.left = (obj.x * scaleX) + 'px';
  editor.style.top = (obj.y * scaleY) + 'px';
  editor.style.width = (obj.w * scaleX) + 'px';
  editor.style.height = (obj.h * scaleY) + 'px';
  editor.style.fontSize = (obj.fontSize * scaleY) + 'px';
  editor.style.fontFamily = `'${obj.fontFamily}', sans-serif`;
  editor.style.color = obj.color;
  editor.value = obj.text;
  editor.focus();
  editor.select();

  function commit(){
    obj.text = editor.value || ' ';
    editor.style.display = 'none';
    render(); renderLayers(); renderProps();
    pushHistory();
    editor.removeEventListener('blur', commit);
  }
  editor.addEventListener('blur', commit, {once:true});
}

/* ===================== TOOLBAR ===================== */
function setActiveTool(tool){
  document.querySelectorAll('#toolbar .btn-icon[data-tool]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tool === tool);
  });
}

document.querySelectorAll('#toolbar .btn-icon[data-tool]').forEach(btn => {
  btn.addEventListener('click', () => {
    state.tool = btn.dataset.tool;
    setActiveTool(state.tool);
  });
});

document.getElementById('delete-btn').addEventListener('click', () => {
  if(state.selectedId) deleteObject(state.selectedId);
});

document.getElementById('undo-btn').addEventListener('click', undo);
document.getElementById('redo-btn').addEventListener('click', redo);

/* ===================== IMAGE UPLOAD ===================== */
document.getElementById('tool-image').addEventListener('click', () => {
  document.getElementById('image-input').click();
});

document.getElementById('image-input').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const img = new Image();
    img.onload = () => {
      const maxW = canvas.width * 0.6;
      const scale = Math.min(1, maxW / img.width);
      const obj = createObject('image', {
        x: 80, y: 80,
        w: img.width * scale,
        h: img.height * scale,
        src: evt.target.result
      });
      obj._img = img;
      state.objects.push(obj);
      state.selectedId = obj.id;
      pushHistory(); render(); renderLayers(); renderProps();
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
  e.target.value = '';
});

/* ===================== CANVAS SIZE / BACKGROUND ===================== */
document.getElementById('canvas-size').addEventListener('change', (e) => {
  const [w, h] = e.target.value.split('x').map(Number);
  canvas.width = w;
  canvas.height = h;
  render();
});

document.getElementById('bg-color').addEventListener('input', render);
document.getElementById('bg-color').addEventListener('change', pushHistory);

/* ===================== NEW / SAVE / LOAD ===================== */
document.getElementById('new-btn').addEventListener('click', () => {
  if(confirm('Start a new design? Unsaved changes will be lost.')){
    state.objects = [];
    state.selectedId = null;
    document.getElementById('bg-color').value = '#ffffff';
    pushHistory(); render(); renderLayers(); renderProps();
  }
});

document.getElementById('save-btn').addEventListener('click', () => {
  const data = {
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    bgColor: document.getElementById('bg-color').value,
    objects: state.objects.map(o => {
      const copy = Object.assign({}, o);
      delete copy._img; // images re-loaded from src on load
      return copy;
    })
  };
  localStorage.setItem(CONFIG.storageKeys.project, JSON.stringify(data));
  alert('Project saved to this device.');
});

function loadProject(){
  const raw = localStorage.getItem(CONFIG.storageKeys.project);
  if(!raw) return;
  try{
    const data = JSON.parse(raw);
    canvas.width = data.canvasWidth || 800;
    canvas.height = data.canvasHeight || 600;
    document.getElementById('bg-color').value = data.bgColor || '#ffffff';

    const sizeSelect = document.getElementById('canvas-size');
    const match = `${canvas.width}x${canvas.height}`;
    if([...sizeSelect.options].some(o => o.value === match)) sizeSelect.value = match;

    let loaded = 0;
    const total = data.objects.length;
    state.objects = data.objects.map(o => {
      if(o.type === 'image' && o.src){
        const img = new Image();
        img.onload = () => { o._img = img; render(); };
        img.src = o.src;
      }
      state.nextId = Math.max(state.nextId, o.id + 1);
      return o;
    });
    render(); renderLayers(); renderProps();
  } catch(err){
    console.error('Failed to load project', err);
  }
}

/* ===================== EXPORT ===================== */
document.getElementById('export-btn').addEventListener('click', () => {
  state.selectedId = null;
  render();

  if(isUnlocked()){
    exportCanvas();
  } else {
    exportCanvasWithWatermark();
  }
});

function exportCanvas(){
  const link = document.createElement('a');
  link.download = `canvasflow-design-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function exportCanvasWithWatermark(){
  // draw to a temp canvas so the on-screen design isn't permanently altered
  const temp = document.createElement('canvas');
  temp.width = canvas.width;
  temp.height = canvas.height;
  const tctx = temp.getContext('2d');
  tctx.drawImage(canvas, 0, 0);

  // watermark bar
  const barHeight = Math.max(28, temp.height * 0.04);
  tctx.fillStyle = 'rgba(10,22,40,0.65)';
  tctx.fillRect(0, temp.height - barHeight, temp.width, barHeight);

  tctx.fillStyle = '#C9A84C';
  tctx.font = `${Math.round(barHeight*0.5)}px 'DM Sans', sans-serif`;
  tctx.textBaseline = 'middle';
  tctx.textAlign = 'center';
  tctx.fillText(CONFIG.watermarkText, temp.width/2, temp.height - barHeight/2);

  const link = document.createElement('a');
  link.download = `canvasflow-design-${Date.now()}.png`;
  link.href = temp.toDataURL('image/png');
  link.click();
}

/* ===================== TEMPLATES ===================== */
function renderTemplates(){
  const list = document.getElementById('templates-list');
  list.innerHTML = '';
  TEMPLATES.forEach((tpl, idx) => {
    const item = document.createElement('div');
    item.className = 'template-item';
    item.innerHTML = `${tpl.name} <span class="badge">${tpl.size}</span>`;
    item.addEventListener('click', () => applyTemplate(tpl));
    list.appendChild(item);
  });
}

function applyTemplate(tpl){
  if(!confirm(`Load "${tpl.name}" template? This replaces your current design.`)) return;

  const [w, h] = tpl.size.split('x').map(Number);
  canvas.width = w;
  canvas.height = h;
  const sizeSelect = document.getElementById('canvas-size');
  const match = `${w}x${h}`;
  if([...sizeSelect.options].some(o => o.value === match)) sizeSelect.value = match;

  document.getElementById('bg-color').value = tpl.bgColor || '#ffffff';

  state.objects = tpl.objects.map(o => Object.assign(createObject(o.type), o, {id: state.nextId++}));
  state.selectedId = null;

  pushHistory(); render(); renderLayers(); renderProps();
  document.getElementById('templates-panel').classList.remove('open');
}

document.getElementById('templates-btn').addEventListener('click', () => {
  document.getElementById('templates-panel').classList.toggle('open');
});

/* ===================== MODALS ===================== */
document.getElementById('unlock-btn').addEventListener('click', () => openModal('unlock-modal'));
document.getElementById('close-unlock').addEventListener('click', () => closeModal('unlock-modal'));
document.getElementById('checkout-btn').addEventListener('click', goToCheckout);
document.getElementById('checkout-btn-2').addEventListener('click', goToCheckout);
document.getElementById('continue-limited').addEventListener('click', () => closeModal('expired-modal'));

/* ===================== INIT ===================== */
function init(){
  updateTrialUI();
  renderTemplates();
  loadProject();
  if(state.objects.length === 0){
    pushHistory();
  } else {
    state.history = [JSON.stringify(state.objects)];
    state.historyIndex = 0;
    updateUndoRedoButtons();
  }
  render();
  renderLayers();
  renderProps();
  setActiveTool('select');
}

init();

