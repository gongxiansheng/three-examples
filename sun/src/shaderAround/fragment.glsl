uniform sampler2D pointTexture;
uniform samplerCube uPerlin;
uniform float time;
uniform vec4 resolution;
uniform vec3 uColor;
varying vec2 vUv;
varying vec3 vPosition;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;
varying vec3 eyeVector;
varying vec3 vNormal;

vec3 brightnessToColor(float b) {
    b*= .25;
    return (vec3(b, b*b, b*b*b*b) / .25) * .8;
}


void main() {
    float radial = 1. - vPosition.z;
    radial *= radial * radial;
    float brightness = 1. + radial *.83;

    vec3 color = brightnessToColor(brightness)* radial;
    // gl_FragColor.rgb = brightnessToColor(brightness)* radial;
    gl_FragColor.a = radial;
    gl_FragColor = vec4(color, 1.);

}
