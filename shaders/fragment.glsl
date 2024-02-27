export default /* glsl */`
uniform float uTime;
uniform sampler2D uTexture;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vDisplacement;


void main() {

  vec4 imageTexture = texture2D(uTexture,vUv);

	gl_FragColor = vec4((vDisplacement*1.2 -0.1)*0.8,0,(vDisplacement*1.2 - 0.9),1);

}
`;
