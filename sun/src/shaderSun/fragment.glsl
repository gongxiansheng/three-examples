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
    return (vec3(b, b*b, b*b*b*b) / .25) * .6;
}

float Fresnel(vec3 eyeVector, vec3 worldNormal) {
    return pow(1. + dot(eyeVector, worldNormal), 3.);
}

float supersun() {
    float sum = .0;
    sum += textureCube(uPerlin, vLayer0).r;
    sum += textureCube(uPerlin, vLayer1).r;
    sum += textureCube(uPerlin, vLayer2).r;
    sum *= .33;
    return sum;
}

void main() {
    float brightness = supersun();
    brightness = brightness * 3. + 1.;
    float fres = Fresnel(eyeVector, vNormal);
    // more burning
    brightness += pow(fres, .8);

    vec3 color = brightnessToColor(brightness);
    // vec3 color = vec3(fres);
    gl_FragColor = vec4(color, 1.);

    // gl_FragColor = vec4(vLayer0, 1.);

}
