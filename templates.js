/* ============================================================
   CanvasFlow — by Toastid Tech, LLC
   templates.js — Starter design presets
   Add more templates here as you build them out.
   size = "WIDTHxHEIGHT" must match a #canvas-size option for
   the dropdown to auto-select correctly (optional otherwise).
   ============================================================ */

const TEMPLATES = [
  {
    name: 'Instagram Post',
    size: '1080x1080',
    bgColor: '#0A1628',
    objects: [
      { type:'rect', x:0, y:0, w:1080, h:1080, fill:'#0A1628', strokeWidth:0, radius:0 },
      { type:'rect', x:60, y:60, w:960, h:6, fill:'#C9A84C', strokeWidth:0, radius:0 },
      { type:'text', x:60, y:120, w:960, h:200, text:'Your Big Headline Here', fontSize:72, fontFamily:'Playfair Display', color:'#C9A84C' },
      { type:'text', x:60, y:340, w:960, h:300, text:'Add your supporting message or call to action here.', fontSize:36, fontFamily:'DM Sans', color:'#ffffff' },
      { type:'rect', x:60, y:960, w:300, h:60, fill:'#C9A84C', strokeWidth:0, radius:8 },
      { type:'text', x:80, y:975, w:260, h:40, text:'Learn More', fontSize:28, fontFamily:'DM Sans', color:'#0A1628' }
    ]
  },
  {
    name: 'Instagram Story',
    size: '1080x1920',
    bgColor: '#0A1628',
    objects: [
      { type:'rect', x:0, y:0, w:1080, h:1920, fill:'#0A1628', strokeWidth:0, radius:0 },
      { type:'text', x:80, y:200, w:920, h:200, text:'Big Announcement', fontSize:80, fontFamily:'Playfair Display', color:'#C9A84C' },
      { type:'text', x:80, y:380, w:920, h:400, text:'Tell your audience what they need to know — keep it short and punchy.', fontSize:42, fontFamily:'DM Sans', color:'#ffffff' },
      { type:'rect', x:80, y:1700, w:920, h:8, fill:'#C9A84C', strokeWidth:0, radius:0 }
    ]
  },
  {
    name: 'Social Banner',
    size: '1200x630',
    bgColor: '#ffffff',
    objects: [
      { type:'rect', x:0, y:0, w:1200, h:630, fill:'#ffffff', strokeWidth:0, radius:0 },
      { type:'rect', x:0, y:0, w:420, h:630, fill:'#0A1628', strokeWidth:0, radius:0 },
      { type:'text', x:40, y:240, w:340, h:150, text:'Toastid Tech', fontSize:56, fontFamily:'Playfair Display', color:'#C9A84C' },
      { type:'text', x:480, y:80, w:680, h:120, text:'Headline Goes Here', fontSize:64, fontFamily:'Playfair Display', color:'#0A1628' },
      { type:'text', x:480, y:220, w:680, h:300, text:'Add a short description of your offer, product, or service.', fontSize:32, fontFamily:'DM Sans', color:'#16243d' }
    ]
  },
  {
    name: 'Flyer',
    size: '850x1100',
    bgColor: '#ffffff',
    objects: [
      { type:'rect', x:0, y:0, w:850, h:1100, fill:'#ffffff', strokeWidth:0, radius:0 },
      { type:'rect', x:0, y:0, w:850, h:200, fill:'#0A1628', strokeWidth:0, radius:0 },
      { type:'text', x:40, y:60, w:770, h:100, text:'Event Title', fontSize:64, fontFamily:'Playfair Display', color:'#C9A84C' },
      { type:'text', x:40, y:240, w:770, h:400, text:'Date • Time • Location\n\nAdd your event details and description here. This is a great place to highlight what makes this event special.', fontSize:32, fontFamily:'DM Sans', color:'#0A1628' },
      { type:'rect', x:40, y:980, w:300, h:70, fill:'#C9A84C', strokeWidth:0, radius:8 },
      { type:'text', x:60, y:1000, w:260, h:40, text:'RSVP Now', fontSize:32, fontFamily:'DM Sans', color:'#0A1628' }
    ]
  },
  {
    name: 'Logo Concept',
    size: '800x600',
    bgColor: '#0A1628',
    objects: [
      { type:'rect', x:0, y:0, w:800, h:600, fill:'#0A1628', strokeWidth:0, radius:0 },
      { type:'circle', x:300, y:150, w:200, h:200, fill:'#C9A84C', strokeWidth:0 },
      { type:'text', x:150, y:380, w:500, h:100, text:'Brand Name', fontSize:60, fontFamily:'Playfair Display', color:'#ffffff' },
      { type:'text', x:150, y:460, w:500, h:60, text:'tagline goes here', fontSize:24, fontFamily:'DM Sans', color:'#C9A84C' }
    ]
  }
];
