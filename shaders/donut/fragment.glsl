varying vec2 vUv;

uniform float uTime;

void main(){
    vec2 color = vUv;
    gl_FragColor = vec4(color,1.0,1);
}