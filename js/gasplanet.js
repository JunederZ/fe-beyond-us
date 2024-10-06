// js/gasplanet.js

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Class to encapsulate the Gas Planet functionality
class GasPlanet {
    constructor(containerId, texturePath) {
        this.container = document.getElementById(containerId);
        this.texturePath = texturePath;

        this.scene = new THREE.Scene();

        // Setup Camera
        const fov = 60;
        const aspect = window.innerWidth / window.innerHeight;
        const near = 0.1;
        const far = 2000;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 0, 500); // Position the camera outside the sphere

        // Setup Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);

        // Setup Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = true;
        this.controls.enablePan = true;
        this.controls.rotateSpeed = 0.5;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;

        // Add Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Add Directional Light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);

        // Bind the animate method to the class instance
        this.animate = this.animate.bind(this);

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    // Initialize the scene
    init() {
        // Load Texture
        const loader = new THREE.TextureLoader();
        loader.load(
            this.texturePath,
            (texture) => {
                this.createSphere(texture);
            },
            undefined,
            (error) => {
                console.error('Error loading texture:', error);
            }
        );

        // Optionally, add a background
        const bgLoader = new THREE.TextureLoader();
        bgLoader.load(
            '../textures/starfield.jpg', // Optional: Replace with your own background texture
            (texture) => {
                this.scene.background = texture;
            },
            undefined,
            (error) => {
                console.error('Error loading background texture:', error);
            }
        );
    }

    // Create the sphere with the loaded texture
    createSphere(texture) {
        const geometry = new THREE.SphereGeometry(200, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 10
        });

        const sphere = new THREE.Mesh(geometry, material);
        this.scene.add(sphere);

        // Optional: Add some atmospheric effects or clouds
        // For simplicity, this example uses only the basic sphere
    }

    // Handle window resizing
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Animation loop
    animate() {
        requestAnimationFrame(this.animate);
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize and run the GasPlanet
document.addEventListener('DOMContentLoaded', () => {
    // Replace 'your_texture.jpg' with the actual path to your gas planet texture
    const texturePath = '../images/neptunelike360.jpg';
    const gasPlanet = new GasPlanet('container', texturePath);
    gasPlanet.init();
    gasPlanet.animate();
});
