// Exercise database — premium SVG illustrations + descriptions + muscles

// Shared defs block (included in each SVG; IDs safe since only one modal is open at a time)
const DF = `<defs>
<radialGradient id="rg" cx="50%" cy="40%" r="62%">
  <stop offset="0%" stop-color="#1A2438"/>
  <stop offset="100%" stop-color="#06080E"/>
</radialGradient>
<filter id="gf" x="-30%" y="-30%" width="160%" height="160%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="b"/>
  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
</defs>
<rect width="200" height="200" fill="url(#rg)"/>`;

// Figure stroke styles
const L  = 'stroke="#58C5EE" stroke-width="20" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#gf)"';
const LS = 'stroke="#58C5EE" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" fill="none" filter="url(#gf)"';
// Equipment
const EF = 'fill="#1E3040" stroke="#3A6070" stroke-width="2"';
const EB = 'stroke="#A0C8D8" stroke-width="6" stroke-linecap="round" fill="none"';

// Head: big filled circle
const h = (cx,cy) => `<circle cx="${cx}" cy="${cy}" r="16" fill="#C8E2F0" stroke="#8AC0D8" stroke-width="2"/>`;
// Joint dot
const j = (cx,cy,r=7) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#38AACE"/>`;
// Barbell bar
const bar = (x1,y1,x2,y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${EB}/>`;
// Weight plate
const pl = (cx,cy,w=8,ht=24) => `<rect x="${cx-Math.floor(w/2)}" y="${cy-Math.floor(ht/2)}" width="${w}" height="${ht}" rx="3" ${EF}/>`;
// Kettlebell
const kb = (cx,cy) =>
  `<circle cx="${cx}" cy="${cy+9}" r="22" ${EF}/><path d="M${cx-13} ${cy+2}a15 11 0 1 1 26 0" stroke="#3A6070" stroke-width="9" fill="none" stroke-linecap="round"/>`;
// Dumbbell
const db = (cx,cy,a=0) => {
  const rad=a*Math.PI/180, rx=Math.round(16*Math.cos(rad)), ry=Math.round(16*Math.sin(rad));
  return `<line x1="${cx-rx}" y1="${cy-ry}" x2="${cx+rx}" y2="${cy+ry}" ${EB}/><circle cx="${cx-rx}" cy="${cy-ry}" r="8" ${EF}/><circle cx="${cx+rx}" cy="${cy+ry}" r="8" ${EF}/>`;
};
// Bench
const bench = (x,y,w,legL=36) =>
  `<rect x="${x}" y="${y}" width="${w}" height="11" rx="5" ${EF}/><line x1="${x+16}" y1="${y+11}" x2="${x+16}" y2="${y+11+legL}" ${EB}/><line x1="${x+w-16}" y1="${y+11}" x2="${x+w-16}" y2="${y+11+legL}" ${EB}/>`;

const SVG = {

// ── UPPER BODY PUSH ──────────────────────────────────────────────────────────

'bench-press': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${bench(18,114,148,38)}
${bar(74,60,155,60)}${pl(68,60)}${pl(155,60)}
<path d="M 150,107 L 65,107 L 48,132 L 36,158" ${L}/>
<path d="M 136,105 L 142,76 L 148,62" ${L}/>
<path d="M 110,105 L 100,76 L 84,62" ${L}/>
${h(168,107)}
${j(142,76)}${j(100,76)}${j(48,132)}
</svg>`,

'military-press': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${bar(50,18,150,18)}${pl(44,18)}${pl(150,18)}
<path d="M 76,60 L 100,48 L 124,60 M 100,48 L 100,110 M 100,110 L 84,152 L 80,182 M 100,110 L 116,152 L 120,182" ${L}/>
<path d="M 76,60 L 66,35 L 64,20" ${L}/>
<path d="M 124,60 L 134,35 L 136,20" ${L}/>
${h(100,28)}
${j(76,60)}${j(124,60)}${j(66,35)}${j(134,35)}${j(84,152)}${j(116,152)}
</svg>`,

'lateral-raise': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<path d="M 76,60 L 100,48 L 124,60 M 100,48 L 100,110 M 100,110 L 84,152 L 80,182 M 100,110 L 116,152 L 120,182" ${L}/>
<path d="M 76,60 L 34,86" ${L}/>
<path d="M 124,60 L 166,86" ${L}/>
${db(24,90,90)}${db(176,90,90)}
${h(100,28)}
${j(76,60)}${j(124,60)}${j(84,152)}${j(116,152)}
</svg>`,

'tricep-extension': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<path d="M 76,60 L 100,48 L 124,60 M 100,48 L 100,110 M 100,110 L 84,152 L 80,182 M 100,110 L 116,152 L 120,182" ${L}/>
<path d="M 76,60 L 65,43 L 82,22" ${L}/>
<path d="M 124,60 L 135,43 L 118,22" ${L}/>
<rect x="84" y="12" width="32" height="13" rx="4" ${EF}/>
${h(100,28)}
${j(76,60)}${j(124,60)}${j(65,43)}${j(135,43)}${j(84,152)}${j(116,152)}
</svg>`,

'chest-fly': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${bench(18,114,148,38)}
<path d="M 150,107 L 65,107 L 48,132 L 36,158" ${L}/>
<path d="M 128,104 L 158,76" ${L}/>
<path d="M 108,104 L 76,76" ${L}/>
${db(165,70,45)}${db(70,70,-45)}
${h(168,107)}
${j(158,76)}${j(76,76)}${j(48,132)}
</svg>`,

// ── UPPER BODY PULL ──────────────────────────────────────────────────────────

'pullup': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<rect x="28" y="12" width="144" height="11" rx="4" ${EF}/>
<rect x="22" y="6" width="12" height="24" rx="4" ${EF}/>
<rect x="166" y="6" width="12" height="24" rx="4" ${EF}/>
<path d="M 76,98 L 100,82 L 124,98 M 100,82 L 100,150 M 100,150 L 84,182 M 100,150 L 116,182" ${L}/>
<path d="M 76,98 L 68,55 L 70,23" ${L}/>
<path d="M 124,98 L 132,55 L 130,23" ${L}/>
${h(100,66)}
${j(76,98)}${j(124,98)}${j(68,55)}${j(132,55)}${j(84,182,5)}${j(116,182,5)}
</svg>`,

'row-bent': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${bar(54,140,150,140)}${pl(48,140)}${pl(150,140)}
<path d="M 54,60 L 118,92 L 140,157 L 142,178 M 118,92 L 100,160 L 98,178" ${L}/>
<path d="M 90,74 L 70,102 L 60,140" ${L}/>
<path d="M 114,86 L 130,56 L 128,30" ${L}/>
${h(52,48)}
${j(90,74)}${j(70,102)}${j(130,56)}${j(118,92)}${j(140,157)}${j(100,160)}
</svg>`,

'row-machine': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<rect x="14" y="78" width="12" height="82" rx="4" ${EF}/>
<rect x="14" y="103" width="48" height="13" rx="4" ${EF}/>
<path d="M 80,58 L 80,122 M 80,122 L 60,166 L 58,182 M 80,122 L 100,166 L 102,182" ${L}/>
<path d="M 60,76 L 40,112" ${L}/>
<path d="M 100,76 L 132,100 L 164,90" ${L}/>
<rect x="158" y="82" width="24" height="20" rx="4" ${EF}/>
${h(80,44)}
${j(60,76)}${j(100,76)}${j(40,112)}${j(132,100)}${j(60,166)}${j(100,166)}
</svg>`,

'face-pull': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<rect x="168" y="62" width="16" height="16" rx="4" ${EF}/>
<line x1="142" y1="74" x2="175" y2="70" stroke="#3A6070" stroke-width="3" stroke-dasharray="5 3"/>
<path d="M 70,82 L 70,148 M 70,148 L 52,184 M 70,148 L 88,184" ${L}/>
<path d="M 50,102 L 34,88" ${L}/>
<path d="M 90,102 L 110,78 L 144,72" ${L}/>
${h(70,64)}
${j(50,102)}${j(90,102)}${j(110,78)}${j(52,184,5)}${j(88,184,5)}
</svg>`,

'pullover': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${bench(72,112,56,34)}
<path d="M 100,102 L 100,156 M 100,156 L 80,182 M 100,156 L 120,182" ${L}/>
<path d="M 80,116 L 60,98 L 54,60" ${L}/>
<path d="M 120,116 L 140,98 L 146,60" ${L}/>
${db(100,50,0)}
${h(100,88)}
${j(80,116)}${j(120,116)}${j(60,98)}${j(140,98)}${j(80,182,5)}${j(120,182,5)}
</svg>`,

'curl': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<path d="M 76,60 L 100,48 L 124,60 M 100,48 L 100,110 M 100,110 L 84,152 L 80,182 M 100,110 L 116,152 L 120,182" ${L}/>
<path d="M 76,60 L 63,94 L 74,128" ${L}/>
<path d="M 124,60 L 137,94 L 126,128" ${L}/>
${db(86,132,0)}${db(114,132,0)}
${h(100,28)}
${j(76,60)}${j(124,60)}${j(63,94)}${j(137,94)}${j(84,152)}${j(116,152)}
</svg>`,

// ── LEGS ─────────────────────────────────────────────────────────────────────

'squat': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${bar(34,68,166,68)}${pl(28,68)}${pl(166,68)}
<path d="M 72,76 L 100,66 L 128,76 M 100,66 L 100,114 M 100,114 L 66,150 L 56,182 M 100,114 L 134,150 L 144,182" ${L}/>
<path d="M 72,76 L 50,78" ${L}/>
<path d="M 128,76 L 150,78" ${L}/>
${h(100,50)}
${j(72,76)}${j(128,76)}${j(66,150)}${j(134,150)}
</svg>`,

'bulgarian-squat': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${bench(128,128,50,30)}
<path d="M 70,52 L 70,106 M 70,106 L 48,154 L 46,180 M 70,106 L 100,130 L 144,138" ${L}/>
<path d="M 50,72 L 32,80" ${L}/>
<path d="M 90,72 L 110,78" ${L}/>
${h(70,36)}
${j(50,72)}${j(90,72)}${j(48,154)}${j(100,130)}
</svg>`,

'sumo-squat': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<path d="M 68,76 L 100,64 L 132,76 M 100,64 L 100,114 M 100,114 L 58,150 L 46,182 M 100,114 L 142,150 L 154,182" ${L}/>
<path d="M 68,76 L 46,78" ${L}/>
<path d="M 132,76 L 154,78" ${L}/>
${db(100,160,90)}
${h(100,44)}
${j(68,76)}${j(132,76)}${j(58,150)}${j(142,150)}
</svg>`,

'deadlift': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${bar(34,150,152,150)}${pl(28,150)}${pl(152,150)}
<path d="M 76,58 L 100,108 M 100,108 L 118,164 L 120,180 M 100,108 L 80,166 L 78,180" ${L}/>
<path d="M 58,74 L 48,130 L 44,150" ${L}/>
<path d="M 94,68 L 88,130 L 86,150" ${L}/>
${h(74,44)}
${j(58,74)}${j(94,68)}${j(48,130)}${j(118,164)}${j(80,166)}
</svg>`,

'leg-press': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<rect x="14" y="38" width="86" height="128" rx="6" ${EF}/>
<rect x="150" y="20" width="44" height="34" rx="5" ${EF}/>
<line x1="100" y1="92" x2="155" y2="44" stroke="#3A6070" stroke-width="4" stroke-dasharray="6 3"/>
<path d="M 54,104 L 54,140 M 54,140 L 100,96 L 154,45" ${L}/>
${h(54,90)}
${j(54,140)}${j(100,96)}
</svg>`,

'leg-curl': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${bench(22,86,152,36)}
<path d="M 154,80 L 56,80 M 56,80 L 42,110 L 38,132 M 56,80 L 72,110 L 72,132" ${L}/>
<path d="M 112,80 L 126,50 L 144,28" ${L}/>
<rect x="140" y="18" width="22" height="14" rx="4" ${EF}/>
${h(164,80)}
${j(112,80)}${j(126,50)}${j(42,110)}${j(72,110)}
</svg>`,

'calf-raise': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<rect x="42" y="178" width="116" height="9" rx="4" ${EF}/>
<path d="M 76,60 L 100,48 L 124,60 M 100,48 L 100,112 M 100,112 L 84,152 L 76,172 M 100,112 L 116,152 L 124,172" ${L}/>
<path d="M 76,60 L 60,72" ${L}/>
<path d="M 124,60 L 140,72" ${L}/>
${h(100,28)}
${j(76,60)}${j(124,60)}${j(84,152)}${j(116,152)}
</svg>`,

'quad-extension': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<rect x="16" y="88" width="14" height="82" rx="4" ${EF}/>
<rect x="30" y="88" width="50" height="13" rx="4" ${EF}/>
<path d="M 88,60 L 72,122 M 72,122 L 50,166 L 48,182 M 72,122 L 157,130 L 178,128" ${L}/>
<path d="M 66,76 L 46,76" ${L}/>
<path d="M 108,76 L 130,68" ${L}/>
<rect x="174" y="121" width="22" height="14" rx="4" ${EF}/>
${h(88,46)}
${j(66,76)}${j(108,76)}${j(72,122)}${j(50,166)}
</svg>`,

'hip-abduction': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<path d="M 76,60 L 100,48 L 124,60 M 100,48 L 100,110 M 100,110 L 80,160 L 78,182 M 100,110 L 144,144 L 158,170" ${L}/>
<path d="M 76,60 L 58,68" ${L}/>
<path d="M 124,60 L 142,68" ${L}/>
${h(100,28)}
${j(76,60)}${j(124,60)}${j(80,160)}${j(144,144)}
</svg>`,

'lunge': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<path d="M 88,48 L 94,106 M 94,106 L 56,156 L 53,182 M 94,106 L 128,150 L 146,140 L 156,166" ${L}/>
<path d="M 70,66 L 52,76" ${L}/>
<path d="M 110,66 L 130,76" ${L}/>
${db(48,80,90)}${db(132,80,90)}
<rect x="42" y="178" width="28" height="7" rx="3" ${EF}/>
${h(88,32)}
${j(70,66)}${j(110,66)}${j(56,156)}${j(128,150)}${j(146,140)}
</svg>`,

'hip-thrust': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${bench(18,116,58,40)}
<path d="M 52,100 L 98,100 L 127,122 L 152,167 L 156,182 M 127,122 L 108,160 L 106,182" ${L}/>
<path d="M 72,108 L 60,130" ${L}/>
<path d="M 96,98 L 112,88" ${L}/>
${bar(88,108,160,108)}${pl(82,108,7,16)}${pl(160,108,7,16)}
${h(50,88)}
${j(72,108)}${j(60,130)}${j(127,122)}${j(152,167)}${j(108,160)}
</svg>`,

'cable-kickback': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<rect x="10" y="140" width="16" height="36" rx="3" ${EF}/>
<line x1="26" y1="154" x2="36" y2="145" stroke="#3A6070" stroke-width="2" stroke-dasharray="4 3"/>
<path d="M 64,72 L 80,126 M 80,126 L 60,172 L 58,190 M 80,126 L 134,108 L 170,90" ${L}/>
<path d="M 46,90 L 34,114 L 28,145" ${L}/>
<path d="M 84,88 L 104,76" ${L}/>
${h(64,58)}
${j(46,90)}${j(84,88)}${j(34,114)}${j(80,126)}${j(134,108)}${j(60,172)}
</svg>`,

'plank-row': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<path d="M 157,90 L 50,110 M 50,110 L 34,147 L 32,164 M 50,110 L 58,150 L 58,164" ${L}/>
<path d="M 134,94 L 126,114 L 128,142" ${L}/>
<path d="M 177,94 L 163,70 L 150,48" ${L}/>
${kb(145,38)}
${h(163,90)}
${j(134,94)}${j(126,114)}${j(163,70)}${j(34,147)}${j(58,150)}
</svg>`,

// ── ABS ───────────────────────────────────────────────────────────────────────

'plank': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<line x1="20" y1="156" x2="180" y2="156" stroke="#1E3040" stroke-width="3"/>
<path d="M 160,102 L 38,122 M 38,122 L 22,152 L 22,160 M 160,102 L 174,152 L 174,160" ${L}/>
<path d="M 112,112 L 108,132 L 108,150" ${LS}/>
<path d="M 66,118 L 62,138 L 62,152" ${LS}/>
${h(164,94)}
${j(112,112)}${j(66,118)}
</svg>`,

'side-plank': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<line x1="20" y1="166" x2="180" y2="166" stroke="#1E3040" stroke-width="3"/>
<path d="M 38,157 L 142,106 L 178,157 M 90,132 L 90,56" ${L}/>
${h(150,94)}
${j(90,132)}${j(38,157)}${j(178,157)}
</svg>`,

'leg-raise': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<line x1="48" y1="148" x2="158" y2="148" stroke="#1E3040" stroke-width="3"/>
<path d="M 160,120 L 58,120 M 58,120 L 50,146 M 58,120 L 68,146" ${L}/>
<path d="M 100,120 L 88,58 L 78,26 M 100,120 L 112,58 L 122,26" ${L}/>
${h(160,108)}
${j(88,58)}${j(112,58)}${j(50,146)}${j(68,146)}
</svg>`,

'crunch': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<line x1="20" y1="170" x2="180" y2="170" stroke="#1E3040" stroke-width="3"/>
<path d="M 164,124 L 70,124 L 48,150 L 44,167 M 70,124 L 76,150 L 76,167" ${L}/>
<path d="M 100,124 L 100,88 L 100,64" ${L}/>
<path d="M 78,118 L 60,108" ${L}/>
<path d="M 120,118 L 138,108" ${L}/>
${h(164,112)}
${j(78,118)}${j(120,118)}${j(48,150)}${j(76,150)}
</svg>`,

'bicycle-crunch': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<line x1="20" y1="168" x2="180" y2="168" stroke="#1E3040" stroke-width="3"/>
<path d="M 157,110 L 68,110 L 50,150 L 48,167 M 68,110 L 83,152 L 86,167" ${L}/>
<path d="M 100,110 L 112,70 L 136,50" ${L}/>
<path d="M 76,104 L 56,88 L 136,50" ${L}/>
<path d="M 117,110 L 150,84 L 164,64" ${L}/>
${h(160,100)}
${j(112,70)}${j(50,150)}${j(86,167,5)}${j(150,84)}
</svg>`,

'russian-twist': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<path d="M 53,106 L 100,78 M 100,78 L 136,100 L 150,142 L 147,166 M 100,78 L 68,148 L 66,167" ${L}/>
<path d="M 100,78 L 80,53 L 58,43" ${L}/>
${db(48,39,45)}
${h(100,62)}
${j(80,53)}${j(150,142)}${j(68,148)}
</svg>`,

'mountain-climber': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<line x1="20" y1="156" x2="180" y2="156" stroke="#1E3040" stroke-width="3"/>
<path d="M 164,84 L 53,108 M 53,108 L 36,150 L 34,160 M 53,108 L 60,152 L 60,160" ${L}/>
<path d="M 116,96 L 90,114 L 80,142" ${L}/>
<path d="M 79,105 L 74,79 L 80,56" ${LS}/>
${h(167,76)}
${j(116,96)}${j(90,114)}${j(74,79)}${j(36,150)}
</svg>`,

'vup': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<path d="M 28,158 L 88,106 L 100,90 L 112,106 L 172,158" ${L}/>
<path d="M 80,114 L 60,88 L 44,66" ${LS}/>
<path d="M 120,114 L 140,88 L 156,66" ${LS}/>
${h(100,78)}
${j(88,106)}${j(112,106)}${j(60,88)}${j(140,88)}
</svg>`,

'dead-bug': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<line x1="20" y1="166" x2="180" y2="166" stroke="#1E3040" stroke-width="3"/>
<path d="M 157,96 L 54,96 M 54,96 L 42,132 L 40,163 M 54,96 L 66,132 L 66,163" ${L}/>
<path d="M 88,96 L 90,50 L 92,28" ${L}/>
<path d="M 120,96 L 146,70 L 167,48" ${L}/>
${h(160,88)}
${j(88,96)}${j(120,96)}${j(90,50)}${j(146,70)}${j(42,132)}${j(66,132)}
</svg>`,

'hollow-hold': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<path d="M 167,122 L 100,95 L 33,122" ${L}/>
<path d="M 66,112 L 52,74 L 46,50" ${LS}/>
<path d="M 134,112 L 148,74 L 154,50" ${LS}/>
${h(100,80)}
${j(52,74)}${j(148,74)}${j(66,112)}${j(134,112)}
</svg>`,

'ab-wheel': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<ellipse cx="142" cy="140" rx="26" ry="16" ${EF}/>
<line x1="116" y1="140" x2="168" y2="140" stroke="#3A6070" stroke-width="5"/>
<path d="M 157,80 L 78,114 M 78,114 L 60,150 L 58,164 M 78,114 L 88,154 L 88,166" ${L}/>
<path d="M 134,88 L 142,112 L 142,137" ${L}/>
${h(160,72)}
${j(134,88)}${j(142,112)}${j(60,150)}${j(88,154)}
</svg>`,

// ── KETTLEBELL EXERCISES ──────────────────────────────────────────────────────

'kb-swing': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<path d="M 78,55 L 106,108 M 106,108 L 90,157 L 88,180 M 106,108 L 126,157 L 130,180" ${L}/>
<path d="M 60,72 L 48,120 L 48,142" ${L}/>
<path d="M 96,68 L 118,90 L 150,80" ${L}/>
${kb(158,68)}
${h(78,40)}
${j(60,72)}${j(96,68)}${j(118,90)}${j(90,157)}${j(126,157)}
</svg>`,

'kb-goblet': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
<path d="M 66,76 L 100,64 L 134,76 M 100,64 L 100,116 M 100,116 L 60,152 L 48,182 M 100,116 L 140,152 L 152,182" ${L}/>
<path d="M 66,76 L 54,98 L 74,117" ${L}/>
<path d="M 134,76 L 146,98 L 126,117" ${L}/>
${kb(100,98)}
${h(100,46)}
${j(66,76)}${j(134,76)}${j(54,98)}${j(146,98)}${j(60,152)}${j(140,152)}
</svg>`,

'kb-row': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${bench(18,112,56,40)}
<path d="M 50,56 L 90,92 L 106,156 L 110,178 M 90,92 L 70,160 L 68,178" ${L}/>
<path d="M 70,72 L 52,92 L 42,112" ${L}/>
<path d="M 88,80 L 112,58 L 140,58" ${L}/>
${kb(142,47)}
${h(48,44)}
${j(70,72)}${j(52,92)}${j(112,58)}${j(90,92)}${j(106,156)}${j(70,160)}
</svg>`,

'kb-deadlift': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${kb(58,148)}${kb(140,148)}
<path d="M 76,58 L 100,114 M 100,114 L 118,167 L 120,182 M 100,114 L 80,169 L 78,182" ${L}/>
<path d="M 58,74 L 60,126 L 58,148" ${L}/>
<path d="M 94,68 L 104,126 L 140,148" ${L}/>
${h(74,44)}
${j(58,74)}${j(94,68)}${j(118,167)}${j(80,169)}
</svg>`,

'kb-press': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${kb(128,16)}
<path d="M 76,60 L 100,48 L 124,60 M 100,48 L 100,110 M 100,110 L 84,152 L 80,182 M 100,110 L 116,152 L 120,182" ${L}/>
<path d="M 76,60 L 68,38" ${L}/>
<path d="M 124,60 L 133,36 L 134,25" ${L}/>
${h(100,28)}
${j(76,60)}${j(124,60)}${j(68,38)}${j(133,36)}${j(84,152)}${j(116,152)}
</svg>`,

'kb-clean-press': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${kb(142,55)}
<path d="M 76,62 L 100,50 L 124,62 M 100,50 L 100,112 M 100,112 L 84,154 L 80,182 M 100,112 L 116,154 L 120,182" ${L}/>
<path d="M 76,62 L 64,84" ${L}/>
<path d="M 124,62 L 133,70 L 140,60" ${L}/>
${h(100,30)}
${j(76,62)}${j(124,62)}${j(64,84)}${j(133,70)}${j(84,154)}${j(116,154)}
</svg>`,

'kb-lunge': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${kb(48,150)}${kb(150,150)}
<path d="M 88,48 L 95,107 M 95,107 L 56,158 L 53,182 M 95,107 L 130,150 L 148,142 L 158,167" ${L}/>
<path d="M 70,66 L 48,142" ${L}/>
<path d="M 112,66 L 150,142" ${L}/>
${h(88,32)}
${j(70,66)}${j(112,66)}${j(56,158)}${j(130,150)}
</svg>`,

'kb-high-pull': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${kb(100,84)}
<path d="M 76,60 L 100,48 L 124,60 M 100,48 L 100,110 M 100,110 L 84,152 L 80,182 M 100,110 L 116,152 L 120,182" ${L}/>
<path d="M 76,60 L 55,74 L 63,87" ${L}/>
<path d="M 124,60 L 145,74 L 137,87" ${L}/>
${h(100,28)}
${j(76,60)}${j(124,60)}${j(55,74)}${j(145,74)}${j(84,152)}${j(116,152)}
</svg>`,

'kb-renegade': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${kb(42,145)}
<path d="M 157,90 L 50,110 M 50,110 L 34,148 M 50,110 L 60,150 L 60,164" ${L}/>
<path d="M 134,94 L 126,114 L 42,145" ${L}/>
<path d="M 177,94 L 163,70 L 148,47" ${L}/>
${kb(142,37)}
${h(163,90)}
${j(134,94)}${j(126,114)}${j(163,70)}${j(34,148)}
</svg>`,

'kb-sumo': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${kb(100,170)}
<path d="M 66,76 L 100,64 L 134,76 M 100,64 L 100,116 M 100,116 L 58,152 L 46,182 M 100,116 L 142,152 L 154,182" ${L}/>
<path d="M 66,76 L 46,80" ${L}/>
<path d="M 134,76 L 154,80" ${L}/>
<path d="M 72,120 L 100,167" ${L}/>
<path d="M 128,120 L 100,167" ${L}/>
${h(100,46)}
${j(66,76)}${j(134,76)}${j(58,152)}${j(142,152)}
</svg>`,

'kb-single-leg-rdl': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${kb(150,130)}
<path d="M 76,52 L 100,102 M 100,102 L 87,167 L 85,182 M 100,102 L 142,92 L 167,82" ${L}/>
<path d="M 58,68 L 53,122 L 58,130 L 150,130" ${L}/>
<path d="M 92,64 L 104,92" ${L}/>
${h(76,38)}
${j(58,68)}${j(92,64)}${j(53,122)}${j(142,92)}${j(87,167)}
</svg>`,

'kb-farmer-carry': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${kb(43,155)}${kb(157,155)}
<path d="M 76,58 L 100,48 L 124,58 M 100,48 L 100,110 M 100,110 L 80,150 L 76,182 M 100,110 L 120,150 L 124,182" ${L}/>
<path d="M 76,58 L 60,110 L 43,152" ${L}/>
<path d="M 124,58 L 140,110 L 157,152" ${L}/>
${h(100,28)}
${j(76,58)}${j(124,58)}${j(60,110)}${j(140,110)}${j(80,150)}${j(120,150)}
</svg>`,

'kb-snatch': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
${DF}
${kb(136,16)}
<path d="M 76,60 L 100,50 L 124,60 M 100,50 L 100,112 M 100,112 L 84,154 L 80,182 M 100,112 L 116,154 L 120,182" ${L}/>
<path d="M 76,60 L 66,80" ${L}/>
<path d="M 124,60 L 132,40 L 138,24" ${L}/>
${h(100,30)}
${j(76,60)}${j(124,60)}${j(66,80)}${j(132,40)}${j(84,154)}${j(116,154)}
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
