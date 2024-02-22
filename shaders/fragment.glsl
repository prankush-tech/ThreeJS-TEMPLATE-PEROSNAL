export default /* glsl */`
uniform float uTime;
uniform sampler2D uTexture;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vDisplacement;


void main() {

  // vec4 imageTexture = texture2D(uTexture,vUv);

	gl_FragColor = vec4(vec3(vDisplacement),1);

}
`;
