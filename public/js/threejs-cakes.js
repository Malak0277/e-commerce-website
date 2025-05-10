// Add Three.js via CDN in your HTML or ensure it's loaded before this script
// <script src="https://cdn.jsdelivr.net/npm/three@0.153.0/build/three.min.js"></script>

(function() {
  // Get the container
  const container = document.getElementById('threejs-canvas');
  if (!container) return;

  // Set up scene, camera, renderer
  const scene = new THREE.Scene();
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 18;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setClearColor(0x000000, 0); // transparent
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);
  const dirLight = new THREE.DirectionalLight(0xffb3cc, 0.7);
  dirLight.position.set(0, 10, 10);
  scene.add(dirLight);

  // Cake colors
  const cakeColors = [0xffb3cc, 0xffe0eb, 0xffffff, 0xf9eaed];

  // Create floating cakes (cylinders)
  const cakes = [];
  for (let i = 0; i < 7; i++) {
    const cakeHeight = 1.2 + Math.random() * 0.7;
    const cakeRadius = 1.2 + Math.random() * 0.5;
    const geometry = new THREE.CylinderGeometry(cakeRadius, cakeRadius, cakeHeight, 32);
    const material = new THREE.MeshPhongMaterial({ color: cakeColors[i % cakeColors.length] });
    const cake = new THREE.Mesh(geometry, material);
    cake.position.x = (Math.random() - 0.5) * 12;
    cake.position.y = (Math.random() - 0.5) * 4;
    cake.position.z = (Math.random() - 0.5) * 4;
    cake.rotation.x = Math.random() * Math.PI;
    cake.rotation.y = Math.random() * Math.PI;
    scene.add(cake);
    cakes.push({ mesh: cake, floatSpeed: 0.5 + Math.random(), baseY: cake.position.y });

    // Add "icing" (a slightly smaller, thin cylinder on top)
    const icingGeo = new THREE.CylinderGeometry(cakeRadius * 0.95, cakeRadius * 0.95, 0.25, 32);
    const icingMat = new THREE.MeshPhongMaterial({ color: 0xff79ac });
    const icing = new THREE.Mesh(icingGeo, icingMat);
    icing.position.y = cakeHeight / 2 + 0.13;
    cake.add(icing);
  }

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    const t = Date.now() * 0.001;
    cakes.forEach((cake, i) => {
      cake.mesh.rotation.y += 0.01 + i * 0.002;
      cake.mesh.rotation.x += 0.005 + i * 0.001;
      cake.mesh.position.y = cake.baseY + Math.sin(t * cake.floatSpeed + i) * 0.7;
    });
    renderer.render(scene, camera);
  }
  animate();

  // Responsive resize
  window.addEventListener('resize', () => {
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})(); 