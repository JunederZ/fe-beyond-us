import * as THREE from "three";
import { Noise } from "noisejs";
import * as dat from "dat.gui";
import sky from "$images/sky.jpg";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const noise = new Noise(Math.random());

// Skyline
let skyDome;
const skyTexture = new THREE.TextureLoader().load(
  sky,
  () => {
    console.log("sky.png loaded successfully");
    const skyGeo = new THREE.SphereGeometry(3000, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.BackSide,
    });
    skyDome = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyDome);
  },
  undefined,
  (err) => {
    console.error("Error loading texture", err);
  }
);

const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  4000
);
camera.position.set(0, 20, 100);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 1, 0).normalize();
scene.add(light);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const params = {
  terrainColor: "#704214",
  terrainType: "Solid",
  noiseFrequency: 1.0,
  maxHeight: 20,
  octaves: 5,
  persistence: 0.5,
  lacunarity: 2.0,
  movementSpeed: 400.0,
  fogDensity: 0.001,
  terrainScale: 1.0,
  wireframe: false,
  ambientLightIntensity: 2.5,
  directionalLightIntensity: 2.5,
  cameraHeight: 20,
};

let param = new URLSearchParams(document.location.search);
console.log(param.get("tColor"));
params.terrainColor = param.get("tColor");
params.noiseFrequency = parseFloat(param.get("noiseFreq"));
params.maxHeight = parseInt(param.get("maxHeight"));
params.octaves = parseInt(param.get("octaves"));
params.persistence = parseFloat(param.get("per"));
params.lacunarity = parseFloat(param.get("lac"));
params.movementSpeed = parseFloat(param.get("spd"));
params.fogDensity = parseFloat(param.get("fog"));
params.terrainScale = parseFloat(param.get("tScale"));

const gui = new dat.GUI();
gui.hide();

const ambientLight = new THREE.AmbientLight(
  0x404040,
  params.ambientLightIntensity
);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(
  0xf0f0f0,
  params.directionalLightIntensity
);
directionalLight.position.set(-100, 100, -100).normalize();
scene.add(directionalLight);

// Create a rover group and rover object
const roverGroup = new THREE.Object3D();
roverGroup.position.set(0, 0, 0); // Initial position
scene.add(roverGroup);

const rover = new THREE.Object3D();
rover.position.set(0, 0, 0); // Starting position
roverGroup.add(rover);

// Load the rover model
const gltfLoader = new GLTFLoader();
const url = '../images/perseverance.glb';
gltfLoader.load(url, (gltf) => {
  const root = gltf.scene;
  root.scale.set(5, 5, 5);  // Adjust the scale to make the rover larger
  rover.add(root);
});

const keysPressed = {};

document.addEventListener(
  "keydown",
  (event) => {
    keysPressed[event.code] = true;
  },
  false
);

document.addEventListener(
  "keyup",
  (event) => {
    keysPressed[event.code] = false;
  },
  false
);

const controlParams = {
  moveSpeed: 50.0, // Units per second
  rotationSpeed: Math.PI, // Radians per second
};

const CHUNK_SIZE = 100;
const chunks = new Map();

function generateChunk(chunkX, chunkZ) {
  const geometry = new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, 49, 49);
  geometry.rotateX(-Math.PI / 2);

  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i] + chunkX * CHUNK_SIZE;
    const z = positions[i + 2] + chunkZ * CHUNK_SIZE;

    let y = 0;
    let amplitude = 1;
    let frequency = params.noiseFrequency;
    const persistence = params.persistence;
    const lacunarity = params.lacunarity;
    const octaves = params.octaves;

    for (let o = 0; o < octaves; o++) {
      y +=
        amplitude * noise.perlin2((x * frequency) / 100, (z * frequency) / 100);
      amplitude *= persistence;
      frequency *= lacunarity;
    }

    y *= params.maxHeight * params.terrainScale;
    positions[i + 1] = y;
  }

  geometry.computeVertexNormals();

  const material = new THREE.MeshLambertMaterial({
    color: params.terrainColor,
    wireframe: params.wireframe,
  });

  const chunkMesh = new THREE.Mesh(geometry, material);
  chunkMesh.position.set(chunkX * CHUNK_SIZE, 0, chunkZ * CHUNK_SIZE);

  scene.add(chunkMesh);

  const key = `${chunkX},${chunkZ}`;
  chunks.set(key, chunkMesh);
}

function updateChunks() {
  const playerX = rover.position.x;
  const playerZ = rover.position.z;

  const currentChunkX = Math.floor(playerX / CHUNK_SIZE);
  const currentChunkZ = Math.floor(playerZ / CHUNK_SIZE);

  const renderDistance = 6;

  const neededChunks = new Set();

  for (
    let x = currentChunkX - renderDistance;
    x <= currentChunkX + renderDistance;
    x++
  ) {
    for (
      let z = currentChunkZ - renderDistance;
      z <= currentChunkZ + renderDistance;
      z++
    ) {
      const key = `${x},${z}`;
      neededChunks.add(key);
      if (!chunks.has(key)) {
        generateChunk(x, z);
      }
    }
  }

  for (const key of chunks.keys()) {
    if (!neededChunks.has(key)) {
      const chunk = chunks.get(key);
      scene.remove(chunk);
      chunk.geometry.dispose();
      chunk.material.dispose();
      chunks.delete(key);
    }
  }
}

let roverYaw = 0;

function updateRoverMovement(delta) {
  // Forward and Backward Movement
  if (keysPressed["KeyW"]) {
    rover.translateZ(-controlParams.moveSpeed * delta);
  }
  if (keysPressed["KeyS"]) {
    rover.translateZ(controlParams.moveSpeed * delta);
  }

  // Rotation Left and Right
  if (keysPressed["KeyA"]) {
    roverYaw += controlParams.rotationSpeed * delta;
  }
  if (keysPressed["KeyD"]) {
    roverYaw -= controlParams.rotationSpeed * delta;
  }

  // Get the current rover position
  const roverX = rover.position.x;
  const roverZ = rover.position.z;

  // Calculate the terrain height at the rover's (x, z) position
  const terrainHeight = getTerrainHeight(roverX, roverZ);

  // Adjust the rover's y position to stay on the terrain
  const roverHeightOffset = 2; // Adjust based on your rover model
  rover.position.y = terrainHeight + roverHeightOffset;

  // Calculate terrain normal at rover's position
  const terrainNormal = getTerrainNormal(roverX, roverZ);

  // Set the rover's up vector to the terrain normal
  rover.up.copy(terrainNormal);

  // Compute the forward direction based on roverYaw
  const forward = new THREE.Vector3(Math.sin(roverYaw), 0, Math.cos(roverYaw));

  // Project the forward vector onto the plane defined by the terrain normal
  const forwardProjected = forward.clone().projectOnPlane(terrainNormal).normalize();

  // Compute the target position for lookAt
  const targetPosition = new THREE.Vector3().copy(rover.position).add(forwardProjected);

  // Update the rover's rotation to look at the target position
  rover.lookAt(targetPosition);

  updateCameraPosition();
}

function getTerrainNormal(x, z) {
  const delta = 1; // Distance to sample around the point for gradient approximation

  // Heights at the current point and its neighbors
  const heightL = getTerrainHeight(x - delta, z);
  const heightR = getTerrainHeight(x + delta, z);
  const heightD = getTerrainHeight(x, z - delta);
  const heightU = getTerrainHeight(x, z + delta);

  // Calculate the gradient in the x and z directions
  const dx = (heightR - heightL) / (2 * delta);
  const dz = (heightU - heightD) / (2 * delta);

  // The normal vector is perpendicular to the surface
  const normal = new THREE.Vector3(-dx, 1, -dz).normalize();

  return normal;
}

function getTerrainHeight(x, z) {
  let y = 0;
  let amplitude = 1;
  let frequency = params.noiseFrequency;
  const persistence = params.persistence;
  const lacunarity = params.lacunarity;
  const octaves = params.octaves;

  for (let o = 0; o < octaves; o++) {
    y +=
      amplitude * noise.perlin2((x * frequency) / 100, (z * frequency) / 100);
    amplitude *= persistence;
    frequency *= lacunarity;
  }

  y *= params.maxHeight * params.terrainScale;
  return y;
}

function getNearestChunk() {
  const playerX = rover.position.x;
  const playerZ = rover.position.z;

  const currentChunkX = Math.floor(playerX / CHUNK_SIZE);
  const currentChunkZ = Math.floor(playerZ / CHUNK_SIZE);
  const key = `${currentChunkX},${currentChunkZ}`;
  return chunks.get(key);
}

const cameraOffset = new THREE.Vector3(0, 10, 20); // Adjust as needed

function updateCameraPosition() {
  // Calculate the desired camera position
  const desiredPosition = new THREE.Vector3().copy(cameraOffset);
  desiredPosition.applyQuaternion(rover.quaternion);
  desiredPosition.add(rover.position);

  // Smoothly interpolate the camera's position
  camera.position.lerp(desiredPosition, 0.1);
  camera.lookAt(rover.position);
}

function updateTerrainMaterial() {
  for (const chunk of chunks.values()) {
    chunk.material.color.set(params.terrainColor);
  }
}

function updateTerrainType() {
  switch (params.terrainType) {
    case "Solid":
      scene.fog = new THREE.FogExp2(0x2c3e50, params.fogDensity);
      break;
    case "Liquid":
      scene.fog = new THREE.FogExp2(0x0000ff, params.fogDensity); // Blue fog
      break;
    case "Gas":
      scene.fog = new THREE.FogExp2(0x888888, params.fogDensity); // Gray fog
      break;
  }
  regenerateTerrain();
}

function regenerateTerrain() {
  for (const key of chunks.keys()) {
    const chunk = chunks.get(key);
    scene.remove(chunk);
    chunk.geometry.dispose();
    chunk.material.dispose();
    chunks.delete(key);
  }
  updateChunks();
}

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (rover) {
    updateRoverMovement(delta);
  }
  updateChunks();

  if (skyDome) {
    skyDome.position.copy(camera.position);
  }

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
