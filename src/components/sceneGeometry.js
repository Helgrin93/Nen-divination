// All photographic layers share this native image space. Masks are authored
// in the old local water units and transformed exactly once, without CSS crops.
export const sceneSize={width:1536,height:1024};
export const waterRegion={x:443,y:560,width:650,height:442};
export const glassOutline='M342 86 C340 25 656 25 657 86 C672 225 640 374 521 400 L479 400 C370 374 334 231 342 86 Z';

// Wing sits behind the glass. Exclude the bowl from his transparent sprite
// instead of repainting an opaque second glass on top of him each frame.
const wingWidth=sceneSize.width*.64,wingHeight=sceneSize.height*.64;
const wingLeft=(sceneSize.width-wingWidth)/2;
const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${wingLeft} 0 ${wingWidth} ${wingHeight}"><defs><mask id="cut" maskUnits="userSpaceOnUse" x="0" y="0" width="1536" height="1024"><rect width="1536" height="1024" fill="white"/><path d="${glassOutline}" transform="translate(${waterRegion.x} ${waterRegion.y}) scale(.65)" fill="black"/></mask></defs><rect width="1536" height="1024" fill="white" mask="url(#cut)"/></svg>`;
export const wingOcclusionMask=`url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
