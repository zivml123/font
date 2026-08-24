// Exercise database — premium SVG illustrations + descriptions + muscles

// Shared style constants
const BK = '#0C0E14'; // background
const L  = 'stroke="#8AACBF" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none"';
const LS = 'stroke="#8AACBF" stroke-width="9"  stroke-linecap="round" stroke-linejoin="round" fill="none"';
const EF = 'fill="#27333E" stroke="#415566" stroke-width="1.5"'; // equipment fill
const EB = 'stroke="#607A8A" stroke-width="5" stroke-linecap="round" fill="none"'; // bar line

// Inline helpers (strings, not DOM)
const h = (cx,cy) => `<circle cx="${cx}" cy="${cy}" r="13" fill="#BFCCD8" stroke="#8AAAB8" stroke-width="1.5"/>`;
const j = (cx,cy,r=5) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#4E7088"/>`;
const bar = (x1,y1,x2,y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${EB}/>`;
const pl = (cx,cy,w=7,ht=22) => `<rect x="${cx-Math.floor(w/2)}" y="${cy-Math.floor(ht/2)}" width="${w}" height="${ht}" rx="2" ${EF}/>`;
const kb = (cx,cy) =>
  `<circle cx="${cx}" cy="${cy+8}" r="19" ${EF}/><path d="M${cx-11} ${cy}a13 9 0 1 1 22 0" stroke="#557080" stroke-width="7" fill="none" stroke-linecap="round"/>`;
const db = (cx,cy,a=0) => {
  const rad=a*Math.PI/180, rx=Math.round(15*Math.cos(rad)), ry=Math.round(15*Math.sin(rad));
  return `<line x1="${cx-rx}" y1="${cy-ry}" x2="${cx+rx}" y2="${cy+ry}" ${EB}/><circle cx="${cx-rx}" cy="${cy-ry}" r="7" ${EF}/><circle cx="${cx+rx}" cy="${cy+ry}" r="7" ${EF}/>`;
};
const bench = (x,y,w,legL=35) =>
  `<rect x="${x}" y="${y}" width="${w}" height="10" rx="4" ${EF}/><line x1="${x+14}" y1="${y+10}" x2="${x+14}" y2="${y+10+legL}" ${EB}/><line x1="${x+w-14}" y1="${y+10}" x2="${x+w-14}" y2="${y+10+legL}" ${EB}/>`;

const SVG = {

// ── UPPER BODY PUSH ──────────────────────────────────────────────────────────

'bench-press': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${bench(18,112,145,40)}
${bar(72,60,156,60)}${pl(68,60)}${pl(156,60)}
<path d="M 152,106 L 68,106 L 50,132 L 38,158" ${L}/>
<path d="M 138,104 L 142,76 L 148,62" ${L}/>
<path d="M 112,104 L 100,76 L 84,62" ${L}/>
${h(168,106)}
${j(142,76)}${j(100,76)}${j(50,132)}
</svg>`,

'military-press': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${bar(52,18,148,18)}${pl(47,18)}${pl(148,18)}
<path d="M 78,58 L 100,48 L 122,58 M 100,48 L 100,108 M 100,108 L 85,150 L 82,182 M 100,108 L 115,150 L 118,182" ${L}/>
<path d="M 78,58 L 68,36 L 66,20" ${L}/>
<path d="M 122,58 L 132,36 L 134,20" ${L}/>
${h(100,28)}
${j(78,58)}${j(122,58)}${j(68,36)}${j(132,36)}${j(85,150)}${j(115,150)}
</svg>`,

'lateral-raise': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<path d="M 78,58 L 100,48 L 122,58 M 100,48 L 100,108 M 100,108 L 85,150 L 82,182 M 100,108 L 115,150 L 118,182" ${L}/>
<path d="M 78,58 L 38,84" ${L}/>
<path d="M 122,58 L 162,84" ${L}/>
${db(28,88,90)}${db(172,88,90)}
${h(100,28)}
${j(78,58)}${j(122,58)}${j(85,150)}${j(115,150)}
</svg>`,

'tricep-extension': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<path d="M 78,58 L 100,48 L 122,58 M 100,48 L 100,108 M 100,108 L 85,150 L 82,182 M 100,108 L 115,150 L 118,182" ${L}/>
<path d="M 78,58 L 68,44 L 84,24" ${L}/>
<path d="M 122,58 L 132,44 L 116,24" ${L}/>
<rect x="87" y="14" width="26" height="11" rx="3" ${EF}/>
${h(100,28)}
${j(78,58)}${j(122,58)}${j(68,44)}${j(132,44)}${j(85,150)}${j(115,150)}
</svg>`,

'chest-fly': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${bench(18,112,145,40)}
<path d="M 152,106 L 68,106 L 50,132 L 38,158" ${L}/>
<path d="M 132,104 L 158,78" ${L}/>
<path d="M 108,104 L 80,78" ${L}/>
<path d="M 120,104 L 120,80" ${LS}/>
${db(162,74,45)}${db(74,74,-45)}
${h(168,106)}
${j(158,78)}${j(80,78)}${j(50,132)}
</svg>`,

// ── UPPER BODY PULL ──────────────────────────────────────────────────────────

'pullup': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<rect x="30" y="14" width="140" height="10" rx="3" ${EF}/>
<rect x="25" y="8" width="10" height="22" rx="3" ${EF}/>
<rect x="165" y="8" width="10" height="22" rx="3" ${EF}/>
<path d="M 78,96 L 100,82 L 122,96 M 100,82 L 100,148 M 100,148 L 85,182 M 100,148 L 115,182" ${L}/>
<path d="M 78,96 L 70,56 L 72,24" ${L}/>
<path d="M 122,96 L 130,56 L 128,24" ${L}/>
${h(100,68)}
${j(78,96)}${j(122,96)}${j(70,56)}${j(130,56)}${j(85,182,4)}${j(115,182,4)}
</svg>`,

'row-bent': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${bar(55,138,148,138)}${pl(50,138)}${pl(148,138)}
<path d="M 56,58 L 118,90 L 140,155 L 142,178 M 118,90 L 100,158 L 98,178" ${L}/>
<path d="M 92,72 L 72,100 L 62,138" ${L}/>
<path d="M 116,84 L 130,56 L 128,32" ${L}/>
${h(54,48)}
${j(92,72)}${j(72,100)}${j(130,56)}${j(118,90)}${j(140,155)}${j(100,158)}
</svg>`,

'row-machine': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<rect x="15" y="80" width="10" height="80" rx="3" ${EF}/>
<rect x="15" y="104" width="46" height="12" rx="3" ${EF}/>
<path d="M 80,60 L 80,120 M 80,120 L 62,165 L 60,182 M 80,120 L 98,165 L 100,182" ${L}/>
<path d="M 60,78 L 40,110" ${L}/>
<path d="M 100,78 L 130,98 L 162,90" ${L}/>
<rect x="158" y="82" width="22" height="18" rx="3" ${EF}/>
${h(80,46)}
${j(60,78)}${j(100,78)}${j(40,110)}${j(130,98)}${j(62,165)}${j(98,165)}
</svg>`,

'face-pull': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<rect x="168" y="65" width="14" height="14" rx="3" ${EF}/>
<line x1="142" y1="75" x2="174" y2="72" stroke="#607A8A" stroke-width="2" stroke-dasharray="5 3"/>
<path d="M 70,80 L 70,145 M 70,145 L 53,185 M 70,145 L 87,185" ${L}/>
<path d="M 52,100 L 36,88" ${L}/>
<path d="M 88,100 L 108,76 L 142,72" ${L}/>
${h(70,65)}
${j(52,100)}${j(88,100)}${j(108,76)}${j(53,185,4)}${j(87,185,4)}
</svg>`,

'pullover': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${bench(72,110,56,35)}
<path d="M 100,100 L 100,155 M 100,155 L 80,182 M 100,155 L 120,182" ${L}/>
<path d="M 80,114 L 60,96 L 54,60" ${L}/>
<path d="M 120,114 L 140,96 L 146,60" ${L}/>
${db(100,50,0)}
${h(100,88)}
${j(80,114)}${j(120,114)}${j(60,96)}${j(140,96)}${j(80,182,4)}${j(120,182,4)}
</svg>`,

'curl': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<path d="M 78,58 L 100,48 L 122,58 M 100,48 L 100,108 M 100,108 L 85,150 L 82,182 M 100,108 L 115,150 L 118,182" ${L}/>
<path d="M 78,58 L 66,90 L 76,124" ${L}/>
<path d="M 122,58 L 134,90 L 124,124" ${L}/>
${db(86,128,0)}${db(114,128,0)}
${h(100,28)}
${j(78,58)}${j(122,58)}${j(66,90)}${j(134,90)}${j(85,150)}${j(115,150)}
</svg>`,

// ── LEGS ─────────────────────────────────────────────────────────────────────

'squat': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${bar(36,68,164,68)}${pl(30,68)}${pl(164,68)}
<path d="M 72,76 L 100,68 L 128,76 M 100,68 L 100,112 M 100,112 L 68,148 L 58,182 M 100,112 L 132,148 L 142,182" ${L}/>
<path d="M 72,76 L 52,78" ${L}/>
<path d="M 128,76 L 148,78" ${L}/>
${h(100,52)}
${j(72,76)}${j(128,76)}${j(68,148)}${j(132,148)}
</svg>`,

'bulgarian-squat': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${bench(128,126,52,30)}
<path d="M 72,52 L 72,105 M 72,105 L 50,152 L 48,180 M 72,105 L 100,128 L 142,136" ${L}/>
<path d="M 52,72 L 34,80" ${L}/>
<path d="M 92,72 L 112,78" ${L}/>
${h(72,36)}
${j(52,72)}${j(92,72)}${j(50,152)}${j(100,128)}
</svg>`,

'sumo-squat': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<path d="M 70,75 L 100,65 L 130,75 M 100,65 L 100,112 M 100,112 L 60,148 L 48,182 M 100,112 L 140,148 L 152,182" ${L}/>
<path d="M 70,75 L 50,78" ${L}/>
<path d="M 130,75 L 150,78" ${L}/>
${db(100,158,90)}
${h(100,46)}
${j(70,75)}${j(130,75)}${j(60,148)}${j(140,148)}
</svg>`,

'deadlift': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${bar(36,150,150,150)}${pl(30,150)}${pl(150,150)}
<path d="M 78,58 L 100,105 M 100,105 L 118,162 L 120,180 M 100,105 L 82,165 L 80,180" ${L}/>
<path d="M 60,74 L 48,128 L 44,150" ${L}/>
<path d="M 96,68 L 88,128 L 86,150" ${L}/>
${h(76,44)}
${j(60,74)}${j(96,68)}${j(48,128)}${j(118,162)}${j(82,165)}
</svg>`,

'leg-press': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<rect x="15" y="40" width="85" height="125" rx="5" ${EF}/>
<rect x="152" y="22" width="42" height="32" rx="4" ${EF}/>
<line x1="100" y1="90" x2="155" y2="42" stroke="#607A8A" stroke-width="3" stroke-dasharray="6 3"/>
<path d="M 55,103 L 55,138 M 55,138 L 100,94 L 154,44" ${L}/>
${h(55,90)}
${j(55,138)}${j(100,94)}
</svg>`,

'leg-curl': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${bench(22,86,150,35)}
<path d="M 152,80 L 58,80 M 58,80 L 44,108 L 40,130 M 58,80 L 72,108 L 72,130" ${L}/>
<path d="M 112,80 L 125,50 L 142,30" ${L}/>
<rect x="138" y="20" width="20" height="12" rx="3" ${EF}/>
${h(162,80)}
${j(112,80)}${j(125,50)}${j(44,108)}${j(72,108)}
</svg>`,

'calf-raise': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<rect x="40" y="178" width="120" height="8" rx="3" ${EF}/>
<path d="M 78,58 L 100,48 L 122,58 M 100,48 L 100,110 M 100,110 L 85,150 L 78,172 M 100,110 L 115,150 L 122,172" ${L}/>
<path d="M 78,58 L 62,70" ${L}/>
<path d="M 122,58 L 138,70" ${L}/>
${h(100,28)}
${j(78,58)}${j(122,58)}${j(85,150)}${j(115,150)}
</svg>`,

'quad-extension': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<rect x="18" y="88" width="12" height="82" rx="3" ${EF}/>
<rect x="30" y="88" width="48" height="12" rx="3" ${EF}/>
<path d="M 86,62 L 72,120 M 72,120 L 52,165 L 50,182 M 72,120 L 155,128 L 176,126" ${L}/>
<path d="M 66,78 L 48,76" ${L}/>
<path d="M 106,76 L 128,68" ${L}/>
<rect x="172" y="120" width="20" height="13" rx="3" ${EF}/>
${h(86,48)}
${j(66,78)}${j(106,76)}${j(72,120)}${j(52,165)}
</svg>`,

'hip-abduction': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<path d="M 78,58 L 100,48 L 122,58 M 100,48 L 100,108 M 100,108 L 82,158 L 80,180 M 100,108 L 142,142 L 156,168" ${L}/>
<path d="M 78,58 L 60,66" ${L}/>
<path d="M 122,58 L 140,66" ${L}/>
<line x1="100" y1="108" x2="148" y2="80" stroke="#607A8A" stroke-width="2" stroke-dasharray="5 3"/>
${h(100,28)}
${j(78,58)}${j(122,58)}${j(82,158)}${j(142,142)}
</svg>`,

'lunge': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<path d="M 90,48 L 95,105 M 95,105 L 58,155 L 55,182 M 95,105 L 128,148 L 145,140 L 155,165" ${L}/>
<path d="M 72,66 L 55,74" ${L}/>
<path d="M 110,66 L 128,74" ${L}/>
${db(50,78,90)}${db(130,78,90)}
<rect x="44" y="178" width="28" height="6" rx="2" ${EF}/>
${h(90,32)}
${j(72,66)}${j(110,66)}${j(58,155)}${j(128,148)}${j(145,140)}
</svg>`,

'hip-thrust': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${bench(18,115,56,40)}
<path d="M 54,100 L 98,100 L 126,120 L 150,165 L 154,182 M 126,120 L 108,158 L 106,182" ${L}/>
<path d="M 74,108 L 62,128" ${L}/>
<path d="M 96,98 L 112,88" ${L}/>
${bar(88,108,158,108)}${pl(83,108,6,14)}${pl(158,108,6,14)}
${h(52,88)}
${j(74,108)}${j(62,128)}${j(126,120)}${j(150,165)}${j(108,158)}
</svg>`,

'cable-kickback': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<rect x="12" y="140" width="14" height="35" rx="2" ${EF}/>
<line x1="26" y1="155" x2="35" y2="145" stroke="#607A8A" stroke-width="2" stroke-dasharray="4 3"/>
<path d="M 66,72 L 80,125 M 80,125 L 62,172 L 60,190 M 80,125 L 132,106 L 168,88" ${L}/>
<path d="M 48,90 L 36,114 L 30,145" ${L}/>
<path d="M 84,88 L 104,76" ${L}/>
${h(66,58)}
${j(48,90)}${j(84,88)}${j(36,114)}${j(80,125)}${j(132,106)}${j(62,172)}
</svg>`,

'plank-row': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<path d="M 155,90 L 52,110 M 52,110 L 36,145 L 34,162 M 52,110 L 60,148 L 60,162" ${L}/>
<path d="M 133,94 L 126,112 L 128,140" ${L}/>
<path d="M 175,94 L 162,72 L 152,52" ${L}/>
${kb(148,42)}
${h(162,90)}
${j(133,94)}${j(126,112)}${j(162,72)}${j(36,145)}${j(60,148)}
</svg>`,

// ── ABS ───────────────────────────────────────────────────────────────────────

'plank': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<line x1="22" y1="155" x2="178" y2="155" stroke="#415566" stroke-width="2"/>
<path d="M 158,102 L 40,120 M 40,120 L 24,150 L 24,158 M 158,102 L 172,150 L 172,158" ${L}/>
<path d="M 112,110 L 108,130 L 108,148" ${LS}/>
<path d="M 68,116 L 64,136 L 64,150" ${LS}/>
${h(162,94)}
${j(112,110)}${j(68,116)}
</svg>`,

'side-plank': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<line x1="22" y1="165" x2="178" y2="165" stroke="#415566" stroke-width="2"/>
<path d="M 40,155 L 140,105 L 176,155 M 88,132 L 88,60" ${L}/>
${h(148,94)}
${j(88,132)}${j(40,155)}${j(176,155)}
</svg>`,

'leg-raise': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<line x1="50" y1="148" x2="155" y2="148" stroke="#415566" stroke-width="2"/>
<path d="M 158,120 L 60,120 M 60,120 L 52,146 M 60,120 L 68,146" ${L}/>
<path d="M 100,120 L 90,60 L 80,28 M 100,120 L 110,60 L 120,28" ${L}/>
${h(158,108)}
${j(90,60)}${j(110,60)}${j(52,146)}${j(68,146)}
</svg>`,

'crunch': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<line x1="22" y1="168" x2="178" y2="168" stroke="#415566" stroke-width="2"/>
<path d="M 162,124 L 72,124 L 50,148 L 46,165 M 72,124 L 78,148 L 78,165" ${L}/>
<path d="M 100,124 L 100,86 L 100,64" ${L}/>
<path d="M 80,118 L 64,108" ${L}/>
<path d="M 118,118 L 134,108" ${L}/>
${h(162,112)}
${j(80,118)}${j(118,118)}${j(50,148)}${j(78,148)}
</svg>`,

'bicycle-crunch': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<line x1="22" y1="168" x2="178" y2="168" stroke="#415566" stroke-width="2"/>
<path d="M 155,110 L 70,110 L 52,148 L 50,165 M 70,110 L 85,150 L 88,165" ${L}/>
<path d="M 100,110 L 110,72 L 132,52" ${L}/>
<path d="M 78,105 L 58,90 L 134,52" ${L}/>
<path d="M 115,110 L 148,85 L 162,65" ${L}/>
${h(158,100)}
${j(110,72)}${j(52,148)}${j(88,165,4)}${j(148,85)}
</svg>`,

'russian-twist': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<path d="M 55,105 L 100,78 M 100,78 L 135,100 L 148,140 L 145,165 M 100,78 L 70,148 L 68,165" ${L}/>
<path d="M 100,78 L 80,54 L 60,44" ${L}/>
${db(50,40,45)}
${h(100,62)}
${j(80,54)}${j(148,140)}${j(70,148)}
</svg>`,

'mountain-climber': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<line x1="22" y1="155" x2="178" y2="155" stroke="#415566" stroke-width="2"/>
<path d="M 162,85 L 55,108 M 55,108 L 38,148 L 36,158 M 55,108 L 62,150 L 62,158" ${L}/>
<path d="M 115,96 L 90,112 L 82,140" ${L}/>
<path d="M 80,105 L 75,80 L 80,58" ${LS}/>
${h(165,78)}
${j(115,96)}${j(90,112)}${j(75,80)}${j(38,148)}
</svg>`,

'vup': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<path d="M 30,155 L 88,105 L 100,90 L 112,105 L 170,155" ${L}/>
<path d="M 80,112 L 62,88 L 46,68" ${LS}/>
<path d="M 120,112 L 138,88 L 154,68" ${LS}/>
${h(100,78)}
${j(88,105)}${j(112,105)}${j(62,88)}${j(138,88)}
</svg>`,

'dead-bug': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<line x1="22" y1="165" x2="178" y2="165" stroke="#415566" stroke-width="2"/>
<path d="M 155,95 L 56,95 M 56,95 L 45,130 L 42,162 M 56,95 L 68,130 L 68,162" ${L}/>
<path d="M 90,95 L 92,50 L 94,30" ${L}/>
<path d="M 120,95 L 145,70 L 165,50" ${L}/>
${h(158,88)}
${j(90,95)}${j(120,95)}${j(92,50)}${j(145,70)}${j(42,130)}${j(68,130)}
</svg>`,

'hollow-hold': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<path d="M 165,120 L 100,95 L 35,120" ${L}/>
<path d="M 68,110 L 55,75 L 48,52" ${LS}/>
<path d="M 132,110 L 145,75 L 152,52" ${LS}/>
${h(100,80)}
${j(55,75)}${j(145,75)}${j(68,110)}${j(132,110)}
</svg>`,

'ab-wheel': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<ellipse cx="140" cy="138" rx="24" ry="14" ${EF}/>
<line x1="116" y1="138" x2="164" y2="138" stroke="#607A8A" stroke-width="4"/>
<path d="M 155,80 L 80,112 M 80,112 L 62,148 L 60,162 M 80,112 L 90,152 L 90,164" ${L}/>
<path d="M 132,88 L 140,110 L 140,135" ${L}/>
${h(158,72)}
${j(132,88)}${j(140,110)}${j(62,148)}${j(90,152)}
</svg>`,

// ── KETTLEBELL EXERCISES ──────────────────────────────────────────────────────

'kb-swing': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<path d="M 80,55 L 105,105 M 105,105 L 90,155 L 88,178 M 105,105 L 125,155 L 128,178" ${L}/>
<path d="M 62,72 L 50,118 L 50,140" ${L}/>
<path d="M 98,68 L 118,88 L 148,78" ${L}/>
${kb(155,68)}
${h(80,40)}
${j(62,72)}${j(98,68)}${j(118,88)}${j(90,155)}${j(125,155)}
</svg>`,

'kb-goblet': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
<path d="M 68,75 L 100,65 L 132,75 M 100,65 L 100,115 M 100,115 L 62,150 L 50,182 M 100,115 L 138,150 L 150,182" ${L}/>
<path d="M 68,75 L 56,96 L 74,115" ${L}/>
<path d="M 132,75 L 144,96 L 126,115" ${L}/>
${kb(100,96)}
${h(100,46)}
${j(68,75)}${j(132,75)}${j(56,96)}${j(144,96)}${j(62,150)}${j(138,150)}
</svg>`,

'kb-row': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${bench(18,110,55,40)}
<path d="M 52,56 L 90,90 L 105,155 L 108,178 M 90,90 L 72,158 L 70,178" ${L}/>
<path d="M 72,70 L 55,90 L 44,110" ${L}/>
<path d="M 88,80 L 110,58 L 138,58" ${L}/>
${kb(140,48)}
${h(50,44)}
${j(72,70)}${j(55,90)}${j(110,58)}${j(90,90)}${j(105,155)}${j(72,158)}
</svg>`,

'kb-deadlift': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${kb(62,148)}${kb(138,148)}
<path d="M 78,58 L 100,112 M 100,112 L 118,165 L 120,182 M 100,112 L 82,168 L 80,182" ${L}/>
<path d="M 60,74 L 62,125 L 62,148" ${L}/>
<path d="M 96,68 L 104,125 L 138,148" ${L}/>
${h(76,44)}
${j(60,74)}${j(96,68)}${j(118,165)}${j(82,168)}
</svg>`,

'kb-press': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${kb(126,18)}
<path d="M 78,58 L 100,48 L 122,58 M 100,48 L 100,108 M 100,108 L 85,150 L 82,182 M 100,108 L 115,150 L 118,182" ${L}/>
<path d="M 78,58 L 70,38" ${L}/>
<path d="M 122,58 L 132,36 L 132,26" ${L}/>
${h(100,28)}
${j(78,58)}${j(122,58)}${j(70,38)}${j(132,36)}${j(85,150)}${j(115,150)}
</svg>`,

'kb-clean-press': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${kb(140,58)}
<path d="M 78,60 L 100,50 L 122,60 M 100,50 L 100,110 M 100,110 L 85,152 L 82,182 M 100,110 L 115,152 L 118,182" ${L}/>
<path d="M 78,60 L 66,82" ${L}/>
<path d="M 122,60 L 132,68 L 138,60" ${L}/>
${h(100,30)}
${j(78,60)}${j(122,60)}${j(66,82)}${j(132,68)}${j(85,152)}${j(115,152)}
</svg>`,

'kb-lunge': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${kb(50,148)}${kb(148,148)}
<path d="M 90,48 L 96,105 M 96,105 L 58,155 L 55,182 M 96,105 L 128,148 L 145,140 L 155,165" ${L}/>
<path d="M 72,66 L 50,140" ${L}/>
<path d="M 110,66 L 148,140" ${L}/>
${h(90,32)}
${j(72,66)}${j(110,66)}${j(58,155)}${j(128,148)}
</svg>`,

'kb-high-pull': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${kb(100,85)}
<path d="M 78,58 L 100,48 L 122,58 M 100,48 L 100,108 M 100,108 L 85,150 L 82,182 M 100,108 L 115,150 L 118,182" ${L}/>
<path d="M 78,58 L 58,72 L 65,86" ${L}/>
<path d="M 122,58 L 142,72 L 135,86" ${L}/>
${h(100,28)}
${j(78,58)}${j(122,58)}${j(58,72)}${j(142,72)}${j(85,150)}${j(115,150)}
</svg>`,

'kb-renegade': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${kb(44,145)}
<path d="M 155,88 L 52,108 M 52,108 L 36,145 M 52,108 L 62,148 L 62,162" ${L}/>
<path d="M 132,92 L 126,112 L 44,145" ${L}/>
<path d="M 175,92 L 162,70 L 148,48" ${L}/>
${kb(142,38)}
${h(162,88)}
${j(132,92)}${j(126,112)}${j(162,70)}${j(36,145)}
</svg>`,

'kb-sumo': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${kb(100,168)}
<path d="M 68,75 L 100,65 L 132,75 M 100,65 L 100,115 M 100,115 L 60,150 L 48,182 M 100,115 L 140,150 L 152,182" ${L}/>
<path d="M 68,75 L 50,80" ${L}/>
<path d="M 132,75 L 150,80" ${L}/>
<path d="M 74,118 L 100,165" ${L}/>
<path d="M 126,118 L 100,165" ${L}/>
${h(100,46)}
${j(68,75)}${j(132,75)}${j(60,150)}${j(140,150)}
</svg>`,

'kb-single-leg-rdl': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${kb(148,128)}
<path d="M 78,52 L 100,100 M 100,100 L 88,165 L 86,182 M 100,100 L 140,90 L 165,80" ${L}/>
<path d="M 60,68 L 55,120 L 60,128 L 148,128" ${L}/>
<path d="M 94,64 L 105,90" ${L}/>
${h(78,38)}
${j(60,68)}${j(94,64)}${j(55,120)}${j(140,90)}${j(88,165)}
</svg>`,

'kb-farmer-carry': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${kb(45,155)}${kb(155,155)}
<path d="M 78,58 L 100,48 L 122,58 M 100,48 L 100,108 M 100,108 L 80,148 L 78,182 M 100,108 L 120,148 L 122,182" ${L}/>
<path d="M 78,58 L 62,108 L 45,150" ${L}/>
<path d="M 122,58 L 138,108 L 155,150" ${L}/>
${h(100,28)}
${j(78,58)}${j(122,58)}${j(62,108)}${j(138,108)}${j(80,148)}${j(120,148)}
</svg>`,

'kb-snatch': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="${BK}"/>
${kb(134,18)}
<path d="M 78,60 L 100,50 L 122,60 M 100,50 L 100,110 M 100,110 L 85,152 L 82,182 M 100,110 L 115,152 L 118,182" ${L}/>
<path d="M 78,60 L 68,80" ${L}/>
<path d="M 122,60 L 130,42 L 136,26" ${L}/>
${h(100,30)}
${j(78,60)}${j(122,60)}${j(68,80)}${j(130,42)}${j(85,152)}${j(115,152)}
</svg>`,

};

// ── EXERCISE DATABASE ─────────────────────────────────────────────────────────

export const EXERCISE_DB = {

  // ── Empuje ─────────────────────────────────────────────────────────────────
  'Press banca o press mancuernas': {
    svg: SVG['bench-press'],
    description: 'Acostado en el banco con los pies en el suelo, baja la barra hasta el pecho rozando y empuja hasta extender los codos. Escápulas juntas y espalda baja ligeramente arqueada.',
    muscles: ['Pecho', 'Deltoides anterior', 'Tríceps'],
  },
  'Press inclinado con mancuernas': {
    svg: SVG['bench-press'],
    description: 'En banco inclinado 30-45°, baja las mancuernas hasta la altura del pecho con codos a 75° y empuja hacia arriba y adentro. Mayor énfasis en la porción clavicular del pectoral.',
    muscles: ['Pecho (porción clavicular)', 'Deltoides anterior', 'Tríceps'],
  },
  'Press militar': {
    svg: SVG['military-press'],
    description: 'De pie o sentado, empieza con la barra a la altura de la clavícula y empuja verticalmente sobre la cabeza hasta extender los codos. Core activo para proteger la zona lumbar.',
    muscles: ['Deltoides (todas las porciones)', 'Tríceps', 'Trapecio superior'],
  },
  'Arnold press': {
    svg: SVG['military-press'],
    description: 'Con mancuernas en posición de curl, rota las palmas hacia afuera mientras empujas hacia arriba hasta la extensión completa. Activa las 3 porciones del deltoides en un solo movimiento.',
    muscles: ['Deltoides completo', 'Tríceps', 'Trapecio'],
  },
  'Elevaciones laterales': {
    svg: SVG['lateral-raise'],
    description: 'Con mancuernas a los lados, eleva los brazos hasta la altura de los hombros manteniendo los codos ligeramente doblados. Pulgares ligeramente hacia abajo para mayor activación del deltoides medio.',
    muscles: ['Deltoides medial', 'Trapecio superior'],
  },
  'Elevaciones laterales en cable': {
    svg: SVG['lateral-raise'],
    description: 'Con el cable bajo a un costado, eleva el brazo opuesto hasta la horizontal. La tensión constante del cable es más efectiva que la mancuerna en la parte baja del movimiento.',
    muscles: ['Deltoides medial', 'Trapecio superior'],
  },
  'Fondos o press francés': {
    svg: SVG['tricep-extension'],
    description: 'Fondos en paralelas bajando hasta 90° o press francés con barra EZ detrás de la cabeza. Los fondos activan todo el tríceps. El press francés permite carga pesada y gran rango de movimiento.',
    muscles: ['Tríceps (todas las cabezas)', 'Pecho (fondos)'],
  },
  'Extensión tríceps polea': {
    svg: SVG['tricep-extension'],
    description: 'Frente a la polea alta, mantén los codos fijos al costado del torso y extiende completamente los antebrazos. Aprieta el tríceps en la posición más baja antes de volver.',
    muscles: ['Tríceps (cabeza lateral y medial)'],
  },
  'Extensión tríceps en cuerda': {
    svg: SVG['tricep-extension'],
    description: 'Con la cuerda en polea alta, al bajar separa las manos al final del movimiento para mayor contracción de las cabezas lateral y medial del tríceps.',
    muscles: ['Tríceps (cabeza lateral)', 'Anconeo'],
  },
  'Aperturas en máquina o cables': {
    svg: SVG['chest-fly'],
    description: 'Sentado en la máquina o de pie con cables, lleva los brazos hacia adelante y al centro con leve flexión de codo. Siente el estiramiento en el pecho al abrir y contrae fuerte al cerrar.',
    muscles: ['Pecho (porción esternal)', 'Deltoides anterior'],
  },

  // ── Tirón ──────────────────────────────────────────────────────────────────
  'Dominadas o jalón al pecho': {
    svg: SVG['pullup'],
    description: 'Cuelga de la barra con agarre supino o pronado y jala hacia la barbilla. En el jalón, siéntate recto y lleva la barra a la clavícula inclinando el torso levemente. Activa el dorsal desde el inicio.',
    muscles: ['Dorsal ancho', 'Bíceps', 'Romboides'],
  },
  'Jalón agarre neutro': {
    svg: SVG['pullup'],
    description: 'Con el accesorio de agarre neutro en la polea alta, jala hacia el pecho manteniendo el torso ligeramente reclinado. El agarre neutro reduce la tensión en las muñecas y permite mayor carga.',
    muscles: ['Dorsal ancho', 'Bíceps', 'Redondo mayor'],
  },
  'Remo con barra o mancuerna': {
    svg: SVG['row-bent'],
    description: 'Inclinado a 45°, jala la barra o mancuerna hacia el abdomen bajo apretando el codo hacia atrás. Escápulas retraídas en la contracción. No uses el impulso del torso para subir el peso.',
    muscles: ['Dorsal ancho', 'Romboides', 'Trapecio medio', 'Bíceps'],
  },
  'Remo en polea baja': {
    svg: SVG['row-machine'],
    description: 'Sentado frente a la polea baja, tira del agarre hacia el abdomen manteniendo el torso erguido. Codos pegados al cuerpo y escápulas retraídas al final. Devuelve controlando.',
    muscles: ['Dorsal ancho', 'Romboides', 'Trapecio medio', 'Bíceps'],
  },
  'Remo Hammer Strength o máquina': {
    svg: SVG['row-machine'],
    description: 'En la máquina de remo convergente, jala los mangos hacia el pecho o las caderas según el ángulo. La máquina permite enfocarse en la contracción sin estabilizar el peso libre.',
    muscles: ['Dorsal ancho', 'Romboides', 'Deltoides posterior'],
  },
  'Face pull': {
    svg: SVG['face-pull'],
    description: 'Con la cuerda en polea alta a la altura de la cara, jala hacia la frente separando las manos al final. Codos por encima de los hombros. Trabaja el manguito rotador y el deltoides posterior.',
    muscles: ['Deltoides posterior', 'Trapecio', 'Manguito rotador'],
  },
  'Pull-over con mancuerna': {
    svg: SVG['pullover'],
    description: 'Acostado transversalmente en el banco, sujeta una mancuerna con ambas manos y baja hacia atrás de la cabeza manteniendo los codos ligeramente doblados. Estira bien el dorsal antes de volver.',
    muscles: ['Dorsal ancho', 'Pecho (serrato)', 'Tríceps (cabeza larga)'],
  },
  'Curl barra o mancuerna': {
    svg: SVG['curl'],
    description: 'De pie con la barra o mancuernas, dobla los codos llevando el peso hacia los hombros sin mover los hombros. Aprieta el bíceps arriba y baja de forma controlada.',
    muscles: ['Bíceps braquial', 'Braquial anterior'],
  },
  'Curl martillo': {
    svg: SVG['curl'],
    description: 'Igual que el curl bicep pero con agarre neutro (palmas hacia adentro). Activa más el braquioradial del antebrazo además del bíceps.',
    muscles: ['Bíceps', 'Braquioradial', 'Braquial'],
  },
  'Curl predicador': {
    svg: SVG['curl'],
    description: 'Apoya la parte posterior del brazo en el banco predicador y sube la barra EZ o mancuerna. Elimina el impulso del cuerpo para aislar el bíceps.',
    muscles: ['Bíceps (cabeza corta)', 'Braquial'],
  },
  'Curl en polea baja': {
    svg: SVG['curl'],
    description: 'De pie frente a la polea baja, sube el agarre doblando los codos. La tensión constante del cable trabaja el bíceps diferente a la mancuerna.',
    muscles: ['Bíceps', 'Braquial'],
  },

  // ── Kettlebell A ───────────────────────────────────────────────────────────
  'Swing con kettlebell': {
    svg: SVG['kb-swing'],
    description: 'Coloca la KB entre los pies. Empuja las caderas hacia atrás (no agaches), luego explosivamente extiende caderas y rodillas para proyectar la KB hacia adelante hasta la altura del pecho. El impulso viene de las caderas, no los brazos.',
    muscles: ['Glúteo mayor', 'Isquiotibiales', 'Core', 'Hombros (estabilización)'],
  },
  'Sentadilla goblet': {
    svg: SVG['kb-goblet'],
    description: 'Sujeta la KB por las "orejas" (handles) a la altura del pecho. Baja en sentadilla con los codos dentro de las rodillas y el torso erguido. La KB actúa de contrapeso para facilitar la postura vertical.',
    muscles: ['Cuádriceps', 'Glúteo mayor', 'Core', 'Aductores'],
  },
  'Sentadilla goblet con pausa': {
    svg: SVG['kb-goblet'],
    description: 'Igual que la sentadilla goblet, pero aguanta 2-3 segundos en la posición más baja antes de subir. La pausa elimina el rebote elástico y exige mayor control y fuerza en los glúteos y cuádriceps.',
    muscles: ['Cuádriceps', 'Glúteo mayor', 'Core', 'Aductores'],
  },
  'Remo con kettlebell': {
    svg: SVG['kb-row'],
    description: 'Apoya la mano y la rodilla del mismo lado en el banco. Con la KB en la mano libre, jala hacia la cadera manteniendo la espalda paralela al suelo. Codo pegado al cuerpo.',
    muscles: ['Dorsal ancho', 'Romboides', 'Bíceps', 'Deltoides posterior'],
  },
  'Peso muerto con kettlebell': {
    svg: SVG['kb-deadlift'],
    description: 'Con las KBs a los lados de los pies, bisagra la cadera hacia atrás, agarra los asas y levanta extendiendo caderas y rodillas simultáneamente. Espalda recta durante todo el movimiento.',
    muscles: ['Glúteo mayor', 'Isquiotibiales', 'Erector espinal', 'Trapecio'],
  },
  'Press con kettlebell': {
    svg: SVG['kb-press'],
    description: 'Desde la posición de rack (KB en hombro), presiona hacia arriba hasta la extensión total del brazo. Bloquea la muñeca recta y el hombro activo. Baja de forma controlada volviendo al rack.',
    muscles: ['Deltoides', 'Tríceps', 'Trapecio superior', 'Core'],
  },

  // ── Kettlebell B ───────────────────────────────────────────────────────────
  'Clean y press': {
    svg: SVG['kb-clean-press'],
    description: 'Desde el suelo o posición de swing, lleva la KB a la posición de rack en un movimiento fluido (clean), luego presiónala sobre la cabeza (press). Exige coordinación, potencia y fuerza de empuje.',
    muscles: ['Cuerpo completo', 'Glúteo', 'Core', 'Deltoides', 'Tríceps'],
  },
  'Zancadas con kettlebell': {
    svg: SVG['kb-lunge'],
    description: 'Con KBs en las manos a los lados, da un paso adelante y baja la rodilla trasera hacia el suelo. Torso erguido, rodilla delantera no sobrepasa la punta del pie. Activa glúteo y cuádriceps al subir.',
    muscles: ['Cuádriceps', 'Glúteo mayor', 'Isquiotibiales', 'Core'],
  },
  'High pull': {
    svg: SVG['kb-high-pull'],
    description: 'Desde posición de swing, al subir la KB jala el codo hacia arriba llevando la KB hasta la altura del hombro/mentón con el codo por encima. Combina swing explosivo con remo vertical.',
    muscles: ['Deltoides posterior', 'Trapecio', 'Core', 'Glúteo', 'Isquiotibiales'],
  },
  'Remo renegado': {
    svg: SVG['kb-renegade'],
    description: 'En posición de plancha con manos en las KBs, jala una KB hacia la cadera mientras el otro brazo y los pies estabilizan. El core trabaja intensamente para evitar la rotación del tronco.',
    muscles: ['Core', 'Dorsal ancho', 'Romboides', 'Hombros', 'Pecho (estabilización)'],
  },
  'Sentadilla sumo con kettlebell': {
    svg: SVG['kb-sumo'],
    description: 'Postura amplia con pies apuntando 45° afuera, cuelga una KB con ambas manos entre las piernas y baja manteniendo el torso erguido. Mayor activación de aductores y glúteo medio.',
    muscles: ['Aductores', 'Glúteo mayor', 'Glúteo medio', 'Cuádriceps'],
  },

  // ── Kettlebell A Mes 2 ─────────────────────────────────────────────────────
  'Peso muerto a una pierna': {
    svg: SVG['kb-single-leg-rdl'],
    description: 'De pie sobre una pierna, bisagra la cadera llevando el torso hacia adelante mientras la pierna libre se eleva hacia atrás. Mantén la pelvis nivelada y la columna neutra. Gran demanda de estabilidad y propiocepción.',
    muscles: ['Glúteo mayor', 'Isquiotibiales', 'Core', 'Tobillo (estabilización)'],
  },

  // ── Kettlebell B Mes 2 ─────────────────────────────────────────────────────
  'Snatch con kettlebell': {
    svg: SVG['kb-snatch'],
    description: 'En un movimiento continuo, lleva la KB desde el suelo (o swing) hasta la posición overhead con el brazo completamente extendido sin detenerla en el rack. Requiere timing, potencia explosiva y movilidad de hombro.',
    muscles: ['Cuerpo completo', 'Glúteo', 'Isquiotibiales', 'Deltoides', 'Core'],
  },
  'Zancadas inversas con kettlebell': {
    svg: SVG['kb-lunge'],
    description: 'Con KBs en las manos, da un paso hacia atrás y baja la rodilla al suelo. El pie delantero permanece fijo. Las zancadas inversas reducen el estrés en la rodilla delantera y activan más el glúteo.',
    muscles: ['Glúteo mayor', 'Cuádriceps', 'Isquiotibiales', 'Core'],
  },
  'Farmer carry': {
    svg: SVG['kb-farmer-carry'],
    description: 'Sujeta una KB pesada en cada mano y camina erguido, pasos cortos y controlados. Mantén los hombros atrás y el core activo. Es uno de los mejores ejercicios para fuerza de agarre, core y estabilidad total.',
    muscles: ['Trapecios', 'Core', 'Antebrazo', 'Glúteo', 'Cuádriceps (estabilización)'],
  },

  // ── Abs ───────────────────────────────────────────────────────────────────
  'Plancha': {
    svg: SVG['plank'],
    description: 'Apoya los antebrazos y puntillas en el suelo manteniendo el cuerpo recto como una tabla. Activa el core, glúteos y piernas simultáneamente durante todo el tiempo.',
    muscles: ['Core (transverso, recto abdominal)', 'Glúteos', 'Hombros'],
  },
  'Plancha con toque hombro': {
    svg: SVG['plank'],
    description: 'En plancha alta (brazos extendidos), lleva una mano al hombro contrario alternando lados. Exige mayor estabilidad de core y resistencia a la rotación.',
    muscles: ['Core', 'Hombros', 'Glúteos'],
  },
  'Plancha lateral': {
    svg: SVG['side-plank'],
    description: 'Apoya el antebrazo en el suelo y eleva las caderas formando una línea recta. Mantén los pies apilados. Trabaja especialmente el oblicuo y el glúteo medio.',
    muscles: ['Oblicuos', 'Glúteo medio', 'Core lateral'],
  },
  'Plancha lateral dinámica': {
    svg: SVG['side-plank'],
    description: 'Desde la plancha lateral, baja y sube las caderas de forma controlada. El movimiento dinámico aumenta la dificultad y activa más el oblicuo.',
    muscles: ['Oblicuos', 'Glúteo medio', 'Core lateral'],
  },
  'Elevación de piernas': {
    svg: SVG['leg-raise'],
    description: 'Acostado boca arriba, sube las piernas juntas hasta 90° y bájalas lentamente sin que toquen el suelo. Coloca las manos bajo los glúteos para proteger la lumbar.',
    muscles: ['Recto abdominal inferior', 'Flexores de cadera'],
  },
  'Crunch': {
    svg: SVG['crunch'],
    description: 'Acostado con rodillas flexionadas, eleva los hombros del suelo contrayendo el abdomen. No jales el cuello con las manos. Exhala al subir.',
    muscles: ['Recto abdominal (porción superior)'],
  },
  'Crunch en polea': {
    svg: SVG['crunch'],
    description: 'De rodillas frente a la polea alta, jala la cuerda hacia abajo mientras flexionas el torso. Permite más carga que el crunch convencional para mayor progresión.',
    muscles: ['Recto abdominal', 'Oblicuos'],
  },
  'Crunch inverso': {
    svg: SVG['crunch'],
    description: 'Acostado boca arriba, eleva las caderas del suelo llevando las rodillas hacia el pecho. No uses impulso. Trabaja la porción inferior del recto abdominal.',
    muscles: ['Recto abdominal inferior', 'Flexores de cadera'],
  },
  'Crunch inverso con peso': {
    svg: SVG['crunch'],
    description: 'Crunch inverso sujetando un peso entre los pies o con banda de resistencia. El peso adicional aumenta significativamente la activación abdominal.',
    muscles: ['Recto abdominal inferior', 'Flexores de cadera'],
  },
  'Bicicleta': {
    svg: SVG['bicycle-crunch'],
    description: 'Acostado, lleva el codo derecho hacia la rodilla izquierda mientras extiendes la pierna derecha, alternando en pedalo. Incluye rotación del torso para activar oblicuos.',
    muscles: ['Oblicuos', 'Recto abdominal', 'Flexores de cadera'],
  },
  'Bicicleta abdominal': {
    svg: SVG['bicycle-crunch'],
    description: 'Codo hacia rodilla contraria con rotación alternada. Es uno de los ejercicios con mayor activación de oblicuos según la investigación electromiográfica.',
    muscles: ['Oblicuos', 'Recto abdominal', 'Flexores de cadera'],
  },
  'Russian twist': {
    svg: SVG['russian-twist'],
    description: 'Sentado con rodillas flexionadas y torso inclinado hacia atrás, rota el tronco de lado a lado. Mantén los talones levantados para mayor dificultad.',
    muscles: ['Oblicuos', 'Recto abdominal'],
  },
  'Russian twist con peso': {
    svg: SVG['russian-twist'],
    description: 'Igual que el russian twist pero sujetando un disco, mancuerna o medicine ball. El peso añade resistencia significativa a la rotación.',
    muscles: ['Oblicuos', 'Recto abdominal'],
  },
  'Mountain climbers': {
    svg: SVG['mountain-climber'],
    description: 'En plancha alta, alterna llevando cada rodilla hacia el pecho de forma explosiva. Combina fuerza de core con trabajo cardiovascular y de flexores de cadera.',
    muscles: ['Core', 'Flexores de cadera', 'Hombros', 'Cardio'],
  },
  'Mountain climbers lentos': {
    svg: SVG['mountain-climber'],
    description: 'Misma posición que los mountain climbers estándar pero en ritmo lento y controlado. Mayor tiempo bajo tensión del core con menor componente cardiovascular.',
    muscles: ['Core', 'Flexores de cadera', 'Hombros'],
  },
  'V-up': {
    svg: SVG['vup'],
    description: 'Acostado, eleva simultáneamente el torso y las piernas para tocar los pies con las manos formando una V. Trabaja el abdomen completo en un solo movimiento.',
    muscles: ['Recto abdominal completo', 'Flexores de cadera'],
  },
  'Dead bug': {
    svg: SVG['dead-bug'],
    description: 'Boca arriba con brazos y rodillas a 90°, baja el brazo derecho y la pierna izquierda sin tocar el suelo, alternando. Protege la lumbar y activa el transverso.',
    muscles: ['Transverso abdominal', 'Recto abdominal'],
  },
  'Hollow hold': {
    svg: SVG['hollow-hold'],
    description: 'Acostado, eleva los hombros y piernas manteniendo la zona lumbar pegada al suelo. Cuerpo en forma de banana. Exige tensión total y sostenida del core.',
    muscles: ['Core completo', 'Flexores de cadera', 'Dorsal ancho'],
  },
  'Ab wheel': {
    svg: SVG['ab-wheel'],
    description: 'De rodillas, rueda la rueda hacia adelante hasta que el torso quede casi horizontal, luego regresa contrayendo el abdomen. Ejercicio avanzado de core total.',
    muscles: ['Transverso y recto abdominal', 'Dorsal ancho', 'Hombros'],
  },
};

export function getExerciseData(name) {
  return EXERCISE_DB[name] || null;
}
