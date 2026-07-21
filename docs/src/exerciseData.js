// Exercise database — inline SVG illustrations + descriptions + muscles
// SVG slugs are shared across similar exercises

const B = 'fill="none" stroke="#E5E5EA" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"';
const E = 'fill="#636366"';
const ES = 'stroke="#636366" stroke-width="3" stroke-linecap="round" fill="none"';
const EP = 'stroke="#636366" stroke-width="4" stroke-linecap="round"';

const SVG = {

'bench-press': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<rect x="25" y="126" width="132" height="9" rx="3" fill="#2C2C2E" stroke="#636366" stroke-width="1.5"/>
<line x1="46" y1="135" x2="46" y2="162" ${ES}/>
<line x1="138" y1="135" x2="138" y2="162" ${ES}/>
<g ${B}>
<circle cx="158" cy="113" r="11"/>
<line x1="147" y1="113" x2="62" y2="113"/>
<line x1="62" y1="113" x2="48" y2="138"/>
<line x1="48" y1="138" x2="46" y2="156"/>
<line x1="62" y1="113" x2="68" y2="140"/>
<line x1="68" y1="140" x2="68" y2="158"/>
<line x1="116" y1="113" x2="104" y2="74"/>
<line x1="100" y1="113" x2="88" y2="74"/>
</g>
<line x1="65" y1="72" x2="127" y2="72" ${EP}/>
<rect x="59" y="65" width="6" height="14" rx="2" ${E}/>
<rect x="127" y="65" width="6" height="14" rx="2" ${E}/>
</svg>`,

'military-press': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<g ${B}>
<circle cx="100" cy="42" r="11"/>
<line x1="100" y1="53" x2="100" y2="112"/>
<line x1="100" y1="112" x2="82" y2="160"/>
<line x1="82" y1="160" x2="80" y2="180"/>
<line x1="100" y1="112" x2="118" y2="160"/>
<line x1="118" y1="160" x2="120" y2="180"/>
<line x1="78" y1="70" x2="68" y2="44"/>
<line x1="68" y1="44" x2="70" y2="18"/>
<line x1="122" y1="70" x2="132" y2="44"/>
<line x1="132" y1="44" x2="130" y2="18"/>
</g>
<line x1="52" y1="16" x2="148" y2="16" ${EP}/>
<rect x="45" y="9" width="7" height="14" rx="2" ${E}/>
<rect x="148" y="9" width="7" height="14" rx="2" ${E}/>
</svg>`,

'lateral-raise': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<g ${B}>
<circle cx="100" cy="42" r="11"/>
<line x1="100" y1="53" x2="100" y2="112"/>
<line x1="100" y1="112" x2="82" y2="160"/>
<line x1="82" y1="160" x2="80" y2="180"/>
<line x1="100" y1="112" x2="118" y2="160"/>
<line x1="118" y1="160" x2="120" y2="180"/>
<line x1="78" y1="68" x2="30" y2="85"/>
<line x1="122" y1="68" x2="170" y2="85"/>
</g>
<rect x="16" y="82" width="14" height="9" rx="3" ${E}/>
<rect x="170" y="82" width="14" height="9" rx="3" ${E}/>
</svg>`,

'tricep-extension': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<g ${B}>
<circle cx="100" cy="42" r="11"/>
<line x1="100" y1="53" x2="100" y2="112"/>
<line x1="100" y1="112" x2="82" y2="160"/>
<line x1="82" y1="160" x2="80" y2="180"/>
<line x1="100" y1="112" x2="118" y2="160"/>
<line x1="118" y1="160" x2="120" y2="180"/>
<line x1="78" y1="70" x2="68" y2="52"/>
<line x1="68" y1="52" x2="88" y2="35"/>
<line x1="122" y1="70" x2="130" y2="52"/>
<line x1="130" y1="52" x2="114" y2="35"/>
</g>
<rect x="87" y="25" width="26" height="10" rx="3" ${E}/>
<line x1="100" y1="35" x2="100" y2="22" stroke="#636366" stroke-width="3" stroke-linecap="round"/>
</svg>`,

'chest-fly': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<g ${B}>
<circle cx="100" cy="42" r="11"/>
<line x1="100" y1="53" x2="100" y2="112"/>
<line x1="100" y1="112" x2="82" y2="160"/>
<line x1="82" y1="160" x2="80" y2="180"/>
<line x1="100" y1="112" x2="118" y2="160"/>
<line x1="118" y1="160" x2="120" y2="180"/>
<line x1="78" y1="68" x2="44" y2="55"/>
<line x1="44" y1="55" x2="100" y2="90"/>
<line x1="122" y1="68" x2="156" y2="55"/>
<line x1="156" y1="55" x2="100" y2="90"/>
</g>
<circle cx="36" cy="52" r="6" ${E}/>
<circle cx="164" cy="52" r="6" ${E}/>
<path d="M 44 55 Q 70 45 100 90 Q 130 45 156 55" stroke="#636366" stroke-width="1.5" fill="none" stroke-dasharray="4 3"/>
</svg>`,

'pullup': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<line x1="40" y1="22" x2="160" y2="22" ${EP}/>
<rect x="35" y="16" width="8" height="12" rx="2" ${E}/>
<rect x="157" y="16" width="8" height="12" rx="2" ${E}/>
<g ${B}>
<circle cx="100" cy="80" r="11"/>
<line x1="100" y1="91" x2="100" y2="140"/>
<line x1="100" y1="140" x2="84" y2="178"/>
<line x1="100" y1="140" x2="116" y2="178"/>
<line x1="78" y1="98" x2="68" y2="38"/>
<line x1="68" y1="38" x2="72" y2="25"/>
<line x1="122" y1="98" x2="132" y2="38"/>
<line x1="132" y1="38" x2="128" y2="25"/>
</g>
</svg>`,

'row-bent': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<g ${B}>
<circle cx="58" cy="60" r="11"/>
<line x1="68" y1="60" x2="130" y2="88"/>
<line x1="130" y1="88" x2="148" y2="155"/>
<line x1="148" y1="155" x2="150" y2="175"/>
<line x1="114" y1="76" x2="100" y2="155"/>
<line x1="100" y1="155" x2="98" y2="175"/>
<line x1="96" y1="70" x2="78" y2="98"/>
<line x1="78" y1="98" x2="68" y2="132"/>
<line x1="114" y1="76" x2="132" y2="52"/>
<line x1="132" y1="52" x2="130" y2="32"/>
</g>
<line x1="64" y1="130" x2="120" y2="130" ${EP}/>
<rect x="57" y="122" width="7" height="16" rx="2" ${E}/>
<rect x="120" y="122" width="7" height="16" rx="2" ${E}/>
</svg>`,

'row-machine': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<rect x="18" y="82" width="8" height="70" rx="3" fill="#2C2C2E" stroke="#636366" stroke-width="1.5"/>
<rect x="18" y="105" width="40" height="12" rx="3" fill="#2C2C2E" stroke="#636366" stroke-width="1.5"/>
<g ${B}>
<circle cx="80" cy="58" r="11"/>
<line x1="80" y1="69" x2="80" y2="118"/>
<line x1="80" y1="118" x2="62" y2="165"/>
<line x1="62" y1="165" x2="60" y2="182"/>
<line x1="80" y1="118" x2="98" y2="165"/>
<line x1="98" y1="165" x2="100" y2="182"/>
<line x1="60" y1="78" x2="40" y2="108"/>
<line x1="100" y1="78" x2="130" y2="100"/>
<line x1="130" y1="100" x2="160" y2="88"/>
</g>
<line x1="155" y1="82" x2="168" y2="82" ${EP}/>
<rect x="162" y="74" width="18" height="16" rx="3" ${E}/>
</svg>`,

'face-pull': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<rect x="170" y="68" width="10" height="10" rx="2" ${E}/>
<g ${B}>
<circle cx="72" cy="78" r="11"/>
<line x1="72" y1="89" x2="72" y2="145"/>
<line x1="72" y1="145" x2="55" y2="185"/>
<line x1="72" y1="145" x2="89" y2="185"/>
<line x1="53" y1="100" x2="40" y2="88"/>
<line x1="91" y1="100" x2="108" y2="78"/>
<line x1="108" y1="78" x2="140" y2="72"/>
<line x1="40" y1="88" x2="108" y2="78"/>
</g>
<line x1="140" y1="73" x2="172" y2="73" stroke="#636366" stroke-width="2" stroke-dasharray="5 3"/>
</svg>`,

'pullover': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<rect x="75" y="110" width="50" height="10" rx="3" fill="#2C2C2E" stroke="#636366" stroke-width="1.5"/>
<line x1="82" y1="120" x2="82" y2="148" ${ES}/>
<line x1="118" y1="120" x2="118" y2="148" ${ES}/>
<g ${B}>
<circle cx="100" cy="100" r="11"/>
<line x1="100" y1="111" x2="100" y2="155"/>
<line x1="100" y1="155" x2="80" y2="180"/>
<line x1="100" y1="155" x2="120" y2="180"/>
<line x1="80" y1="115" x2="62" y2="95"/>
<line x1="62" y1="95" x2="56" y2="60"/>
<line x1="120" y1="115" x2="138" y2="95"/>
<line x1="138" y1="95" x2="144" y2="60"/>
</g>
<rect x="52" y="50" width="18" height="11" rx="3" ${E}/>
<rect x="130" y="50" width="18" height="11" rx="3" ${E}/>
</svg>`,

'curl': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<g ${B}>
<circle cx="100" cy="42" r="11"/>
<line x1="100" y1="53" x2="100" y2="112"/>
<line x1="100" y1="112" x2="82" y2="160"/>
<line x1="82" y1="160" x2="80" y2="180"/>
<line x1="100" y1="112" x2="118" y2="160"/>
<line x1="118" y1="160" x2="120" y2="180"/>
<line x1="78" y1="68" x2="64" y2="95"/>
<line x1="64" y1="95" x2="75" y2="128"/>
<line x1="122" y1="68" x2="136" y2="95"/>
<line x1="136" y1="95" x2="125" y2="128"/>
</g>
<rect x="62" y="124" width="26" height="10" rx="3" ${E}/>
<rect x="115" y="124" width="26" height="10" rx="3" ${E}/>
</svg>`,

'squat': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<g ${B}>
<circle cx="100" cy="60" r="11"/>
<line x1="100" y1="71" x2="100" y2="115"/>
<line x1="100" y1="115" x2="72" y2="148"/>
<line x1="72" y1="148" x2="60" y2="182"/>
<line x1="100" y1="115" x2="128" y2="148"/>
<line x1="128" y1="148" x2="140" y2="182"/>
<line x1="70" y1="80" x2="50" y2="75"/>
<line x1="130" y1="80" x2="150" y2="75"/>
</g>
<line x1="40" y1="73" x2="160" y2="73" ${EP}/>
<rect x="32" y="65" width="8" height="16" rx="2" ${E}/>
<rect x="160" y="65" width="8" height="16" rx="2" ${E}/>
</svg>`,

'bulgarian-squat': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<rect x="130" y="128" width="45" height="9" rx="3" fill="#2C2C2E" stroke="#636366" stroke-width="1.5"/>
<line x1="140" y1="137" x2="140" y2="162" ${ES}/>
<line x1="168" y1="137" x2="168" y2="162" ${ES}/>
<g ${B}>
<circle cx="75" cy="55" r="11"/>
<line x1="75" y1="66" x2="75" y2="105"/>
<line x1="75" y1="105" x2="55" y2="152"/>
<line x1="55" y1="152" x2="52" y2="178"/>
<line x1="75" y1="105" x2="100" y2="128"/>
<line x1="100" y1="128" x2="140" y2="135"/>
<line x1="55" y1="75" x2="35" y2="80"/>
<line x1="95" y1="75" x2="115" y2="80"/>
</g>
</svg>`,

'sumo-squat': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<g ${B}>
<circle cx="100" cy="55" r="11"/>
<line x1="100" y1="66" x2="100" y2="108"/>
<line x1="100" y1="108" x2="64" y2="140"/>
<line x1="64" y1="140" x2="48" y2="182"/>
<line x1="100" y1="108" x2="136" y2="140"/>
<line x1="136" y1="140" x2="152" y2="182"/>
<line x1="72" y1="78" x2="58" y2="75"/>
<line x1="128" y1="78" x2="142" y2="75"/>
<line x1="100" y1="90" x2="100" y2="155"/>
</g>
<rect x="80" y="152" width="40" height="14" rx="5" ${E}/>
</svg>`,

'deadlift': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<g ${B}>
<circle cx="80" cy="55" r="11"/>
<line x1="80" y1="66" x2="100" y2="115"/>
<line x1="100" y1="115" x2="118" y2="165"/>
<line x1="118" y1="165" x2="120" y2="182"/>
<line x1="100" y1="115" x2="84" y2="168"/>
<line x1="84" y1="168" x2="82" y2="182"/>
<line x1="62" y1="72" x2="50" y2="130"/>
<line x1="98" y1="72" x2="90" y2="130"/>
</g>
<line x1="40" y1="150" x2="140" y2="150" ${EP}/>
<rect x="30" y="142" width="10" height="18" rx="3" ${E}/>
<rect x="140" y="142" width="10" height="18" rx="3" ${E}/>
</svg>`,

'leg-press': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<rect x="22" y="40" width="80" height="120" rx="5" fill="#2C2C2E" stroke="#636366" stroke-width="1.5"/>
<line x1="102" y1="90" x2="178" y2="45" stroke="#636366" stroke-width="2" stroke-dasharray="5 3"/>
<rect x="155" y="28" width="40" height="30" rx="4" fill="#2C2C2E" stroke="#636366" stroke-width="1.5"/>
<g ${B}>
<circle cx="56" cy="100" r="10"/>
<line x1="56" y1="110" x2="56" y2="140"/>
<line x1="56" y1="140" x2="100" y2="95"/>
<line x1="100" y1="95" x2="155" y2="45"/>
<line x1="30" y1="110" x2="56" y2="140"/>
</g>
</svg>`,

'leg-curl': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<rect x="25" y="88" width="140" height="10" rx="3" fill="#2C2C2E" stroke="#636366" stroke-width="1.5"/>
<line x1="42" y1="98" x2="42" y2="125" ${ES}/>
<line x1="148" y1="98" x2="148" y2="125" ${ES}/>
<g ${B}>
<circle cx="155" cy="80" r="10"/>
<line x1="145" y1="80" x2="60" y2="80"/>
<line x1="60" y1="80" x2="45" y2="105"/>
<line x1="45" y1="105" x2="42" y2="125"/>
<line x1="60" y1="80" x2="75" y2="105"/>
<line x1="75" y1="105" x2="75" y2="125"/>
<line x1="112" y1="80" x2="125" y2="48"/>
<line x1="125" y1="48" x2="140" y2="30"/>
</g>
<rect x="140" y="22" width="16" height="10" rx="3" ${E}/>
</svg>`,

'calf-raise': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<line x1="50" y1="190" x2="150" y2="190" stroke="#636366" stroke-width="2"/>
<g ${B}>
<circle cx="100" cy="40" r="11"/>
<line x1="100" y1="51" x2="100" y2="110"/>
<line x1="100" y1="110" x2="82" y2="152"/>
<line x1="82" y1="152" x2="76" y2="175"/>
<line x1="76" y1="175" x2="85" y2="178"/>
<line x1="100" y1="110" x2="118" y2="152"/>
<line x1="118" y1="152" x2="124" y2="175"/>
<line x1="124" y1="175" x2="115" y2="178"/>
<line x1="78" y1="68" x2="62" y2="78"/>
<line x1="122" y1="68" x2="138" y2="78"/>
</g>
</svg>`,

'quad-extension': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<rect x="25" y="90" width="10" height="80" rx="3" fill="#2C2C2E" stroke="#636366" stroke-width="1.5"/>
<rect x="35" y="90" width="50" height="10" rx="3" fill="#2C2C2E" stroke="#636366" stroke-width="1.5"/>
<g ${B}>
<circle cx="88" cy="65" r="11"/>
<line x1="88" y1="76" x2="72" y2="125"/>
<line x1="72" y1="125" x2="55" y2="165"/>
<line x1="55" y1="165" x2="52" y2="182"/>
<line x1="72" y1="125" x2="155" y2="130"/>
<line x1="155" y1="130" x2="175" y2="128"/>
<line x1="68" y1="82" x2="50" y2="78"/>
<line x1="108" y1="82" x2="128" y2="72"/>
</g>
<rect x="170" y="123" width="18" height="12" rx="3" ${E}/>
</svg>`,

'hip-abduction': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<g ${B}>
<circle cx="100" cy="42" r="11"/>
<line x1="100" y1="53" x2="100" y2="110"/>
<line x1="100" y1="110" x2="82" y2="158"/>
<line x1="82" y1="158" x2="80" y2="180"/>
<line x1="100" y1="110" x2="140" y2="145"/>
<line x1="140" y1="145" x2="155" y2="168"/>
<line x1="78" y1="68" x2="58" y2="74"/>
<line x1="122" y1="68" x2="142" y2="74"/>
</g>
<line x1="100" y1="110" x2="145" y2="82" stroke="#E5E5EA" stroke-width="1.5" stroke-dasharray="5 4"/>
</svg>`,

'lunge': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<g ${B}>
<circle cx="92" cy="48" r="11"/>
<line x1="92" y1="59" x2="100" y2="112"/>
<line x1="100" y1="112" x2="62" y2="155"/>
<line x1="62" y1="155" x2="58" y2="182"/>
<line x1="100" y1="112" x2="130" y2="148"/>
<line x1="130" y1="148" x2="148" y2="138"/>
<line x1="148" y1="138" x2="158" y2="165"/>
<line x1="72" y1="68" x2="52" y2="78"/>
<line x1="112" y1="68" x2="132" y2="78"/>
</g>
<rect x="48" y="178" width="26" height="6" rx="2" ${E}/>
</svg>`,

'hip-thrust': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<rect x="22" y="118" width="55" height="12" rx="4" fill="#2C2C2E" stroke="#636366" stroke-width="1.5"/>
<line x1="30" y1="130" x2="30" y2="165" ${ES}/>
<line x1="68" y1="130" x2="68" y2="165" ${ES}/>
<g ${B}>
<circle cx="55" cy="102" r="11"/>
<line x1="66" y1="102" x2="100" y2="102"/>
<line x1="100" y1="102" x2="125" y2="122"/>
<line x1="125" y1="122" x2="148" y2="165"/>
<line x1="148" y1="165" x2="152" y2="182"/>
<line x1="125" y1="122" x2="108" y2="155"/>
<line x1="108" y1="155" x2="105" y2="182"/>
<line x1="78" y1="110" x2="65" y2="130"/>
<line x1="100" y1="102" x2="118" y2="90"/>
</g>
<line x1="88" y1="110" x2="148" y2="110" ${EP}/>
<rect x="80" y="103" width="8" height="14" rx="2" ${E}/>
<rect x="148" y="103" width="8" height="14" rx="2" ${E}/>
</svg>`,

'cable-kickback': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<rect x="15" y="145" width="10" height="30" rx="2" fill="#2C2C2E" stroke="#636366" stroke-width="1.5"/>
<g ${B}>
<circle cx="68" cy="75" r="11"/>
<line x1="68" y1="86" x2="82" y2="128"/>
<line x1="82" y1="128" x2="65" y2="175"/>
<line x1="65" y1="175" x2="62" y2="190"/>
<line x1="82" y1="128" x2="130" y2="108"/>
<line x1="130" y1="108" x2="165" y2="90"/>
<line x1="50" y1="92" x2="35" y2="115"/>
<line x1="35" y1="115" x2="30" y2="148"/>
<line x1="86" y1="92" x2="105" y2="78"/>
</g>
<line x1="30" y1="148" x2="22" y2="158" stroke="#636366" stroke-width="2" stroke-dasharray="4 3"/>
</svg>`,

'plank-row': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<g ${B}>
<circle cx="155" cy="88" r="10"/>
<line x1="145" y1="88" x2="55" y2="108"/>
<line x1="55" y1="108" x2="38" y2="145"/>
<line x1="38" y1="145" x2="35" y2="162"/>
<line x1="55" y1="108" x2="62" y2="148"/>
<line x1="62" y1="148" x2="62" y2="162"/>
<line x1="135" y1="92" x2="128" y2="108"/>
<line x1="128" y1="108" x2="130" y2="135"/>
<line x1="175" y1="92" x2="165" y2="72"/>
<line x1="165" y1="72" x2="155" y2="55"/>
</g>
<rect x="148" y="46" width="18" height="10" rx="3" ${E}/>
</svg>`,

'plank': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<line x1="28" y1="155" x2="172" y2="155" stroke="#636366" stroke-width="2"/>
<g ${B}>
<circle cx="162" cy="100" r="10"/>
<line x1="152" y1="100" x2="38" y2="118"/>
<line x1="38" y1="118" x2="28" y2="148"/>
<line x1="28" y1="148" x2="28" y2="158"/>
<line x1="152" y1="100" x2="170" y2="148"/>
<line x1="170" y1="148" x2="172" y2="158"/>
<line x1="120" y1="107" x2="110" y2="125"/>
<line x1="110" y1="125" x2="110" y2="145"/>
<line x1="70" y1="114" x2="60" y2="132"/>
<line x1="60" y1="132" x2="60" y2="148"/>
</g>
</svg>`,

'side-plank': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<line x1="28" y1="170" x2="172" y2="170" stroke="#636366" stroke-width="2"/>
<g ${B}>
<circle cx="148" cy="85" r="10"/>
<line x1="148" y1="95" x2="40" y2="148"/>
<line x1="40" y1="148" x2="28" y2="165"/>
<line x1="40" y1="148" x2="172" y2="162"/>
<line x1="172" y1="162" x2="172" y2="170"/>
<line x1="104" y1="120" x2="104" y2="60"/>
<line x1="104" y1="60" x2="88" y2="42"/>
</g>
</svg>`,

'leg-raise': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<line x1="22" y1="140" x2="178" y2="140" stroke="#636366" stroke-width="2"/>
<g ${B}>
<circle cx="155" cy="130" r="10"/>
<line x1="145" y1="130" x2="55" y2="130"/>
<line x1="55" y1="130" x2="40" y2="145"/>
<line x1="55" y1="130" x2="62" y2="148"/>
<line x1="122" y1="130" x2="108" y2="85"/>
<line x1="108" y1="85" x2="100" y2="45"/>
<line x1="100" y1="130" x2="86" y2="80"/>
<line x1="86" y1="80" x2="82" y2="42"/>
<line x1="135" y1="130" x2="128" y2="112"/>
</g>
</svg>`,

'crunch': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<line x1="22" y1="162" x2="178" y2="162" stroke="#636366" stroke-width="2"/>
<g ${B}>
<circle cx="55" cy="108" r="10"/>
<line x1="65" y1="108" x2="125" y2="128"/>
<line x1="125" y1="128" x2="148" y2="160"/>
<line x1="148" y1="160" x2="152" y2="162"/>
<line x1="148" y1="160" x2="135" y2="162"/>
<line x1="125" y1="128" x2="105" y2="162"/>
<line x1="105" y1="162" x2="90" y2="162"/>
<line x1="42" y1="118" x2="30" y2="130"/>
<line x1="68" y1="118" x2="88" y2="108"/>
</g>
</svg>`,

'bicycle-crunch': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<line x1="22" y1="165" x2="178" y2="165" stroke="#636366" stroke-width="2"/>
<g ${B}>
<circle cx="62" cy="102" r="10"/>
<line x1="72" y1="102" x2="128" y2="120"/>
<line x1="128" y1="120" x2="148" y2="158"/>
<line x1="148" y1="158" x2="152" y2="164"/>
<line x1="128" y1="120" x2="100" y2="100"/>
<line x1="100" y1="100" x2="72" y2="85"/>
<line x1="72" y1="85" x2="48" y2="65"/>
<line x1="128" y1="120" x2="108" y2="164"/>
<line x1="48" y1="118" x2="38" y2="128"/>
<line x1="76" y1="112" x2="90" y2="102"/>
</g>
</svg>`,

'russian-twist': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<g ${B}>
<circle cx="100" cy="75" r="11"/>
<line x1="100" y1="86" x2="95" y2="135"/>
<line x1="95" y1="135" x2="68" y2="170"/>
<line x1="68" y1="170" x2="65" y2="182"/>
<line x1="95" y1="135" x2="130" y2="162"/>
<line x1="130" y1="162" x2="135" y2="178"/>
<line x1="82" y1="98" x2="58" y2="88"/>
<line x1="118" y1="98" x2="152" y2="78"/>
<line x1="152" y1="78" x2="158" y2="68"/>
</g>
<rect x="152" y="60" width="16" height="10" rx="3" ${E}/>
</svg>`,

'mountain-climber': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<line x1="22" y1="162" x2="178" y2="162" stroke="#636366" stroke-width="2"/>
<g ${B}>
<circle cx="158" cy="85" r="10"/>
<line x1="148" y1="85" x2="42" y2="115"/>
<line x1="42" y1="115" x2="28" y2="155"/>
<line x1="28" y1="155" x2="25" y2="162"/>
<line x1="42" y1="115" x2="48" y2="158"/>
<line x1="48" y1="158" x2="48" y2="162"/>
<line x1="120" y1="95" x2="115" y2="112"/>
<line x1="115" y1="112" x2="115" y2="135"/>
<line x1="75" y1="107" x2="90" y2="122"/>
<line x1="90" y1="122" x2="88" y2="140"/>
<line x1="168" y1="89" x2="175" y2="155"/>
<line x1="175" y1="155" x2="175" y2="162"/>
</g>
</svg>`,

'vup': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<g ${B}>
<circle cx="100" cy="80" r="11"/>
<line x1="100" y1="91" x2="95" y2="120"/>
<line x1="95" y1="120" x2="72" y2="148"/>
<line x1="72" y1="148" x2="52" y2="175"/>
<line x1="95" y1="120" x2="130" y2="148"/>
<line x1="130" y1="148" x2="148" y2="175"/>
<line x1="82" y1="100" x2="52" y2="75"/>
<line x1="118" y1="100" x2="148" y2="75"/>
<line x1="52" y1="75" x2="52" y2="175"/>
<line x1="148" y1="75" x2="148" y2="175"/>
</g>
</svg>`,

'dead-bug': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<line x1="22" y1="115" x2="178" y2="115" stroke="#636366" stroke-width="2"/>
<g ${B}>
<circle cx="100" cy="105" r="10"/>
<line x1="100" y1="115" x2="100" y2="148"/>
<line x1="100" y1="148" x2="78" y2="178"/>
<line x1="100" y1="148" x2="122" y2="178"/>
<line x1="80" y1="118" x2="55" y2="100"/>
<line x1="55" y1="100" x2="30" y2="65"/>
<line x1="120" y1="118" x2="145" y2="132"/>
<line x1="145" y1="132" x2="170" y2="155"/>
<line x1="80" y1="118" x2="68" y2="145"/>
<line x1="120" y1="118" x2="108" y2="78"/>
</g>
</svg>`,

'hollow-hold': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<g ${B}>
<circle cx="100" cy="100" r="11"/>
<path d="M 55 75 Q 100 115 145 75" stroke="#E5E5EA" stroke-width="2.5" fill="none"/>
<line x1="100" y1="111" x2="98" y2="140"/>
<line x1="98" y1="140" x2="72" y2="168"/>
<line x1="72" y1="168" x2="55" y2="178"/>
<line x1="98" y1="140" x2="125" y2="162"/>
<line x1="125" y1="162" x2="148" y2="170"/>
<line x1="82" y1="105" x2="58" y2="88"/>
<line x1="58" y1="88" x2="30" y2="72"/>
<line x1="118" y1="105" x2="142" y2="88"/>
<line x1="142" y1="88" x2="170" y2="72"/>
</g>
</svg>`,

'ab-wheel': `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
<rect width="200" height="200" fill="#1C1C1E"/>
<circle cx="150" cy="152" r="20" ${ES}/>
<line x1="130" y1="152" x2="70" y2="152" stroke="#636366" stroke-width="3" stroke-linecap="round"/>
<g ${B}>
<circle cx="58" cy="90" r="11"/>
<line x1="58" y1="101" x2="62" y2="148"/>
<line x1="62" y1="148" x2="48" y2="165"/>
<line x1="48" y1="165" x2="44" y2="178"/>
<line x1="62" y1="148" x2="78" y2="165"/>
<line x1="78" y1="165" x2="82" y2="178"/>
<line x1="40" y1="108" x2="28" y2="130"/>
<line x1="76" y1="108" x2="100" y2="130"/>
<line x1="100" y1="130" x2="128" y2="148"/>
</g>
</svg>`,

};

// ─── Exercise Database ─────────────────────────────────────────────────────────
export const EXERCISE_DB = {

  // ── Push ──────────────────────────────────────────────────────────────────────
  'Press banca o press mancuernas': {
    svg: SVG['bench-press'],
    description: 'Acuéstate en banco plano, agarra la barra (o mancuernas) con las manos un poco más anchas que los hombros y empuja hacia arriba. Baja de forma controlada hasta que los codos queden a 90°.',
    muscles: ['Pecho', 'Hombro anterior', 'Tríceps'],
  },
  'Press inclinado con mancuernas': {
    svg: SVG['bench-press'],
    description: 'En banco inclinado (30-45°), empuja las mancuernas desde el pecho hacia arriba. Mayor énfasis en la parte superior del pectoral. Mantén los codos ligeramente abiertos.',
    muscles: ['Pecho superior', 'Hombro anterior', 'Tríceps'],
  },
  'Press inclinado mancuernas': {
    svg: SVG['bench-press'],
    description: 'En banco inclinado, empuja las mancuernas desde el pecho hacia arriba con control. Baja lentamente para maximizar el estiramiento del pecho superior.',
    muscles: ['Pecho superior', 'Hombro anterior', 'Tríceps'],
  },
  'Press militar': {
    svg: SVG['military-press'],
    description: 'De pie o sentado, empuja la barra (o mancuernas) desde la altura del mentón hacia arriba de la cabeza. Mantén el core activo para proteger la zona lumbar.',
    muscles: ['Deltoides', 'Tríceps', 'Trapecio'],
  },
  'Arnold press': {
    svg: SVG['military-press'],
    description: 'Comienza con las mancuernas frente al rostro, palmas hacia ti, y rota las palmas hacia afuera al empujar hacia arriba. Activa los tres haces del deltoides.',
    muscles: ['Deltoides anterior', 'Deltoides lateral', 'Tríceps'],
  },
  'Elevaciones laterales': {
    svg: SVG['lateral-raise'],
    description: 'De pie con mancuernas a los lados, sube los brazos lateralmente hasta la altura del hombro. Codos ligeramente flexionados. No uses impulso del cuerpo.',
    muscles: ['Deltoides lateral', 'Trapecio superior'],
  },
  'Elevaciones laterales en cable': {
    svg: SVG['lateral-raise'],
    description: 'Usando el cable bajo, eleva el brazo lateralmente hasta la altura del hombro. El cable mantiene tensión constante en todo el rango de movimiento.',
    muscles: ['Deltoides lateral', 'Trapecio superior'],
  },
  'Fondos o press francés': {
    svg: SVG['tricep-extension'],
    description: 'En fondos: apoya las manos en paralelas y baja doblando los codos a 90°. En press francés: acostado, baja la barra hacia la frente doblando solo los codos.',
    muscles: ['Tríceps', 'Pecho (en fondos)', 'Deltoides anterior'],
  },
  'Extensión tríceps polea': {
    svg: SVG['tricep-extension'],
    description: 'De pie frente a la polea alta, empuja el agarre hacia abajo manteniendo los codos fijos a los costados. Extiende completamente el codo al final.',
    muscles: ['Tríceps (cabeza lateral y medial)'],
  },
  'Extensión tríceps en cuerda': {
    svg: SVG['tricep-extension'],
    description: 'Como la extensión en polea pero con cuerda: al final del movimiento abre la cuerda hacia afuera para maximizar la contracción del tríceps.',
    muscles: ['Tríceps (cabeza lateral)'],
  },
  'Aperturas en máquina o cables': {
    svg: SVG['chest-fly'],
    description: 'Con los cables a la altura del pecho, une las manos frente a ti con los codos ligeramente flexionados. Mantén la contracción del pecho 1-2 segundos al cerrar.',
    muscles: ['Pectoral mayor', 'Deltoides anterior'],
  },

  // ── Pull ──────────────────────────────────────────────────────────────────────
  'Dominadas o jalón al pecho': {
    svg: SVG['pullup'],
    description: 'En dominadas: cuelga de la barra y sube el pecho hacia ella. En jalón: siéntate en la máquina y jala la barra hasta la parte superior del pecho.',
    muscles: ['Dorsal ancho', 'Bíceps', 'Romboides'],
  },
  'Jalón agarre neutro': {
    svg: SVG['pullup'],
    description: 'En la máquina de jalón, usa el agarre neutro (palmas enfrentadas) y jala hacia el pecho. Mayor activación del dorsal y menos tensión en los codos.',
    muscles: ['Dorsal ancho', 'Bíceps', 'Romboides'],
  },
  'Remo con barra o mancuerna': {
    svg: SVG['row-bent'],
    description: 'Inclínate hacia adelante a 45°, espalda recta, y jala la barra (o mancuerna) hacia el abdomen. Aprieta la escápula al final para activar el dorsal.',
    muscles: ['Dorsal ancho', 'Romboides', 'Bíceps', 'Trapecio medio'],
  },
  'Remo en polea baja': {
    svg: SVG['row-bent'],
    description: 'Sentado frente a la polea baja, jala el agarre hacia el ombligo con la espalda erguida. Estira completamente los brazos entre repeticiones para mayor rango.',
    muscles: ['Dorsal ancho', 'Romboides', 'Bíceps'],
  },
  'Remo en máquina': {
    svg: SVG['row-machine'],
    description: 'Apoya el pecho en el pad de la máquina y jala las agarraderas hacia los costados. Mantén los hombros bajos y no encorves la espalda al tirar.',
    muscles: ['Dorsal ancho', 'Romboides', 'Bíceps'],
  },
  'Remo Hammer Strength o máquina': {
    svg: SVG['row-machine'],
    description: 'En la máquina Hammer Strength, jala los mangos alternativamente o a la vez. Permite cargas altas con menor riesgo lumbar que el remo libre.',
    muscles: ['Dorsal ancho', 'Romboides', 'Bíceps', 'Trapecio'],
  },
  'Face pull': {
    svg: SVG['face-pull'],
    description: 'Con la polea al nivel de la cara, jala la cuerda hacia el rostro abriendo los codos hacia afuera. Trabaja el deltoides posterior y mejora la postura.',
    muscles: ['Deltoides posterior', 'Manguito rotador', 'Trapecio medio'],
  },
  'Pull-over con mancuerna': {
    svg: SVG['pullover'],
    description: 'Acostado en el banco con los hombros apoyados, baja la mancuerna en arco hacia atrás de la cabeza y regresa. Mantén los codos ligeramente flexionados.',
    muscles: ['Dorsal ancho', 'Pectoral mayor', 'Tríceps (cabeza larga)'],
  },
  'Curl barra o mancuerna': {
    svg: SVG['curl'],
    description: 'De pie, dobla los codos llevando la barra hacia los hombros con las palmas hacia arriba. Baja de forma completamente controlada. No balancees el cuerpo.',
    muscles: ['Bíceps braquial', 'Braquial'],
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

  // ── Piernas ───────────────────────────────────────────────────────────────────
  'Sentadilla': {
    svg: SVG['squat'],
    description: 'Con la barra en los trapecios, baja como si te sentaras en una silla hasta que los muslos queden paralelos al suelo. Rodillas alineadas con la punta de los pies.',
    muscles: ['Cuádriceps', 'Glúteo mayor', 'Isquiotibiales'],
  },
  'Sentadilla búlgara': {
    svg: SVG['bulgarian-squat'],
    description: 'Apoya el pie trasero en un banco y baja la rodilla delantera doblando la cadera. Exige mayor equilibrio y activa más el glúteo que la sentadilla estándar.',
    muscles: ['Glúteo mayor', 'Cuádriceps', 'Isquiotibiales'],
  },
  'Sentadilla sumo con mancuerna': {
    svg: SVG['sumo-squat'],
    description: 'Postura amplia con pies apuntando afuera, sujeta una mancuerna con ambas manos y baja manteniendo el torso erguido. Mayor activación de aductores y glúteos.',
    muscles: ['Glúteo mayor', 'Aductores', 'Cuádriceps'],
  },
  'Peso muerto rumano': {
    svg: SVG['deadlift'],
    description: 'De pie con la barra, inclínate empujando las caderas hacia atrás, deslizando la barra por las piernas hasta sentir el estiramiento en los isquios. Espalda recta siempre.',
    muscles: ['Isquiotibiales', 'Glúteo mayor', 'Erector espinal'],
  },
  'Peso muerto rumano con mancuernas': {
    svg: SVG['deadlift'],
    description: 'Misma técnica que el rumano con barra pero usando mancuernas. Permite mayor rango de movimiento y libertad de posición de manos.',
    muscles: ['Isquiotibiales', 'Glúteo mayor', 'Erector espinal'],
  },
  'Prensa de pierna': {
    svg: SVG['leg-press'],
    description: 'En la máquina, coloca los pies a la anchura de los hombros y empuja hasta extender casi completamente las rodillas. No bloquees las rodillas al extender.',
    muscles: ['Cuádriceps', 'Glúteo mayor', 'Isquiotibiales'],
  },
  'Curl femoral': {
    svg: SVG['leg-curl'],
    description: 'Acostado boca abajo en la máquina, dobla las rodillas llevando los talones hacia los glúteos de forma controlada. Aprieta el isquio en la posición más alta.',
    muscles: ['Isquiotibiales', 'Gastrocnemio (porción posterior)'],
  },
  'Curl isquiotibial sentado': {
    svg: SVG['leg-curl'],
    description: 'Sentado en la máquina, dobla las rodillas contra la resistencia. La posición sentada cambia el ángulo de trabajo y permite mayor rango de movimiento.',
    muscles: ['Isquiotibiales'],
  },
  'Elevación de pantorrilla': {
    svg: SVG['calf-raise'],
    description: 'De pie (en escalón o suelo), sube de puntillas lo más alto posible y baja hasta el estiramiento completo de la pantorrilla. Pausa 1 segundo en cada extremo.',
    muscles: ['Gastrocnemio', 'Sóleo'],
  },
  'Extensión de cuádriceps': {
    svg: SVG['quad-extension'],
    description: 'Sentado en la máquina, extiende las rodillas empujando el rodillo hacia arriba. Contrae el cuádriceps con fuerza en la posición completamente extendida.',
    muscles: ['Cuádriceps (vasto lateral, medial y recto femoral)'],
  },
  'Abducción de cadera': {
    svg: SVG['hip-abduction'],
    description: 'En la máquina o con cable, abre la pierna lateralmente contra la resistencia. Activa el glúteo medio y los abductores. Controla el regreso.',
    muscles: ['Glúteo medio', 'Tensor fascia lata', 'Glúteo mayor'],
  },
  'Zancadas con mancuernas': {
    svg: SVG['lunge'],
    description: 'Da un paso adelante y baja la rodilla trasera hacia el suelo. Torso erguido, rodilla delantera no sobrepasa la punta del pie. Empuja con el talón al subir.',
    muscles: ['Cuádriceps', 'Glúteo mayor', 'Isquiotibiales'],
  },

  // ── Full Body / Glúteo ────────────────────────────────────────────────────────
  'Hip thrust': {
    svg: SVG['hip-thrust'],
    description: 'Apoya la espalda superior en el banco, baja las caderas y empuja hacia arriba apretando el glúteo. Mantén la barbilla hacia el pecho durante todo el movimiento.',
    muscles: ['Glúteo mayor', 'Isquiotibiales', 'Core'],
  },
  'Hip thrust con barra': {
    svg: SVG['hip-thrust'],
    description: 'Con la barra apoyada sobre las caderas (con pad), empuja hacia arriba apretando el glúteo en la posición más alta. Rodillas a 90° en el punto de máxima extensión.',
    muscles: ['Glúteo mayor', 'Isquiotibiales', 'Core'],
  },
  'Patada de glúteo en cable': {
    svg: SVG['cable-kickback'],
    description: 'Con el tobillo sujeto al cable bajo, inclínate ligeramente y empuja la pierna hacia atrás y arriba sin doblar la espalda. Aprieta el glúteo en la posición alta.',
    muscles: ['Glúteo mayor', 'Isquiotibiales'],
  },
  'Plancha con remo de mancuerna': {
    svg: SVG['plank-row'],
    description: 'En plancha alta con mancuernas, jala una mancuerna hacia la cadera estabilizando el core para no rotar el tronco. Alterna lados en cada repetición.',
    muscles: ['Core', 'Dorsal ancho', 'Romboides', 'Deltoides posterior'],
  },

  // ── Abs ───────────────────────────────────────────────────────────────────────
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
