// Arquivo JS para o sistema solar
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Luz
const light = new THREE.PointLight(0xffffff, 2, 1000);
light.position.set(0, 0, 0);
scene.add(light);

const ambientLight = new THREE.AmbientLight(0x404040); // luz suave
scene.add(ambientLight);

// Texturas dos planetas
const textureLoader = new THREE.TextureLoader();
const textures = {
    sun: textureLoader.load('textures/sun.jpg'),
    mercury: textureLoader.load('textures/mercury.jpg'),
    venus: textureLoader.load('textures/venus.jpg'),
    earth: textureLoader.load('textures/earth.jpg'),
    mars: textureLoader.load('textures/mars.jpg'),
    jupiter: textureLoader.load('textures/jupiter.jpg'),
    saturn: textureLoader.load('textures/saturn.jpg'),
    saturnRings: textureLoader.load('textures/saturn_ring.png'),
    uranus: textureLoader.load('textures/uranus.jpg'),
    uranusRings: textureLoader.load('textures/uranus_ring.png'),
    neptune: textureLoader.load('textures/neptune.jpg')
};

// Criando corpos celestes
const createPlanet = (size, texture, x) => {
    const geometry = new THREE.SphereGeometry(size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = x;
    return mesh;
};

const sun = createPlanet(5, textures.sun, 0);
scene.add(sun);

const planets = [
    { mesh: createPlanet(0.5, textures.mercury, 8), distance: 8, speed: 0.02 },
    { mesh: createPlanet(0.7, textures.venus, 12), distance: 12, speed: 0.015 },
    { mesh: createPlanet(0.8, textures.earth, 16), distance: 16, speed: 0.01 },
    { mesh: createPlanet(0.6, textures.mars, 20), distance: 20, speed: 0.008 },
    { mesh: createPlanet(2, textures.jupiter, 28), distance: 28, speed: 0.005 },
    { mesh: createPlanet(1.5, textures.saturn, 36), distance: 36, speed: 0.004, rings: true, name: 'saturn' },
    { mesh: createPlanet(1.2, textures.uranus, 44), distance: 44, speed: 0.003, rings: true, name: 'uranus' },  
    { mesh: createPlanet(1.1, textures.neptune, 52), distance: 52, speed: 0.002 }
];

planets.forEach((planet) => {
    scene.add(planet.mesh);

    // Adiciona trajetória
    const trajectoryGeometry = new THREE.RingGeometry(planet.distance - 0.05, planet.distance + 0.05, 64);
    const trajectoryMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
    const trajectory = new THREE.Mesh(trajectoryGeometry, trajectoryMaterial);
    trajectory.rotation.x = Math.PI / 2;
    scene.add(trajectory);

    if (planet.rings) {
      if (planet.name === 'saturn') {
        const ringGeometry = new THREE.RingGeometry(2, 3, 128);
        const ringMaterial = new THREE.MeshStandardMaterial({ 
            map: textures.saturnRings,
            side: THREE.DoubleSide,
            transparent: true
        });
        const saturnRings = new THREE.Mesh(ringGeometry, ringMaterial);
        saturnRings.rotation.x = Math.PI / 2;
        planet.ringsMesh = saturnRings;
        planet.mesh.add(saturnRings);
      } else if (planet.name === 'uranus') {
        const ringGeometry = new THREE.RingGeometry(1.5, 2.5, 128);
        const ringMaterial = new THREE.MeshStandardMaterial({ 
            map: textures.uranusRings,
            side: THREE.DoubleSide,
            transparent: true
        });
        const uranusRings = new THREE.Mesh(ringGeometry, ringMaterial);
        uranusRings.rotation.x = Math.PI / 2;
        planet.ringsMesh = uranusRings;
        planet.mesh.add(uranusRings);
      }
    }
});

camera.position.z = 60;

let targetSpeedMultiplier = 1;
let currentSpeedMultiplier = 1;

window.addEventListener('keydown', (e) => {
    if (e.key === '+' || e.key === '=') targetSpeedMultiplier += 0.1;
    if (e.key === '-' || e.key === '_') targetSpeedMultiplier = Math.max(0.1, targetSpeedMultiplier - 0.1);
    if (e.key === 'ArrowUp') targetSpeedMultiplier += 0.05;
    if (e.key === 'ArrowDown') targetSpeedMultiplier = Math.max(0.1, targetSpeedMultiplier - 0.05);
});

const animate = () => {
    requestAnimationFrame(animate);

    currentSpeedMultiplier += (targetSpeedMultiplier - currentSpeedMultiplier) * 0.1; // Suaviza a transição

    sun.rotation.y += 0.01;
    planets.forEach((planet) => {
        planet.mesh.rotation.y += 0.01; // Rotação própria
        const angle = Date.now() * 0.001 * planet.speed * currentSpeedMultiplier;
        planet.mesh.position.x = Math.cos(angle) * planet.distance;
        planet.mesh.position.z = Math.sin(angle) * planet.distance;
    });

    controls.update();
    renderer.render(scene, camera);
};

animate();
