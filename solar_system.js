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

let speedMultiplier = 10;

const planets = [
    { mesh: createPlanet(0.5, textures.mercury, 8), distance: 8, speed: 0.02 * speedMultiplier, baseSpeed: 0.02, name: 'mercury' },
    { mesh: createPlanet(0.7, textures.venus, 12), distance: 12, speed: 0.015 * speedMultiplier, baseSpeed: 0.015, name: 'venus' },
    { mesh: createPlanet(0.8, textures.earth, 16), distance: 16, speed: 0.01 * speedMultiplier, baseSpeed: 0.01, name: 'earth' },
    { mesh: createPlanet(0.6, textures.mars, 20), distance: 20, speed: 0.008 * speedMultiplier, baseSpeed: 0.008, name: 'mars' },
    { mesh: createPlanet(2, textures.jupiter, 28), distance: 28, speed: 0.005 * speedMultiplier, baseSpeed: 0.005, name: 'jupiter' },
    { mesh: createPlanet(1.5, textures.saturn, 36), distance: 36, speed: 0.004 * speedMultiplier, baseSpeed: 0.004, rings: true, name: 'saturn' },
    { mesh: createPlanet(1.2, textures.uranus, 44), distance: 44, speed: 0.003 * speedMultiplier, baseSpeed: 0.003, rings: true, name: 'uranus' },  
    { mesh: createPlanet(1.1, textures.neptune, 52), distance: 52, speed: 0.002 * speedMultiplier, baseSpeed: 0.002, name: 'neptune' }
];

var orbit = true

planets.forEach((planet) => {
    scene.add(planet.mesh);
    if (orbit === true) {
        const trajectoryGeometry = new THREE.RingGeometry(planet.distance - 0.05, planet.distance + 0.05, 64);
        const trajectoryMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
        const trajectory = new THREE.Mesh(trajectoryGeometry, trajectoryMaterial);
        trajectory.rotation.x = Math.PI / 2;
        trajectory.name = `orbit-${planet.name}`; // Nomeia a órbita para controle posterior
        scene.add(trajectory);
    }
});

// Configuração inicial da câmera
camera.position.set(40, 20, 60);

let selectedPlanet = null;
let selectedPlanetOrbitAngle = 0; // Ângulo inicial da órbita do planeta selecionado

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onPlanetClick = (event) => {
    console.log("2b")
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(planets.map(p => p.mesh));

    if (intersects.length > 0) {
        selectedPlanet = intersects[0].object;
        selectedPlanetOrbitAngle = 0;
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
    });

    // Acompanhamento da câmera
    if (selectedPlanet) {
        const planetInfo = planets.find(p => p.mesh === selectedPlanet);
        const radius = planetInfo.distance;
        const cameraOffset = new THREE.Vector3(3, 2, 3);

        const cameraX = Math.cos(selectedPlanetOrbitAngle) * (radius + cameraOffset.x);
        const cameraZ = Math.sin(selectedPlanetOrbitAngle) * (radius + cameraOffset.z);
        const cameraY = cameraOffset.y;

        camera.position.lerp(new THREE.Vector3(cameraX, cameraY, cameraZ), 0.05);
        camera.lookAt(selectedPlanet.position);
    }

    controls.update();
    renderer.render(scene, camera);
};

animate();

const planetInfos = [
    {
        nome: "Mercúrio",
        identify: "mercury",
        descricao: "É o planeta mais próximo do Sol e o menor do Sistema Solar. Não possui atmosfera significativa e tem temperaturas extremas, variando de -180°C à noite a 430°C durante o dia. Possui uma rotação lenta, e um dia (do nascer ao pôr do sol) dura cerca de 176 dias terrestres."
    },
    {
        nome: "Vênus",
        identify: "venus",
        descricao: "Vênus, conhecido como o 'irmão gêmeo da Terra' devido ao seu tamanho e composição similares, tem uma atmosfera densa composta principalmente de dióxido de carbono, criando um efeito estufa extremo. A temperatura média na superfície é de cerca de 467°C, tornando-o o planeta mais quente do Sistema Solar."
    },
    {
        nome: "Terra",
        identify: "earth",
        descricao: "Terra é o único planeta conhecido por abrigar vida, devido à sua atmosfera rica em oxigênio e água líquida em sua superfície. Ela tem um campo magnético que protege contra radiações solares prejudiciais. Sua órbita ao redor do Sol leva cerca de 365,25 dias, o que define um ano."
    },
    {
        nome: "Marte",
        identify: "mars",
        descricao: "Marte, conhecido como o 'Planeta Vermelho' devido à sua superfície rica em óxido de ferro, possui a maior montanha do Sistema Solar, o Monte Olimpo, e um sistema de vales e desfiladeiros gigantescos. Marte tem calotas polares de dióxido de carbono e água congelada."
    },
    {
        nome: "Júpiter",
        identify: "jupiter",
        descricao: "Júpiter, o maior planeta do Sistema Solar, tem uma massa mais de 300 vezes maior que a da Terra. É um gigante gasoso composto principalmente de hidrogênio e hélio, e sua Grande Mancha Vermelha é uma tempestade gigante que já dura séculos."
    },
    {
        nome: "Saturno",
        identify: "saturn",
        descricao: "Saturno é famoso pelos seus anéis, compostos de partículas de gelo e rocha. Também é um gigante gasoso, similar a Júpiter, e tem dezenas de luas, incluindo Titã, que possui uma atmosfera densa. O planeta é composto principalmente de hidrogênio e hélio e tem uma gravidade muito baixa."
    },
    {
        nome: "Urano",
        identify: "uranus",
        descricao: "Urano é um gigante gasoso com uma rotação peculiar, já que gira praticamente de lado em relação ao plano da sua órbita. Seu eixo de rotação é inclinado em cerca de 98°, tornando seus dias e estações muito peculiares. É composto principalmente de hidrogênio, hélio e água, amônia e metano, que lhe conferem uma cor azul-esverdeada."
    },
    {
        nome: "Netuno",
        identify: "neptune",
        descricao: "Netuno, o planeta mais distante do Sol e o último do Sistema Solar, possui uma atmosfera composta de hidrogênio, hélio e metano, que lhe dá sua cor azul intensa. Netuno é conhecido por seus ventos extremamente fortes, os mais rápidos do Sistema Solar, e tem uma tempestade permanente chamada Grande Mancha Escura."
    }
];


// Elementos de informações
const infoDiv = document.getElementById("informacoes");
const infoTitle = document.getElementById("infoTitle");
const infoDescription = document.getElementById("infoDescription");
const view = document.getElementById("botaoView");

const viewMode=()=>{
    camera.position.set(40, 20, 60);
    selectedPlanet = null;
}

let showInfoPlanet = null;

const showPlanetInfo = (planetName) => {
    console.log("1a");
    console.log(planetName);

    if (showInfoPlanet === planetName) {
        infoDiv.classList.remove("active");
        showInfoPlanet = null;
        viewMode();
    } else {
        const planet = planetInfos.find((p) => p.identify === planetName);

        if (planet) {
            infoTitle.textContent = planet.nome;
            infoDescription.textContent = planet.descricao;
            infoDiv.classList.add("active");
            showInfoPlanet = planetName;

            const selectedPlanetInScene = planets.find((p) => p.name === planet.identify);
            console.log(selectedPlanetInScene);

            if (selectedPlanetInScene) {
                selectedPlanet = selectedPlanetInScene.mesh;

                const planetPosition = selectedPlanetInScene.mesh.position;
                console.log("4e", planetPosition);

                const cameraOffset = new THREE.Vector3(3, 2, 3);
                camera.position.set(planetPosition.x + cameraOffset.x, planetPosition.y + cameraOffset.y, planetPosition.z + cameraOffset.z);

                camera.lookAt(planetPosition);
            }
        }
    }
};

const planetButtons = document.querySelectorAll('#planetButtons button');

planetButtons.forEach(button => {
    button.addEventListener('click', () => {
        showPlanetInfo(button.id);  
    });
});


const buttonview = document.querySelectorAll("#botaoView");
buttonview.forEach((button) => {
    button.addEventListener("click", viewMode);
})





const velocidadeMaisBtn = document.getElementById("velocidadeMais");
const velocidadeMenosBtn = document.getElementById("velocidadeMenos");
const velocidadeDisplay = document.getElementById("velocidadeDisplay");

function updatePlanetSpeeds() {
    planets.forEach((planet) => {
        planet.speed = planet.baseSpeed * speedMultiplier;
    });
    velocidadeDisplay.textContent = speedMultiplier;
}

// Botão de aumentar velocidade
velocidadeMaisBtn.addEventListener("click", () => {
    speedMultiplier += 10;
    updatePlanetSpeeds();
});

// Botão de diminuir velocidade
velocidadeMenosBtn.addEventListener("click", () => {
    if (speedMultiplier > 1) {
        speedMultiplier -= 10;
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

const viewOrbitBtn = document.getElementById("viewOrbit");
viewOrbitBtn.addEventListener("click", toggleOrbitsVisibility);