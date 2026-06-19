import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.177.0/build/three.module.min.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("performance-sphere");
  if (!canvas) return;

  const w = canvas.clientWidth || 260;
  const h = canvas.clientHeight || 260;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.z = 3.5;

  const geometry = new THREE.IcosahedronGeometry(1, 1);

  const sphere = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      color: 0x111111,
      wireframe: true,
      transparent: true,
      opacity: 1,
    }),
  );
  scene.add(sphere);

  const dots = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0x000000,
      size: 0.016,
      transparent: true,
      opacity: 1,
    }),
  );
  scene.add(dots);

  const rotation = { y: 0 };

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (gsap && ScrollTrigger) {
    gsap.to(rotation, {
      y: Math.PI * 4,
      ease: "none",
      scrollTrigger: {
        trigger: "#performance-club",
        start: "top 80%",
        end: "bottom+=400 top",
        scrub: 1.5,
      },
    });
  }

  (function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.y = rotation.y;
    dots.rotation.y = rotation.y;
    renderer.render(scene, camera);
  })();

  new ResizeObserver(() => {
    const nw = canvas.clientWidth;
    const nh = canvas.clientHeight;
    if (!nw || !nh) return;
    renderer.setSize(nw, nh, false);
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
  }).observe(canvas);
});
