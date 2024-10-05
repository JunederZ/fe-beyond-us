
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { Noise } from "noisejs";
import * as dat from "dat.gui";
import sky from "../images/sky.jpg";

const noise = new Noise(Math.random());

//skyline
var skyDome;
const skyTexture = new THREE.TextureLoader().load(
  sky,
  () => {
    console.log("sky.png loaded successfully");
    const skyGeo = new THREE.SphereGeometry(3000, 32, 32);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTexture,
      side: THREE.BackSide
    });
    skyDome = new THREE.Mesh(skyGeo, skyMat);
    console.log(skyTexture);
    console.log(skyTexture.image); 

    // skyDome.material.side = THREE.BackSide;
    scene.add(skyDome);
  },
  undefined,
  (err) => {
    console.error("Error loading texture", err);
  }
);

const scene = new THREE.Scene();
// scene.background = new THREE.Color("#2c3e50"); // Initial sky color

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
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
  ambientLightIntensity: 0.5,
  directionalLightIntensity: 1.5,
  cameraHeight: 20,
  // skyColor: "#2c3e50",
};

let param = new URLSearchParams(document.location.search);
console.log(param.get("tColor"));
params.terrainColor = param.get("tColor");
// params.terrainType = param.get("tType");
params.noiseFrequency = parseFloat(param.get("noiseFreq"));
params.maxHeight = parseInt(param.get("maxHeight"));
params.octaves = parseInt(param.get("octaves"));
params.persistence = parseFloat(param.get("per"));
params.lacunarity = parseFloat(param.get("lac"));
params.movementSpeed = parseFloat(param.get("spd"));
// params.fogDensity = parseFloat(param.get("fog"));
params.terrainScale = parseFloat(param.get("tScale"));
// params.ambientLightIntensity = parseFloat(param.get("ambient"));
// params.directionalLightIntensity = parseFloat(param.get("light"));
// params.cameraHeight = parseFloat(param.get("cameraHeight"));


const gui = new dat.GUI();
gui
  .addColor(params, "terrainColor")
  .name("Terrain Color")
  .onChange(updateTerrainMaterial);
gui
  .add(params, "terrainType", ["Gas", "Solid", "Liquid"])
  .name("Terrain Type")
  .onChange(updateTerrainType);
gui
  .add(params, "noiseFrequency", 0.1, 5.0)
  .name("Noise Frequency")
  .onChange(regenerateTerrain);
gui
  .add(params, "maxHeight", 1, 100)
  .name("Max Height")
  .onChange(regenerateTerrain);
gui
  .add(params, "octaves", 1, 10, 1)
  .name("Octaves")
  .onChange(regenerateTerrain);
gui
  .add(params, "persistence", 0.1, 1.0)
  .name("Persistence")
  .onChange(regenerateTerrain);
gui
  .add(params, "lacunarity", 1.0, 4.0)
  .name("Lacunarity")
  .onChange(regenerateTerrain);
gui
  .add(params, "terrainScale", 0.1, 5.0)
  .name("Terrain Scale")
  .onChange(regenerateTerrain);
gui
  .add(params, "wireframe")
  .name("Wireframe Mode")
  .onChange(updateWireframeMode);
gui.add(params, "movementSpeed", 100, 1000).name("Movement Speed");
gui
  .add(params, "fogDensity", 0.0001, 0.01)
  .name("Fog Density")
  .onChange(updateFogDensity);
gui
  .add(params, "ambientLightIntensity", 0, 2.0)
  .name("Ambient Light")
  .onChange(updateLights);
gui
  .add(params, "directionalLightIntensity", 0, 3.0)
  .name("Directional Light")
  .onChange(updateLights);
gui
  .add(params, "cameraHeight", 1, 100)
  .name("Camera Height")
  .onChange(updateCameraHeight);

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

const controls = new PointerLockControls(camera, document.body);
scene.add(controls.object);

const blocker = document.getElementById("blocker");
const instructions = document.getElementById("instructions");

instructions.addEventListener("click", function () {
  controls.lock();
});

controls.addEventListener("lock", function () {
  instructions.style.display = "none";
  blocker.style.display = "none";
});

controls.addEventListener("unlock", function () {
  blocker.style.display = "block";
  instructions.style.display = "";
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

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

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

// function generateChunk(chunkX, chunkZ) {
//   const geometry = new THREE.PlaneGeometry(CHUNK_SIZE, CHUNK_SIZE, 49, 49);
//   geometry.rotateX(-Math.PI / 2);

//   const positions = geometry.attributes.position.array;
//   for (let i = 0; i < positions.length; i += 3) {
//     const x = positions[i] + chunkX * CHUNK_SIZE;
//     const z = positions[i + 2] + chunkZ * CHUNK_SIZE;

//     let y = 0;

//     let amplitudeMountain = 20;
//     let frequencyMountain = 0.1; // Lower frequency for large features

//     let amplitudeRock = 2;
//     let frequencyRock = 10; // Higher frequency for finer details

//     y +=
//       amplitudeMountain *
//       noise.perlin2(
//         (x * frequencyMountain) / 100,
//         (z * frequencyMountain) / 100
//       );

//     y +=
//       amplitudeRock *
//       noise.perlin2((x * frequencyRock) / 100, (z * frequencyRock) / 100);

//     // You can tweak `y` scaling here
//     y *= params.maxHeight * params.terrainScale;

//     positions[i + 1] = y;
//   }

//   geometry.computeVertexNormals();

//   const material = new THREE.MeshLambertMaterial({
//     color: params.terrainColor,
//     wireframe: params.wireframe,
//   });

//   const chunkMesh = new THREE.Mesh(geometry, material);
//   chunkMesh.position.set(chunkX * CHUNK_SIZE, 0, chunkZ * CHUNK_SIZE);

//   scene.add(chunkMesh);

//   const key = `${chunkX},${chunkZ}`;
//   chunks.set(key, chunkMesh);
// }

function updateChunks() {
  const playerX = controls.object.position.x;
  const playerZ = controls.object.position.z;

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

function updateMovement(delta) {
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  velocity.y -= velocity.y * 10.0 * delta;

  direction.z = (keysPressed["KeyW"] ? 1 : 0) - (keysPressed["KeyS"] ? 1 : 0);
  direction.x = (keysPressed["KeyD"] ? 1 : 0) - (keysPressed["KeyA"] ? 1 : 0);
  direction.normalize();

  if (keysPressed["KeyW"] || keysPressed["KeyS"])
    velocity.z -= direction.z * params.movementSpeed * delta;
  if (keysPressed["KeyA"] || keysPressed["KeyD"])
    velocity.x -= direction.x * params.movementSpeed * delta;

  // if (keysPressed['Space']) velocity.y += params.movementSpeed * delta;
  // if (keysPressed['ShiftLeft'] || keysPressed['ShiftRight']) velocity.y -= params.movementSpeed * delta;

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);
  // controls.object.position.y += velocity.y * delta;

  const raycaster = new THREE.Raycaster();
  raycaster.set(controls.object.position, new THREE.Vector3(0, -1, 0)); // Downward ray
  const intersects = raycaster.intersectObjects([...chunks.values()]);

  if (intersects.length > 0) {
    const terrainHeight = intersects[0].point.y;
    controls.object.position.y = terrainHeight + params.cameraHeight; // Adjust for camera height above terrain
  }
}

function updateTerrainMaterial() {
  for (const chunk of chunks.values()) {
    chunk.material.color.set(params.terrainColor);
  }
}

function updateTerrainType() {
  switch (params.terrainType) {
    case "Solid":
      scene.fog = new THREE.FogExp2(
        0x2c3e50,
        params.fogDensity
      );
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

function updateWireframeMode() {
  for (const chunk of chunks.values()) {
    chunk.material.wireframe = params.wireframe;
  }
}

function updateFogDensity() {
  if (scene.fog) {
    scene.fog.density = params.fogDensity;
  }
}

function updateLights() {
  ambientLight.intensity = params.ambientLightIntensity;
  directionalLight.intensity = params.directionalLightIntensity;
}

function updateCameraHeight() {
  controls.object.position.y = params.cameraHeight;
}

updateTerrainType();
updateLights();
updateCameraHeight();

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (controls.isLocked) {
    updateMovement(delta);
    updateChunks();
  }
  skyDome.position.copy(camera.position);

  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
