const fs = require('fs');
let code = fs.readFileSync('c:/Users/zah6d/Desktop/eduvantix-frontend/src/components/Tracks.jsx', 'utf8');

// Replace standard motion patterns with CSS animation
code = code.replace(/<motion\.span animate=\{\{ opacity: \[0, 1, 0\] \}\} transition=\{\{ duration: 0\.8, repeat: Infinity \}\} className=\"w-0\.5 h-2\.5 bg-white ml-0\.5\" \/>/g, '<span style={{ animation: \'animBlink 0.8s infinite\' }} className=\"w-0.5 h-2.5 bg-white ml-0.5\" />');

code = code.replace(/<motion\.span animate=\{\{ scale: \[0\.95, 1\.05, 0\.95\] \}\} transition=\{\{ duration: 3, repeat: Infinity \}\} className=\"text-\[8px\] font-bold text-white text-center leading-none\">/g, '<span style={{ animation: \'animPulseScale 3s infinite\' }} className=\"text-[8px] font-bold text-white text-center leading-none\">');

code = code.replace(/<motion\.div animate=\{\{ width: \[\"10%\", \"95%\", \"10%\"\] \}\} transition=\{\{ duration: 5, repeat: Infinity \}\} className=\"h-full bg-emerald-500\" \/>/g, '<div style={{ animation: \'animProgressFast 5s infinite\' }} className=\"h-full bg-emerald-500\" />');

code = code.replace(/<motion\.div animate=\{\{ y: \[0, -6, 0\] \}\} transition=\{\{ duration: 4, repeat: Infinity, ease: \"easeInOut\" \}\} className=\"w-12 h-12 rounded-lg bg-emerald-500\/20 border border-emerald-500\/40 flex items-center justify-center shadow-lg\">/g, '<div style={{ animation: \'animFloatSm 4s ease-in-out infinite\' }} className=\"w-12 h-12 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-lg\">');

code = code.replace(/<motion\.div animate=\{\{ y: \[0, -10, 0\] \}\} transition=\{\{ duration: 3, repeat: Infinity, ease: \"easeInOut\", delay: 0\.5 \}\} className=\"w-16 h-16 rounded-lg bg-red-500\/20 border border-red-500\/40 flex items-center justify-center shadow-2xl z-10\">/g, '<div style={{ animation: \'animFloatMd 3s ease-in-out infinite 0.5s\' }} className=\"w-16 h-16 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center shadow-2xl z-10\">');

code = code.replace(/<motion\.div animate=\{\{ y: \[0, -6, 0\] \}\} transition=\{\{ duration: 4, repeat: Infinity, ease: \"easeInOut\", delay: 1 \}\} className=\"w-12 h-12 rounded-lg bg-pink-500\/20 border border-pink-500\/40 flex items-center justify-center shadow-lg\">/g, '<div style={{ animation: \'animFloatSm 4s ease-in-out infinite 1s\' }} className=\"w-12 h-12 rounded-lg bg-pink-500/20 border border-pink-500/40 flex items-center justify-center shadow-lg\">');

code = code.replace(/<motion\.div animate=\{\{ x: \[\"-100%\", \"200%\"\] \}\} transition=\{\{ duration: 3, repeat: Infinity, ease: \"easeInOut\" \}\} className=\"absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-cyan-500\/10 to-transparent skew-x-12\" \/>/g, '<div style={{ animation: \'animSweep 3s ease-in-out infinite\' }} className=\"absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent skew-x-12\" />');

code = code.replace(/<motion\.div animate=\{\{ x: \[\"-100%\", \"100%\"\] \}\} transition=\{\{ duration: 2, repeat: Infinity, ease: \"linear\" \}\} className=\"w-1\/2 h-full bg-blue-500\" \/>/g, '<div style={{ animation: \'animSweepLinear 2s linear infinite\' }} className=\"w-1/2 h-full bg-blue-500\" />');

code = code.replace(/<motion\.div\s+animate=\{\{ rotate: 360 \}\}\s+transition=\{\{ duration: 6, repeat: Infinity, ease: \"linear\" \}\}\s+className=\"w-10 h-10 rounded-full border border-white\/20 bg-neutral-900 flex items-center justify-center relative shadow-lg\"\s*>/g, '<div style={{ animation: \'spin 6s linear infinite\' }} className=\"w-10 h-10 rounded-full border border-white/20 bg-neutral-900 flex items-center justify-center relative shadow-lg\">');

code = code.replace(/<motion\.div\s+key=\{index\}\s+animate=\{\{ height: \[\"20%\", \"100%\", \"20%\"\] \}\}\s+transition=\{\{ duration: delay, repeat: Infinity, ease: \"easeInOut\" \}\}\s+className=\"w-0\.75 bg-emerald-500 rounded-full\"\s+style=\{\{ width: \"3px\" \}\}\s*\/>/g, '<div key={index} className=\"w-0.75 bg-emerald-500 rounded-full\" style={{ width: \"3px\", animation: `animEqualizer ${delay}s ease-in-out infinite` }} />');

code = code.replace(/<motion\.div\s+animate=\{\{ width: \[\"30%\", \"85%\", \"30%\"\] \}\}\s+transition=\{\{ duration: 10, repeat: Infinity, ease: \"easeInOut\" \}\}\s+className=\"h-full bg-emerald-500 rounded-full\"\s*\/>/g, '<div style={{ animation: \'animProgressSlow 10s ease-in-out infinite\' }} className=\"h-full bg-emerald-500 rounded-full\" />');

code = code.replace(/<motion\.div\s+animate=\{\{ scale: \[1, 1\.1, 1\] \}\}\s+transition=\{\{ duration: 2, repeat: Infinity \}\}\s+className=\"w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center hover:scale-105 transition-transform\"\s*>/g, '<div style={{ animation: \'animScaleHover 2s infinite\' }} className=\"w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center hover:scale-105 transition-transform\">');

code = code.replace(/<motion\.div\s+animate=\{\{ x: \[\"-100%\", \"100%\"\] \}\}\s+transition=\{\{ duration: 3, repeat: Infinity, ease: \"linear\" \}\}\s+className=\"w-1\/2 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent absolute\"\s*\/>/g, '<div style={{ animation: \'animSweepLinear 3s linear infinite\' }} className=\"w-1/2 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent absolute\" />');

code = code.replace(/<motion\.div\s+animate=\{\{ x: \[-55, 55, -55\] \}\}\s+transition=\{\{ duration: 6, repeat: Infinity, ease: \"easeInOut\" \}\}\s+className=\"absolute text-emerald-400\"\s+style=\{\{ top: \"18px\" \}\}\s*>/g, '<div style={{ animation: \'animFloatMd 6s ease-in-out infinite\' }} className=\"absolute text-emerald-400\" style={{ top: \"18px\" }}>');

code = code.replace(/<motion\.div\s+animate=\{\{ opacity: \[0\.3, 0\.6, 0\.3\] \}\}\s+transition=\{\{ duration: 4, repeat: Infinity, ease: \"easeInOut\" \}\}\s+className=\"absolute inset-0 bg-gradient-to-tr from-red-500\/10 via-transparent to-red-500\/20\"\s*\/>/g, '<div style={{ animation: \'animPulseOpacity 4s ease-in-out infinite\' }} className=\"absolute inset-0 bg-gradient-to-tr from-red-500/10 via-transparent to-red-500/20\" />');

code = code.replace(/<motion\.div\s+animate=\{\{ width: \[\"15%\", \"90%\", \"15%\"\] \}\}\s+transition=\{\{ duration: 12, repeat: Infinity, ease: \"linear\" \}\}\s+className=\"h-full bg-red-600 rounded-full\"\s*\/>/g, '<div style={{ animation: \'animProgressSlow 12s linear infinite\' }} className=\"h-full bg-red-600 rounded-full\" />');

code = code.replace(/<motion\.span\s+animate=\{\{ opacity: \[0, 1, 0\] \}\}\s+transition=\{\{ duration: 0\.8, repeat: Infinity \}\}\s+className=\"w-1 h-3 bg-white\/80 ml-0\.5\"\s*\/>/g, '<span style={{ animation: \'animBlink 0.8s infinite\' }} className=\"w-1 h-3 bg-white/80 ml-0.5\" />');

code = code.replace(/<motion\.span\s+animate=\{\{ opacity: \[0\.4, 1, 0\.4\] \}\}\s+transition=\{\{ duration: 2, repeat: Infinity \}\}\s*>/g, '<span style={{ animation: \'animPulseOpacity 2s infinite\' }}>');

code = code.replace(/<motion\.span\s+animate=\{\{ scale: \[1, 1\.05, 1\], backgroundColor: \[\"rgba\\(16,185,129,0\.1\\)\", \"rgba\\(16,185,129,0\.2\\)\", \"rgba\\(16,185,129,0\.1\\)\"\] \}\}\s+transition=\{\{ duration: 1\.5, repeat: Infinity \}\}\s+className=\"text-\[9px\] font-bold text-emerald-400 px-1\.5 py-0\.5 rounded border border-emerald-500\/20\"\s*>/g, '<span style={{ animation: \'animScalePulseBg 1.5s infinite\' }} className=\"text-[9px] font-bold text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20\">');

code = code.replace(/<motion\.path\s+animate=\{\{ pathLength: \[0\.1, 1\] \}\}\s+transition=\{\{ duration: 4, repeat: Infinity, ease: \"easeInOut\" \}\}\s+d=\"M0,35 Q20,25 40,30 T80,10 T100,5\"\s+stroke=\"#f59e0b\"\s+strokeWidth=\"2\"\s+fill=\"none\"\s*\/>/g, '<path style={{ animation: \'animPathLength 4s ease-in-out infinite\', strokeDasharray: 1, strokeDashoffset: 1 }} d=\"M0,35 Q20,25 40,30 T80,10 T100,5\" stroke=\"#f59e0b\" strokeWidth=\"2\" fill=\"none\" />');

code = code.replace(/<motion\.div\s+animate=\{\{ scale: \[1, 1\.08, 1\] \}\}\s+transition=\{\{ duration: 10, repeat: Infinity, ease: \"easeInOut\" \}\}\s+className=\"absolute inset-0 bg-cover bg-center\"\s+style=\{\{ backgroundImage: \"url\\('https:\/\/images.unsplash.com\/photo-1502672260266-1c1ef2d93688\\?w=300&auto=format&fit=crop&q=60'\\)\" \}\}\s*\/>/g, '<div style={{ animation: \'animScaleSlow 10s ease-in-out infinite\', backgroundImage: \"url(\'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&auto=format&fit=crop&q=60\')\" }} className=\"absolute inset-0 bg-cover bg-center\" />');

// Find and close replaced span and div tags that had children
code = code.replace(/<\/motion\.span>/g, '</span>');
code = code.replace(/<\/motion\.div>/g, '</div>');

fs.writeFileSync('c:/Users/zah6d/Desktop/eduvantix-frontend/src/components/Tracks.jsx', code);
console.log('Replaced motion loops in Tracks.jsx');
