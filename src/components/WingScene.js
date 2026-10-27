import { wing } from '../data/wing.js';

const crystalPositions = [[-55,370],[-13,399],[40,351],[58,425],[-38,449],[22,462],[-56,414],[6,350],[45,390],[-20,473],[62,458],[-32,351]];
const fragments = [[-16,337],[-2,341],[12,334],[25,331],[-26,346],[3,328],[32,337],[-8,352],[18,348]];

export function wingScene() {
  return `<section class="scene" data-phase="intro" data-effect="none" aria-label="Water divination">
    <svg class="scene-art" viewBox="0 0 1200 560" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="room-light"><stop stop-color="#61513b"/><stop offset=".55" stop-color="#262d2c"/><stop offset="1" stop-color="#0a1219"/></radialGradient>
        <linearGradient id="table" x1="600" y1="285" x2="600" y2="560" gradientUnits="userSpaceOnUse"><stop stop-color="#765b47"/><stop offset=".5" stop-color="#3e332d"/><stop offset="1" stop-color="#0a1118"/></linearGradient>
        <linearGradient id="glass-fill"><stop stop-color="#d3eff5" stop-opacity=".18"/><stop offset=".22" stop-color="#aacbd9" stop-opacity=".025"/><stop offset=".73" stop-color="#c1dfe9" stop-opacity=".06"/><stop offset="1" stop-color="#daf1f4" stop-opacity=".28"/></linearGradient>
        <linearGradient id="water" x1="600" y1="325" x2="600" y2="490" gradientUnits="userSpaceOnUse"><stop stop-color="#8cbcc6" stop-opacity=".27"/><stop offset="1" stop-color="#6393a6" stop-opacity=".37"/></linearGradient>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="170" gradientUnits="userSpaceOnUse"><stop stop-color="#bb9e84"/><stop offset=".6" stop-color="#877564"/><stop offset="1" stop-color="#4c4842"/></linearGradient>
        <linearGradient id="mentor"><stop stop-color="#a7a69a" stop-opacity=".18"/><stop offset=".5" stop-color="#ded9c8" stop-opacity=".26"/><stop offset="1" stop-color="#989c93" stop-opacity=".12"/></linearGradient>
        <radialGradient id="leaf-fill"><stop stop-color="#9caf6a"/><stop offset="1" stop-color="#627c49"/></radialGradient>
        <clipPath id="glass-clip"><path d="M516 299Q600 275 684 299L670 477Q600 503 530 477Z"/></clipPath>
        <filter id="soft-shadow"><feGaussianBlur stdDeviation="8"/></filter>
        <pattern id="wood-grain" width="230" height="38" patternUnits="userSpaceOnUse"><path d="M0 12q90-9 230 0M0 26q160 6 230-4M40 37q60-6 160 0" stroke="#cab28b" stroke-opacity=".07"/></pattern>
        <path id="hand-shape" d="M-160 139c36-5 64-22 80-47l27-42c8-15 17-28 30-32l52-20c15-5 24 7 13 17L4 42c-7 6-11 13-12 21l45-19c17-7 28 6 15 18L7 90l41-11c17-5 24 11 9 20L11 122l33-1c18 0 21 17 4 21L5 153c-29 8-51 11-74 9l-62 32Z"/>
      </defs>
      <rect width="1200" height="560" fill="url(#room-light)"/>
      <g stroke="#9d8a68" stroke-opacity=".11"><path d="M170 0v285M1030 0v285M170 63h860M170 218h860M340 63v155M860 63v155M0 285h1200"/><path d="M185 0v285M1015 0v285" stroke-opacity=".08"/></g>
      <path d="M218 0h24v285h-24M958 0h24v285h-24" fill="#080e15" opacity=".35"/>
      <g id="mentor-fallback" class="mentor">
      </g>
      <image id="mentor-portrait" x="416" y="35" width="368" height="285" preserveAspectRatio="xMidYMax meet" style="display:none"/>
      <rect y="292" width="1200" height="268" fill="url(#table)"/>
      <rect y="292" width="1200" height="268" fill="url(#wood-grain)"/>
      <path d="M0 293h1200" stroke="#ad8d65" stroke-opacity=".3"/>
      <path d="m110 560 153-265m827 265L937 295" stroke="#1d2428" stroke-opacity=".4"/>
      <ellipse cx="600" cy="500" rx="156" ry="16" fill="#02070c" opacity=".6" filter="url(#soft-shadow)"/>
      <g class="hand hand-left" transform="translate(410 329)"><path d="m-162 127-35 85 65-5 44-60Z" fill="#141f27" stroke="#41505a"/><use href="#hand-shape" fill="url(#skin)" stroke="#393c37" stroke-width="1.2"/><path d="m-53 72 20 24m-40 8 25 22m33-85 22 9m-4 36 18 7m-24 29 17 5m-22 22 11 2" stroke="#504c43" stroke-width="1.4" opacity=".7"/></g>
      <g class="hand hand-right" transform="translate(790 329) scale(-1 1)"><path d="m-162 127-35 85 65-5 44-60Z" fill="#141f27" stroke="#41505a"/><use href="#hand-shape" fill="url(#skin)" stroke="#393c37" stroke-width="1.2"/><path d="m-53 72 20 24m-40 8 25 22m33-85 22 9m-4 36 18 7m-24 29 17 5m-22 22 11 2" stroke="#504c43" stroke-width="1.4" opacity=".7"/></g>
      <g class="water-glass">
        <g clip-path="url(#glass-clip)">
          <g class="water-body"><path d="M505 338Q600 310 695 338V505H505Z" fill="url(#water)"/><path class="emission-tint" d="M505 338Q600 310 695 338V505H505Z" fill="#7b6bb5" fill-opacity=".58"/><ellipse class="water-surface" cx="600" cy="338" rx="84" ry="15" fill="#aecdd1" fill-opacity=".16" stroke="#cee9ea" stroke-opacity=".5"/><ellipse cx="600" cy="338" rx="65" ry="9" stroke="#d1e4d5" stroke-opacity=".15"/></g>
          <g class="crystals" transform="translate(600)">${crystalPositions.map(([x,y],i)=>`<path style="--i:${i}" transform="translate(${x} ${y})" d="m0-4 2.5 4L0 4-2.5 0Z" fill="#c7e6dd"/>`).join('')}</g>
          <g class="sweet-bubbles" stroke="#d8c7a7">${crystalPositions.slice(0,7).map(([x,y],i)=>`<circle style="--i:${i}" cx="${600+x}" cy="${y}" r="${i%3+1.3}"/>`).join('')}</g>
          <g class="leaf-motion"><g class="leaf"><path class="leaf-blade" d="M570 344q7-26 57-25-9 32-57 25Z" fill="url(#leaf-fill)" stroke="#536b40" stroke-width="1.2"/><path d="m564 348 53-24m-36 17 1-9m8 5 2-10m6 6 2-8m-9 12 11 3m-23 1 12 4" stroke="#d0d6a1" stroke-width=".8" stroke-opacity=".6"/><path class="leaf-darkening" d="M570 344q7-26 57-25-9 32-57 25Z" fill="#272c27"/></g></g>
          <g class="leaf-fragments" transform="translate(600)">${fragments.map(([x,y],i)=>`<path style="--i:${i};--fall:${35+i*11}px" d="m${x} ${y} 6-3-2 7-5-1Z" fill="#272c27"/>`).join('')}</g>
        </g>
        <path d="M516 298 530 477q70 28 140 0l14-179" fill="url(#glass-fill)" stroke="#b9d2dd" stroke-opacity=".65" stroke-width="2"/>
        <ellipse cx="600" cy="298" rx="84" ry="18" stroke="#cee4eb" stroke-opacity=".85" stroke-width="2"/>
        <ellipse cx="600" cy="298" rx="80" ry="14" stroke="#a9c7d2" stroke-opacity=".2"/>
        <path d="m525 311 13 153m134-154-12 155" stroke="#eff9fa" stroke-opacity=".35" stroke-width="4"/>
        <path d="m543 356 7 99" stroke="#eff9fa" stroke-opacity=".15" stroke-width="9"/>
        <ellipse cx="600" cy="478" rx="69" ry="14" stroke="#d9eaf0" stroke-opacity=".65" stroke-width="2"/>
        <path d="M533 485q67 21 134 0" stroke="#9eafb9" stroke-opacity=".4" stroke-width="3"/>
        <g class="overflow" stroke="#c3e1e5" stroke-opacity=".65"><path d="M519 301q-8 32 7 63M681 301q9 29-3 49" stroke-width="3"/><ellipse cx="600" cy="492" rx="90" ry="8" fill="#a0c4ce" fill-opacity=".12"/></g>
      </g>
    </svg>
    <div class="mentor-caption"><span>WING</span><span data-i18n="mentorFallback" class="fallback-note"></span></div>
    <div class="scene-hold-slot"></div>
    <p class="scene-effect-caption" aria-live="polite"></p>
  </section>`;
}

export function setupMentor(scene) {
  const image = scene.querySelector('#mentor-portrait');
  const fallback = scene.querySelector('#mentor-fallback');
  image.addEventListener('error', () => {
    image.style.display = 'none'; fallback.style.display = '';
    scene.querySelector('.fallback-note').hidden = false;
  });
  return expression => {
    scene.dataset.expression = expression;
    const localPreview = (import.meta.env.DEV || import.meta.env.MODE === 'local-review') && wing.permissionStatus === 'local-preview';
    const src = (wing.permissionStatus === 'authorized' || localPreview) && (wing.poses[expression] || wing.poses.neutral);
    if (!src) return;
    image.setAttribute('href', import.meta.env.BASE_URL + src.replace(/^\//, ''));
    image.style.display = ''; fallback.style.display = 'none';
    scene.querySelector('.fallback-note').hidden = true;
  };
}
