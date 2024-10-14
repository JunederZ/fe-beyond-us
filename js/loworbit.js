import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
    45, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);
camera.position.set(0, 0, 8); // Position the camera

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.getElementById('container').appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Enable inertia
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 15;

// Lighting (Star acts as light source)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Soft ambient light
scene.add(ambientLight);

const starLight = new THREE.PointLight(0xffffff, 1.5, 100); // Star emits light in all directions
scene.add(starLight);

// Texture Loader
const textureLoader = new THREE.TextureLoader();

// Textures for the planet and background
// const planetTextureURL = '/assets/exoplanet_texture.jpg';
import planetTextureURL from '$images/Kepler-452 b-min.png';
const starfieldTextureURL = '/assets/starfield.jpg';
const planetTexture = textureLoader.load(planetTextureURL);
const starfieldTexture = textureLoader.load(starfieldTextureURL);

// Star (Sun-like host)
const starGeometry = new THREE.SphereGeometry(0.6, 32, 32);
const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc00 }); // Bright yellow star
const star = new THREE.Mesh(starGeometry, starMaterial);
scene.add(star);

// Attach the light to the star object so it moves with it if needed
starLight.position.set(0, 0, 0);

// Planet Geometry and Material
const planetGeometry = new THREE.SphereGeometry(0.3, 64, 64); // Adjusted planet size for scale
const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
    metalness: 0.0,
    roughness: 1.0
});
const planet = new THREE.Mesh(planetGeometry, planetMaterial);
scene.add(planet);

// Starfield Background
const starGeometryBackground = new THREE.SphereGeometry(90, 64, 64);
const starMaterialBackground = new THREE.MeshBasicMaterial({
    map: starfieldTexture,
    side: THREE.BackSide
});
const starField = new THREE.Mesh(starGeometryBackground, starMaterialBackground);
scene.add(starField);

// Variables for orbiting
let orbitRadius = 4;  // The distance of the planet from the star
let orbitSpeed = 0.01; // How fast the planet orbits
let angle = 0;  // Current angle of the planet in its orbit

// Draw Orbit Line (Using a thin ring to simulate the orbit path)
const orbitGeometry = new THREE.RingGeometry(orbitRadius - 0.01, orbitRadius + 0.01, 64);
const orbitMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
});
const orbitLine = new THREE.Mesh(orbitGeometry, orbitMaterial);
orbitLine.rotation.x = Math.PI / 2; // Rotate to match the planet's orbit plane
scene.add(orbitLine);

// Handle Window Resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}, false);

// Animation Loop
const animate = () => {
    requestAnimationFrame(animate);

    // Rotate the planet around the star in a circular orbit
    angle += orbitSpeed; // Increase the angle for rotation
    planet.position.x = orbitRadius * Math.cos(angle);
    planet.position.z = orbitRadius * Math.sin(angle);

    // Rotate the planet around its axis for realism
    planet.rotation.y += 0.01;

    // Update controls for smooth interactions
    controls.update();

    renderer.render(scene, camera);
};

animate();
