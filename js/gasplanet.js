import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import sky from '$images/sky.jpg'; // Import the sky texture

// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 50, 100);
controls.update();

// Create a skydome using a large sphere
const skyTexture = new THREE.TextureLoader().load(sky); // Replace with your sky texture
const skydomeGeometry = new THREE.SphereGeometry(500, 32, 32);
const skydomeMaterial = new THREE.MeshBasicMaterial({
    map: skyTexture,
    side: THREE.BackSide // Render inside of the sphere
});
const skydome = new THREE.Mesh(skydomeGeometry, skydomeMaterial);
scene.add(skydome);

// Cloud uniform for the shader (time for movement)
const uniforms = {
  time: { value: 0.0 },
  cloudColor: { value: new THREE.Color(0xddddff) }
};

// Vertex shader (no need to modify much)
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Fragment shader for flowing clouds using noise
const fragmentShader = `
  uniform float time;
  uniform vec3 cloudColor;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // Simple noise function
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(random(i + vec2(0.0, 0.0)),
                   random(i + vec2(1.0, 0.0)), u.x),
               mix(random(i + vec2(0.0, 1.0)),
                   random(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    vec2 uv = vUv;
    uv.y += time * 0.05; // Flow clouds along y-axis
    uv.x += time * 0.02; // Slight flow along x-axis

    // Layered noise for cloud texture
    float clouds = noise(uv * 3.0) * 0.6 + noise(uv * 6.0) * 0.4;

    vec3 finalColor = mix(vec3(0.2, 0.5, 0.8), cloudColor, clouds);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

// Create the cloud layer below the camera
const cloudGeometry = new THREE.PlaneGeometry(1000, 1000, 100, 100);
const cloudMaterial = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  transparent: true,
  side: THREE.DoubleSide
});

const cloudPlane = new THREE.Mesh(cloudGeometry, cloudMaterial);
cloudPlane.rotation.x = -Math.PI / 2; // Make the plane flat under the camera
scene.add(cloudPlane);

// Resize handling
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Update cloud movement
  uniforms.time.value += 0.02;

  // Move the skydome to follow the camera
  skydome.position.copy(camera.position);

  controls.update();
  renderer.render(scene, camera);
}

animate();
