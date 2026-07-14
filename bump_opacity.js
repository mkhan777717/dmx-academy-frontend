const fs = require('fs');
const files = ['src/components/Process.jsx', 'src/components/Tracks.jsx'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Increase SVG opacities
  content = content.replace(/(fillOpacity|strokeOpacity)=["']([0-9.]+)["']/g, (match, p1, p2) => {
    let val = parseFloat(p2);
    val = Math.min(1.0, val * 2.5); // multiply by 2.5
    return `${p1}="${val.toFixed(2)}"`;
  });

  // Increase inline opacity for numbers in Process.jsx
  content = content.replace(/opacity: 0\.12/g, 'opacity: 0.35');
  
  // Increase inline opacity for numbers in Tracks.jsx
  content = content.replace(/opacity: isActive \? 0\.15 : 0\.08/g, 'opacity: isActive ? 0.4 : 0.2');

  fs.writeFileSync(file, content);
});
console.log('Opacities increased.');
