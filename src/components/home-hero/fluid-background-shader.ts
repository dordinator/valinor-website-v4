import { meshGradientFragmentShader } from '@paper-design/shaders';

/**
 * Adapted from Paper Shaders Mesh Gradient, Apache-2.0.
 * Modifications: responsive UVs, drifting diffuse composition, wider feathering,
 * damped local pointer distortion, tonal contrast and a navy centre for readability.
 * The upstream continuous distance-weighted colour mixing is retained.
 */
function replaceOnce(source: string, before: string, after: string): string {
  if (source.split(before).length !== 2) throw new Error('Paper shader adaptation no longer matches the pinned source.');
  return source.replace(before, after);
}

let shader = meshGradientFragmentShader.replaceAll('v_objectUV', 'v_responsiveUV');
shader = shader.replaceAll('u_distortion * center', 'u_distortion * max(.28, u_strength) * center');
shader = replaceOnce(shader, 'uniform float u_grainOverlay;', `uniform float u_grainOverlay;
uniform vec2 u_pointer;
uniform vec2 u_flow;
uniform float u_presence;
uniform float u_strength;
uniform float u_contrast;
uniform float u_viewAspect;`);

const start = shader.indexOf('vec2 getPosition(');
const end = shader.indexOf('\nvoid main()', start);
if (start < 0 || end < 0) throw new Error('Paper shader position function not found.');
shader = shader.slice(0, start) + `
vec2 getPosition(int i, float t) {
  // Bring the light patches into the frame so their boundaries stay rounded.
  vec2 base = vec2(.48, .48);
  if (i == 0) base = vec2(.10, .43);
  else if (i == 1) base = vec2(.84, .88);
  else if (i == 2) base = vec2(.49, .51);
  else if (i == 3) base = vec2(.20, .91);
  else if (i == 4) base = vec2(.71, .01);
  else if (i == 5) base = vec2(1.13, .40);
  else if (i == 6) base = vec2(.01, -.15);
  else if (i == 7) base = vec2(.43, 1.33);
  else if (i == 8) base = vec2(.74, .16);
  float phase = float(i) * 1.9;
  vec2 path = vec2(
    sin(t * 1.04 + phase) + .32 * sin(t * 1.73 + phase * .71),
    cos(t * .86 + phase) + .32 * cos(t * 1.41 + phase * 1.13)
  );
  return base + .095 * max(.28, u_strength) * path;
}
` + shader.slice(end);

shader = replaceOnce(shader, 'vec2 grainUV = uv * 1000.;', `
  // Pointer deformation is local, aspect-correct and smoothly feathered.
  vec2 aspect = vec2(u_viewAspect, 1.);
  vec2 delta = (uv - u_pointer) * aspect;
  float influence = exp(-dot(delta, delta) / .15) * u_presence;
  uv -= u_flow * influence * u_strength * .14;
  uv += vec2(-delta.y, delta.x) / aspect * influence * u_strength * .10;
  // Low-frequency 2D warping gives the clouds soft lobes rather than long wedges.
  // This changes their shape gradually; it does not draw extra lines or borders.
  float drift = u_time * .42;
  vec2 domain = uv * 3.1;
  vec2 organic = vec2(
    valueNoise(domain + vec2(drift, -drift * .37)),
    valueNoise(domain + vec2(7.8 - drift * .41, 2.6 + drift * .63))
  ) - .5;
  organic += .28 * (vec2(
    valueNoise(domain * 1.85 + vec2(3.4 + drift * .51, 6.3)),
    valueNoise(domain * 1.85 + vec2(9.1, 1.7 - drift * .48))
  ) - .5);
  uv += organic * .38 * (.55 + .45 * max(.28, u_strength));
  vec2 grainUV = gl_FragCoord.xy;`);
shader = replaceOnce(shader, 'float weight = 1. / (dist + 1e-3);', `float weight = 1. / (dist + 1e-3);
    // A third, weaker light field adds changing detail without raising the whole scene.
    if (i == 8) weight *= .38;`);
shader = replaceOnce(shader, 'dist = pow(dist, 3.5);', 'dist = pow(dist, 2.65);');
shader = replaceOnce(shader, 'color /= max(1e-4, totalWeight);', `color /= max(1e-4, totalWeight);
  // Colour separation varies independently from the geometry and animation.
  vec3 navy = vec3(.027, .080, .139);
  color = mix(navy, color, u_contrast);
  // A broad, feathered dark centre keeps foreground copy readable.
  vec2 textDelta = (v_responsiveUV + .5 - vec2(.5, .51)) * vec2(1.1, 1.8);
  float textShade = exp(-dot(textDelta, textDelta) * 5.);
  color = mix(color, vec3(.018, .060, .108), textShade * .15);`);

export const navyMeshShader = shader;
