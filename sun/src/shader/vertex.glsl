uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec2 pixels;

float PI = 3.141592653589793238;
void main() {
    vUv = uv;
    vPosition = position;
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    // gl_PointSize = size * ( 300.0 / - mvPosition.z );

    gl_Position = projectionMatrix * mvPosition;

}
