import * as THREE from 'three';

let scene, camera, renderer, lensGroup;
const parts = [];

export function initThreeJS() {
  const canvas = document.querySelector('#webgl-canvas');
  if (!canvas) return;

  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xFAFAFA, 0.015);

  // Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 18;

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Improved Lighting for creative DSLR
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); 
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3.5);
  directionalLight.position.set(5, 10, 10);
  scene.add(directionalLight);

  const fillLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
  fillLight.position.set(-10, -5, 5);
  scene.add(fillLight);
  
  const rimLight = new THREE.DirectionalLight(0xd4af37, 3.0); // gold rim light
  rimLight.position.set(0, 5, -15);
  scene.add(rimLight);

  // --- Create the Creative DSLR Camera ---
  lensGroup = new THREE.Group();

  // Materials
  const matteBodyMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f1f1f, // sleek matte charcoal
    roughness: 0.8,
    metalness: 0.2
  });

  const gripMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111, // darker textured grip
    roughness: 0.95,
    metalness: 0.05
  });

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xD4AF37, // Velune gold
    roughness: 0.1,
    metalness: 0.95
  });
  
  const darkMetalMaterial = new THREE.MeshStandardMaterial({
    color: 0x151515,
    roughness: 0.3,
    metalness: 0.8
  });

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0a0a0a,
    metalness: 0.9,
    roughness: 0.05,
    envMapIntensity: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transparent: true,
    opacity: 0.9,
    reflectivity: 1.0,
    ior: 1.5
  });

  // Helper to add parts with XYZ explosion offsets
  function addPart(mesh, targetPos, explodeOffset) {
    mesh.position.set(
      targetPos.x + explodeOffset.x,
      targetPos.y + explodeOffset.y,
      targetPos.z + explodeOffset.z
    );
    lensGroup.add(mesh);
    parts.push({ mesh, targetPos });
  }

  // 1. DSLR Main Body
  const bodyGeo = new THREE.BoxGeometry(4.8, 3.2, 1.8);
  const bodyMesh = new THREE.Mesh(bodyGeo, matteBodyMaterial);
  addPart(bodyMesh, {x: 0, y: 0, z: 0}, {x: -2, y: -2, z: -5});

  // 2. Ergo Hand Grip (Right Side)
  const gripGeo = new THREE.CylinderGeometry(0.8, 0.8, 3.2, 32);
  const gripMesh = new THREE.Mesh(gripGeo, gripMaterial);
  gripMesh.position.x = 2.4;
  gripMesh.position.z = 0.4;
  addPart(gripMesh, {x: 2.1, y: 0, z: 0.5}, {x: 5, y: -3, z: 2});

  // 3. Pentaprism (Top Bump)
  // Using a 4-sided cylinder to create a trapezoidal prism shape
  const pentaGeo = new THREE.CylinderGeometry(0.8, 1.6, 1.2, 4);
  const pentaMesh = new THREE.Mesh(pentaGeo, matteBodyMaterial);
  pentaMesh.rotation.y = Math.PI / 4; // align the 4 sides
  addPart(pentaMesh, {x: 0, y: 2.1, z: 0}, {x: 0, y: 8, z: -2});

  // 4. Viewfinder Eyepiece (Back of Pentaprism)
  const eyepieceGeo = new THREE.BoxGeometry(0.8, 0.6, 0.4);
  const eyepieceMesh = new THREE.Mesh(eyepieceGeo, darkMetalMaterial);
  addPart(eyepieceMesh, {x: 0, y: 2.0, z: -0.9}, {x: 0, y: 5, z: -6});

  // 5. Hot Shoe (Top of Pentaprism)
  const hotShoeGeo = new THREE.BoxGeometry(0.6, 0.1, 0.6);
  const hotShoeMesh = new THREE.Mesh(hotShoeGeo, darkMetalMaterial);
  addPart(hotShoeMesh, {x: 0, y: 2.75, z: 0}, {x: 0, y: 10, z: 0});

  // 6. Mode Dial (Top Left)
  const modeDialGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.3, 32);
  const modeDialMesh = new THREE.Mesh(modeDialGeo, darkMetalMaterial);
  addPart(modeDialMesh, {x: -1.6, y: 1.7, z: 0}, {x: -4, y: 6, z: 1});

  // 7. Shutter Button (On top of grip)
  const shutterGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.15, 32);
  const shutterMesh = new THREE.Mesh(shutterGeo, goldMaterial); // Gold accent!
  // Angle it slightly forward like a real DSLR
  shutterMesh.rotation.x = 0.2;
  addPart(shutterMesh, {x: 2.3, y: 1.65, z: 1.0}, {x: 6, y: 5, z: 4});

  // 8. Lens Mount Base (Thick)
  const mountGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.5, 64);
  const mountMesh = new THREE.Mesh(mountGeo, darkMetalMaterial);
  mountMesh.rotation.x = Math.PI / 2;
  addPart(mountMesh, {x: 0, y: 0.1, z: 1.1}, {x: 0, y: 0, z: 3});

  // 9. Main Professional Lens Barrel
  const lensBarrelGeo = new THREE.CylinderGeometry(1.65, 1.65, 2.0, 64);
  const lensBarrelMesh = new THREE.Mesh(lensBarrelGeo, matteBodyMaterial);
  lensBarrelMesh.rotation.x = Math.PI / 2;
  addPart(lensBarrelMesh, {x: 0, y: 0.1, z: 2.3}, {x: 0, y: 0, z: 6});

  // 10. Lens Focus Ring (Textured)
  const focusRingGeo = new THREE.TorusGeometry(1.68, 0.1, 16, 100);
  const focusRingMesh = new THREE.Mesh(focusRingGeo, darkMetalMaterial);
  addPart(focusRingMesh, {x: 0, y: 0.1, z: 2.5}, {x: 0, y: 0, z: 7});

  // 11. Signature Gold Accent Ring (like Canon Red Ring, but Velune Gold)
  const goldRingGeo = new THREE.CylinderGeometry(1.68, 1.68, 0.15, 64);
  const goldRingMesh = new THREE.Mesh(goldRingGeo, goldMaterial);
  goldRingMesh.rotation.x = Math.PI / 2;
  addPart(goldRingMesh, {x: 0, y: 0.1, z: 3.2}, {x: 0, y: 0, z: 8});

  // 12. Front Lens Hood / Outer Rim
  const hoodGeo = new THREE.CylinderGeometry(1.8, 1.65, 0.5, 64);
  const hoodMesh = new THREE.Mesh(hoodGeo, matteBodyMaterial);
  hoodMesh.rotation.x = Math.PI / 2;
  addPart(hoodMesh, {x: 0, y: 0.1, z: 3.5}, {x: 0, y: 0, z: 9});

  // 13. Huge Convex Glass Element
  const glassLensGeo = new THREE.SphereGeometry(1.5, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.3);
  const glassLensMesh = new THREE.Mesh(glassLensGeo, glassMaterial);
  glassLensMesh.rotation.x = -Math.PI / 2;
  addPart(glassLensMesh, {x: 0, y: 0.1, z: 2.6}, {x: 0, y: 0, z: 12});

  // 14. Brand Plate (Small rectangle near pentaprism)
  const plateGeo = new THREE.BoxGeometry(1.0, 0.3, 0.1);
  const plateMesh = new THREE.Mesh(plateGeo, darkMetalMaterial);
  // Angle it slightly to match the pentaprism slope
  plateMesh.rotation.x = -0.3;
  addPart(plateMesh, {x: 0, y: 1.6, z: 1.25}, {x: 0, y: 4, z: 4});

  scene.add(lensGroup);

  // Initial positioning - Centered for the intro
  lensGroup.position.set(0, 1.5, 0); // High up to leave room for text
  lensGroup.rotation.y = -Math.PI / 6; // Angled to show off the grip and large lens
  lensGroup.rotation.x = 0.15;

  // Window Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Animation Loop for idle floating
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    
    // Gentle floating effect
    lensGroup.position.y = lensGroup.userData.baseY !== undefined ? lensGroup.userData.baseY + Math.sin(elapsedTime * 0.5) * 0.2 : 1.5 + Math.sin(elapsedTime * 0.5) * 0.2;
    lensGroup.position.x = lensGroup.userData.baseX !== undefined ? lensGroup.userData.baseX + Math.sin(elapsedTime * 0.3) * 0.1 : 0 + Math.sin(elapsedTime * 0.3) * 0.1;
    
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
  };
  tick();

  return { lensGroup, parts };
}
