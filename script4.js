// sistemaSolar.js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.module.js';

export function abrirInfo(planetaNome) {
  const mapaPlanetas = {
    mercurio: 1,
    venus: 2,
    terra: 3,
    marte: 4,
    jupiter: 5,
    saturno: 6,
    urano: 7,
    netuno: 8,
    sol: 0
  };

  const numeroPlaneta = mapaPlanetas[planetaNome];
  if (numeroPlaneta) {
    window.location.href = `planeta${numeroPlaneta}.html`;
  } else {
    console.log('Planeta inválido ou sem página');
  }
}

function criarPlaneta(id, texturaURL, planetaNome) {
  const container = document.getElementById(id);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 3, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  scene.add(directionalLight);

  const texture = new THREE.TextureLoader().load(texturaURL);
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const isSol = planetaNome === 'sol';
  const material = isSol
    ? new THREE.MeshStandardMaterial({
        map: texture,
        emissive: new THREE.Color(0xffff33),
        emissiveIntensity: 1,
        metalness: 0.3,
        roughness: 0.5
      })
    : new THREE.MeshStandardMaterial({
        map: texture,
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.2,
        emissive: new THREE.Color(0x222222),
        emissiveIntensity: 0.3
      });

  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), material);
  sphere.castShadow = !isSol;
  sphere.receiveShadow = true;
  scene.add(sphere);

  let ring = null;

  if (planetaNome === 'terra') {
    const grupoLua = new THREE.Group();
    const texturaLua = new THREE.TextureLoader().load('img/planetas/Lua.jpg');
    const materialLua = new THREE.MeshStandardMaterial({ map: texturaLua });
    const lua = new THREE.Mesh(new THREE.SphereGeometry(0.27, 32, 32), materialLua);
    const textureNuvens = new THREE.TextureLoader().load('img/Nuvens.jpg');
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      map: textureNuvens,
      transparent: true,
      opacity: 0.3,
      depthWrite: false
    });

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.07, 64, 64),
      atmosphereMaterial
    );

    lua.position.set(1.4, 0, 0);
    grupoLua.add(lua);
    sphere.add(grupoLua);
    sphere.add(atmosphere);

    function animate() {
      requestAnimationFrame(animate);

      anguloLuz += 0.002;
      tempo += 0.002;

      directionalLight.position.set(
        Math.sin(anguloLuz) * 5,
        3,
        Math.cos(anguloLuz) * 5
      );

      sphere.rotation.y += 0.0005;
      sphere.position.y = Math.sin(tempo) * 0.05;

      if (ring) ring.rotation.z += 0.0005;

      grupoLua.rotation.y += 0.01;

      renderer.render(scene, camera);
    }
  }

  if (planetaNome === 'venus') {
    const textureNuvens = new THREE.TextureLoader().load('img/atmosferavenus.jpg');
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
      map: textureNuvens,
      transparent: true,
      opacity: 0.4,
      depthWrite: false
    });

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.07, 64, 64),
      atmosphereMaterial
    );

    sphere.add(atmosphere);
  }

  if (planetaNome === 'saturno') {
    const ringGeometry = new THREE.RingGeometry(1.2, 2, 128);
    const ringTexture = new THREE.TextureLoader().load('img/anel.png');

    const uv = ringGeometry.attributes.uv;
    for (let i = 0; i < uv.count; i++) {
      uv.setY(i, 1 - uv.getY(i));
    }

    ring = new THREE.Mesh(
      ringGeometry,
      new THREE.MeshBasicMaterial({
        map: ringTexture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        opacity: 0.5
      })
    );
    ring.rotation.x = THREE.MathUtils.degToRad(96);
    sphere.add(ring);
  }

  camera.position.z = 3;
  container.addEventListener('click', () => abrirInfo(planetaNome));

  let anguloLuz = 0;
  let tempo = 0;

  function animate() {
    requestAnimationFrame(animate);

    anguloLuz += 0.001;
    tempo += 0.001;

    directionalLight.position.set(
      Math.sin(anguloLuz) * 5,
      3,
      Math.cos(anguloLuz) * 5
    );

    sphere.rotation.y += 0.0005;
    sphere.position.y = Math.sin(tempo) * 0.05;

    if (ring) {
      ring.rotation.z += 0.005;
    }

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });
}

// Criar planetas após DOM estar pronta
window.addEventListener('DOMContentLoaded', () => {
  criarPlaneta('mercurio3d', 'img/planetas/Mercurio.jpg', 'mercurio');
  criarPlaneta('venus3d', 'img/planetas/Venus.jpg', 'venus');
  criarPlaneta('terra3d', 'img/planetas/Terra.jpg', 'terra');
  criarPlaneta('marte3d', 'img/planetas/Marte.jpg', 'marte');
  criarPlaneta('jupiter3d', 'img/planetas/Jupiter.jpg', 'jupiter');
  criarPlaneta('saturno3d', 'img/planetas/Saturno.jpg', 'saturno');
  criarPlaneta('urano3d', 'img/planetas/Urano.jpg', 'urano');
  criarPlaneta('netuno3d', 'img/planetas/Netuno.jpg', 'netuno');
  criarPlaneta('sol3d', 'img/planetas/Sol.jpg', 'sol');
});

// Expõe a função abrirInfo para o escopo global, para uso fora do módulo
window.abrirInfo = abrirInfo;


