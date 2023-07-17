varying vec2 vUv;
varying vec3 vNormal;

uniform float uTime;

void main(){
    vec2 color = vUv ;
    gl_FragColor = vec4(color,1,1);
}