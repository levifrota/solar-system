// Arquivo JS para o sistema solar
import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
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
  moon: textureLoader.load('textures/moon.jpg'),
  mars: textureLoader.load('textures/mars.jpg'),
  jupiter: textureLoader.load('textures/jupiter.jpg'),
  europa: textureLoader.load('textures/europa.jpg'),
  ganymede: textureLoader.load('textures/ganymede.jpg'),
  io: textureLoader.load('textures/io.jpg'),
  callisto: textureLoader.load('textures/callisto.jpg'),
  saturn: textureLoader.load('textures/saturn.jpg'),
  saturnRings: textureLoader.load('textures/saturn_ring.png'),
  uranus: textureLoader.load('textures/uranus.jpg'),
  uranusRings: textureLoader.load('textures/uranus_ring.png'),
  neptune: textureLoader.load('textures/neptune.jpg'),
};

// Criando corpos celestes
const createPlanet = (size, texture, x) => {
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = x;
  return mesh;
};

const createMoon = (size, texture, distance, speed) => {
  const geometry = new THREE.SphereGeometry(size, 16, 16);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = distance;
  mesh.orbitSpeed = speed;
  return mesh;
};

const moon = createMoon(0.3, textures.moon, 2.5, 0.005); // Lua da Terra
const io = createMoon(0.3, textures.io, 3, 0.005); // Lua Ío
const europa = createMoon(0.3, textures.europa, 4, 0.004); // Lua Europa
const ganymede = createMoon(0.4, textures.ganymede, 5, 0.003); // Lua Ganimedes
const callisto = createMoon(0.4, textures.callisto, 6, 0.002); // Lua Calisto

const sun = createPlanet(5, textures.sun, 0);
scene.add(sun);

let speedMultiplier = 10;

// Adiciona as configurações de cada planeta
const planets = [
  {
    mesh: createPlanet(0.5, textures.mercury, 8),
    distance: 8,
    speed: 0.02 * speedMultiplier,
    baseSpeed: 0.02,
    name: 'mercury',
  },
  {
    mesh: createPlanet(0.7, textures.venus, 12),
    distance: 12,
    speed: 0.015 * speedMultiplier,
    baseSpeed: 0.015,
    name: 'venus',
  },
  {
    mesh: createPlanet(0.8, textures.earth, 16),
    distance: 16,
    speed: 0.01 * speedMultiplier,
    baseSpeed: 0.01,
    name: 'earth',
  },
  {
    mesh: createPlanet(0.6, textures.mars, 20),
    distance: 20,
    speed: 0.008 * speedMultiplier,
    baseSpeed: 0.008,
    name: 'mars',
  },
  {
    mesh: createPlanet(2, textures.jupiter, 28),
    distance: 28,
    speed: 0.005 * speedMultiplier,
    baseSpeed: 0.005,
    name: 'jupiter',
  },
  {
    mesh: createPlanet(1.5, textures.saturn, 36),
    distance: 36,
    speed: 0.004 * speedMultiplier,
    baseSpeed: 0.004,
    rings: true,
    name: 'saturn',
  },
  {
    mesh: createPlanet(1.2, textures.uranus, 44),
    distance: 44,
    speed: 0.003 * speedMultiplier,
    baseSpeed: 0.003,
    rings: true,
    name: 'uranus',
  },
  {
    mesh: createPlanet(1.1, textures.neptune, 52),
    distance: 52,
    speed: 0.002 * speedMultiplier,
    baseSpeed: 0.002,
    name: 'neptune',
  },
];

// Cria as trajetórias dos planetas
planets.forEach((planet) => {
  scene.add(planet.mesh);
  const trajectoryGeometry = new THREE.RingGeometry(
    planet.distance - 0.05,
    planet.distance + 0.05,
    64
  );
  const trajectoryMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
  });
  const trajectory = new THREE.Mesh(trajectoryGeometry, trajectoryMaterial);
  trajectory.rotation.x = Math.PI / 2;
  trajectory.name = `orbit-${planet.name}`; // Nomeia a órbita para controle posterior
  scene.add(trajectory);

  // Adiciona os anéis em Saturno e Urano
  if (planet.rings) {
    if (planet.name === 'saturn') {
      const ringGeometry = new THREE.RingGeometry(2, 3, 128);
      const ringMaterial = new THREE.MeshStandardMaterial({
        map: textures.saturnRings,
        side: THREE.DoubleSide,
        transparent: true,
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
        transparent: true,
      });
      const uranusRings = new THREE.Mesh(ringGeometry, ringMaterial);
      uranusRings.rotation.x = Math.PI / 2;
      planet.ringsMesh = uranusRings;
      planet.mesh.add(uranusRings);
    }
  }
});

const earth = planets.find((planet) => planet.name === 'earth');
earth.mesh.add(moon);

const jupiter = planets.find((planet) => planet.name === 'jupiter');
jupiter.mesh.add(io);
jupiter.mesh.add(europa);
jupiter.mesh.add(ganymede);
jupiter.mesh.add(callisto);

// Configuração inicial da câmera
camera.position.set(40, 20, 60);

let selectedPlanet = null;
let selectedPlanetOrbitAngle = 0; // Ângulo inicial da órbita do planeta selecionado

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onPlanetClick = (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(planets.map((p) => p.mesh));
  if (intersects.length > 0) {
    const clickedPlanet = intersects[0].object;
    const planetData = planets.find((p) => p.mesh === clickedPlanet);
    if (planetData) {
      showPlanetInfo(planetData.name);
    }
  }
};

window.addEventListener('click', onPlanetClick);

// Animação
const animate = () => {
  requestAnimationFrame(animate);

  sun.rotation.y += 0.001;
  planets.forEach((planet) => {
    planet.mesh.rotation.y += 0.01;
    const angle = Date.now() * 0.001 * planet.speed;
    planet.mesh.position.x = Math.cos(angle) * planet.distance;
    planet.mesh.position.z = Math.sin(angle) * planet.distance;
    
    if (selectedPlanet === planet.mesh) {
      selectedPlanetOrbitAngle = angle;
    }

    if (planet.name === 'earth') {
      const moonAngle = Date.now() * 0.001 * moon.orbitSpeed;
      moon.position.x = Math.cos(moonAngle) * 2.5;
      moon.position.z = Math.sin(moonAngle) * 2.5;
    }

    if (planet.name === 'venus') {
      planet.mesh.rotation.y -= 0.02;
    }

    if (planet.name === 'jupiter') {
      const ioAngle = Date.now() * 0.001 * io.orbitSpeed;
      const europaAngle = Date.now() * 0.001 * europa.orbitSpeed;
      const ganymedeAngle = Date.now() * 0.001 * ganymede.orbitSpeed;
      const calistoAngle = Date.now() * 0.001 * callisto.orbitSpeed;

      io.position.x = Math.cos(ioAngle) * 2.5;
      io.position.z = Math.sin(ioAngle) * 2.5;

      europa.position.x = Math.cos(europaAngle) * 4.5;
      europa.position.z = Math.sin(europaAngle) * 4.5;

      ganymede.position.x = Math.cos(ganymedeAngle) * 5.1;
      ganymede.position.z = Math.sin(ganymedeAngle) * 5.1;

      callisto.position.x = Math.cos(calistoAngle) * 6.2;
      callisto.position.z = Math.sin(calistoAngle) * 6.2;
    }
  });

  // Acompanhamento da câmera
  if (selectedPlanet) {
    const planetInfo = planets.find((p) => p.mesh === selectedPlanet);
    if (planetInfo) {
      const radius = planetInfo.distance;
      const cameraOffset = new THREE.Vector3(3, 2, 3);
      const angle = selectedPlanetOrbitAngle;

      const cameraX = Math.cos(angle) * (radius + cameraOffset.x);
      const cameraZ = Math.sin(angle) * (radius + cameraOffset.z);
      const cameraY = cameraOffset.y;

      camera.position.lerp(new THREE.Vector3(cameraX, cameraY, cameraZ), 0.05);
      camera.lookAt(selectedPlanet.position);
    }
  }
  
  controls.update();
  renderer.render(scene, camera);
};

animate();

// Informações dos planetas
const planetInfos = [
  {
    name: 'Mercúrio',
    identify: 'mercury',
    description: {
      type: 'Rochoso',
      equatorialRadius: 2439.7,
      mass: 3.301e23,
      gravity: 3.7,
      distanceFromSun: 57.91e6,
      rotationTime: 1406.4,
      translationTime: 88,
    },
  },
  {
    name: 'Vênus',
    identify: 'venus',
    description: {
      type: 'Rochoso',
      equatorialRadius: 6051.8,
      mass: 4.867e24,
      gravity: 8.87,
      distanceFromSun: 108.2e6,
      rotationTime: -5832,
      translationTime: 225,
    },
  },
  {
    name: 'Terra',
    identify: 'earth',
    description: {
      type: 'Rochoso',
      equatorialRadius: 6371,
      mass: 5.972e24,
      gravity: 9.8,
      distanceFromSun: 149.6e6,
      rotationTime: 24,
      translationTime: 365,
    },
  },
  {
    name: 'Marte',
    identify: 'mars',
    description: {
      type: 'Rochoso',
      equatorialRadius: 3389.5,
      mass: 6.417e23,
      gravity: 3.71,
      distanceFromSun: 227.9e6,
      rotationTime: 24.7,
      translationTime: 687,
    },
  },
  {
    name: 'Júpiter',
    identify: 'jupiter',
    description: {
      type: 'Gasoso',
      equatorialRadius: 69911,
      mass: 1.898e27,
      gravity: 24.79,
      distanceFromSun: 778.5e6,
      rotationTime: 9.84,
      translationTime: 4333,
    },
  },
  {
    name: 'Saturno',
    identify: 'saturn',
    description: {
      type: 'Gasoso',
      equatorialRadius: 58232,
      mass: 5.683e26,
      gravity: 10.44,
      distanceFromSun: 1.434e9,
      rotationTime: 10.8,
      translationTime: 10759,
    },
  },
  {
    name: 'Urano',
    identify: 'uranus',
    description: {
      type: 'Gasoso',
      equatorialRadius: 25362,
      mass: 8.681e25,
      gravity: 8.87,
      distanceFromSun: 2.871e9,
      rotationTime: -17.3,
      translationTime: 30687,
    },
  },
  {
    name: 'Netuno',
    identify: 'neptune',
    description: {
      type: 'Gasoso',
      equatorialRadius: 24622,
      mass: 1.024e26,
      gravity: 11.15,
      distanceFromSun: 4.495e9,
      rotationTime: 16.1,
      translationTime: 60190,
    },
  },
];

// Elementos de informações
const infoDiv = document.getElementById('informations');
const infoPlanetName = document.getElementById('planetName');
const infoPlanetType = document.getElementById('type');
const infoPlanetEquatorialRadius = document.getElementById('equatorialRadius');
const infoPlanetMass = document.getElementById('mass');
const infoPlanetGravity = document.getElementById('gravity');
const infoPlanetDistanceFromSun = document.getElementById('distanceFromSun');
const infoPlanetRotationTime = document.getElementById('rotationTime');
const infoPlanetTranslationTime = document.getElementById('translationTime');

const viewMode = () => {
  camera.position.set(40, 20, 60);
  selectedPlanet = null;
  infoDiv.classList.remove('active');
  showInfoPlanet = null;
};

let showInfoPlanet = null;

const showPlanetInfo = (planetName) => {
  const planet = planetInfos.find((p) => p.identify === planetName);
  if (!planet) return;

  if (showInfoPlanet === planetName) {
    infoDiv.classList.remove('active');
    showInfoPlanet = null;
  } else {
    infoPlanetName.textContent = planet.name;
    infoPlanetType.textContent = `Tipo: ${planet.description.type}`;
    infoPlanetEquatorialRadius.textContent = `Raio Equatorial: ${planet.description.equatorialRadius} km`;
    infoPlanetMass.textContent = `Massa: ${planet.description.mass} kg`;
    infoPlanetGravity.textContent = `Gravidade: ${planet.description.gravity} m/s²`;
    infoPlanetDistanceFromSun.textContent = `Distância do Sol: ${planet.description.distanceFromSun} km`;
    infoPlanetRotationTime.textContent = `Tempo de Rotação: ${planet.description.rotationTime} horas`;
    infoPlanetTranslationTime.textContent = `Tempo de Translação: ${planet.description.translationTime} dias`;
    infoDiv.classList.add('active');
    showInfoPlanet = planetName;

    const selectedPlanetInScene = planets.find(
      (p) => p.name === planet.identify
    );

    // Trava a câmera na posição do planeta selecionado
    if (selectedPlanetInScene) {
      selectedPlanet = selectedPlanetInScene.mesh;

      const planetPosition = selectedPlanetInScene.mesh.position;
      const cameraOffset = new THREE.Vector3(3, 2, 3);
      camera.position.set(
        planetPosition.x + cameraOffset.x,
        planetPosition.y + cameraOffset.y,
        planetPosition.z + cameraOffset.z
      );
      camera.lookAt(planetPosition);
    }
  }
};

// Botões dos planetas
const planetButtons = document.querySelectorAll('#planetButtons button');

planetButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showPlanetInfo(button.id);
  });
});

// Botão  para mostrar a vista geral
const buttonView = document.querySelectorAll('#botaoView');
buttonView.forEach((button) => {
  button.addEventListener('click', viewMode);
});

// Botões para mudar velocidade dos planetas
const speedUpBtn = document.getElementById('speedUp');
const speedDownBtn = document.getElementById('speedDown');
const speedDisplay = document.getElementById('speedDisplay');

function updatePlanetSpeeds() {
  planets.forEach((planet) => {
    planet.speed = planet.baseSpeed * speedMultiplier;
  });
  speedDisplay.textContent = speedMultiplier / 10;
}

// Botão de aumentar velocidade
speedUpBtn.addEventListener('click', () => {
  speedMultiplier += 10;
  updatePlanetSpeeds();
});

// Botão de diminuir velocidade
speedDownBtn.addEventListener('click', () => {
  if (speedMultiplier > 1) {
    speedMultiplier -= 10;
    updatePlanetSpeeds();
  }
});

// Acionar botões do teclado para aumentar e diminuir velocidade
window.addEventListener('keydown', (e) => {
  // Acionar botões de "+", "=" ou seta para cima para aumentar a velocidade
  if (e.key === '+' || e.key === '=' || e.key === 'ArrowUp') {
    speedMultiplier += 10;
    updatePlanetSpeeds();
  }

  // Acionar botões de "-", "_" ou seta para baixo para diminuir a velocidade
  if (e.key === '-' || e.key === '_' || e.key === 'ArrowDown') {
    speedMultiplier = Math.max(10, speedMultiplier - 10);
    updatePlanetSpeeds();
  }
});

let orbitsVisible = true;

const toggleOrbitsVisibility = () => {
  orbitsVisible = !orbitsVisible; // Inverte o estado das órbitas
  planets.forEach((planet) => {
    const trajectory = scene.getObjectByName(`orbit-${planet.name}`);
    if (trajectory) {
      trajectory.visible = orbitsVisible; // Altera a visibilidade da órbita
    }
  });
};

const viewOrbitBtn = document.getElementById('viewOrbit');
viewOrbitBtn.addEventListener('click', toggleOrbitsVisibility);
