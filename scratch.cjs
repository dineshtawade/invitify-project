const fs = require('fs');
const css = `
@keyframes bounceIn { 0%, 20%, 40%, 60%, 80%, 100% { animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000); } 0% { opacity: 0; transform: translate(-50%, -50%) scale3d(.3, .3, .3); } 20% { transform: translate(-50%, -50%) scale3d(1.1, 1.1, 1.1); } 40% { transform: translate(-50%, -50%) scale3d(.9, .9, .9); } 60% { opacity: 1; transform: translate(-50%, -50%) scale3d(1.03, 1.03, 1.03); } 80% { transform: translate(-50%, -50%) scale3d(.97, .97, .97); } 100% { opacity: 1; transform: translate(-50%, -50%) scale3d(1, 1, 1); } }
@keyframes slideUp { from { transform: translate(-50%, -20%); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }
@keyframes slideDown { from { transform: translate(-50%, -80%); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }
@keyframes slideLeft { from { transform: translate(-30%, -50%); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }
@keyframes slideRight { from { transform: translate(-70%, -50%); opacity: 0; } to { transform: translate(-50%, -50%); opacity: 1; } }
@keyframes rotateIn { from { transform: translate(-50%, -50%) rotate(-200deg); opacity: 0; } to { transform: translate(-50%, -50%) rotate(0); opacity: 1; } }
@keyframes flipIn { from { transform: translate(-50%, -50%) perspective(400px) rotate3d(1, 0, 0, 90deg); opacity: 0; } to { transform: translate(-50%, -50%) perspective(400px) rotate3d(1, 0, 0, 0deg); opacity: 1; } }
@keyframes pulseIn { 0% { transform: translate(-50%, -50%) scale3d(1, 1, 1); } 50% { transform: translate(-50%, -50%) scale3d(1.05, 1.05, 1.05); } 100% { transform: translate(-50%, -50%) scale3d(1, 1, 1); } }
`;
fs.appendFileSync('resources/css/app.css', css, 'utf8');
