// ============================================
// IMMERSIVE GRAPHICS SECTION
// Enhanced with More White Dots and 3D Infinite Space
// ============================================

// Global state
const immersiveState = {
    mouse: { x: 0, y: 0, smoothX: 0, smoothY: 0 },
    scroll: 0,
    isHovering: false,
    time: 0
};

// Scene elements
let immersiveScene, immersiveCamera, immersiveRenderer;
let spiral, spaceSquares = [], particles = [];
let particleCanvas, particleCtx;
let rippleCanvas, rippleCtx;
let ripples = [];

// Initialize only if section exists
if (document.getElementById('immersive-graphics')) {
    document.addEventListener('DOMContentLoaded', initImmersive);
}

function initImmersive() {
    // Initialize Three.js
    initImmersiveThreeJS();

    // Initialize particles (more white dots)
    initImmersiveParticles();

    // Initialize ripple effect
    initImmersiveRipples();

    // Event listeners
    addImmersiveEventListeners();

    // Start animation loop
    animateImmersive();
}

// ============================================
// THREE.JS SETUP
// ============================================

function initImmersiveThreeJS() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    // Scene
    immersiveScene = new THREE.Scene();
    immersiveScene.fog = new THREE.Fog(0x0a0a0a, 5, 40);

    // Camera
    immersiveCamera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    immersiveCamera.position.z = 15;

    // Renderer
    immersiveRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    immersiveRenderer.setSize(window.innerWidth, window.innerHeight);
    immersiveRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    immersiveRenderer.setClearColor(0x0a0a0a, 1);

    // Create 3D spiral
    createImmersiveSpiral();

    // Create 3D infinite space with squares
    createInfiniteSpace();

    // Lighting
    addImmersiveLighting();
}

function createImmersiveSpiral() {
    // Create torus knot geometry (spiral-like shape)
    const geometry = new THREE.TorusKnotGeometry(3, 1, 200, 32, 2, 3);

    // Solid pink material
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xff1a75,
        emissive: 0xff006e,
        emissiveIntensity: 0.8,
        metalness: 0.6,
        roughness: 0.15,
        transparent: true,
        opacity: 0.95,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        side: THREE.DoubleSide
    });

    spiral = new THREE.Mesh(geometry, material);
    spiral.rotation.x = Math.PI / 6;
    immersiveScene.add(spiral);
}

function createInfiniteSpace() {
    // Create 3D infinite space with squares (cubes in perspective)
    const squareGeometry = new THREE.BoxGeometry(2, 2, 0.1);
    const squareMaterial = new THREE.MeshBasicMaterial({
        color: 0xff006e,
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });

    // Create grid of squares at different depths
    const gridSize = 8;
    const spacing = 6;
    const depthLayers = 15;

    for (let layer = 0; layer < depthLayers; layer++) {
        for (let x = -gridSize / 2; x < gridSize / 2; x++) {
            for (let y = -gridSize / 2; y < gridSize / 2; y++) {
                const square = new THREE.Mesh(squareGeometry, squareMaterial.clone());
                square.position.x = x * spacing;
                square.position.y = y * spacing;
                square.position.z = -layer * spacing - 20;

                // Store initial z position for infinite loop
                square.userData.initialZ = square.position.z;
                square.userData.speed = 0.1 + Math.random() * 0.05;

                spaceSquares.push(square);
                immersiveScene.add(square);
            }
        }
    }
}

function addImmersiveLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    immersiveScene.add(ambientLight);

    // Point lights for pink glow
    const pointLight1 = new THREE.PointLight(0xff006e, 2, 50);
    pointLight1.position.set(5, 5, 10);
    immersiveScene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff1aff, 1.5, 50);
    pointLight2.position.set(-5, -5, 10);
    immersiveScene.add(pointLight2);

    // Directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 10, 10);
    immersiveScene.add(directionalLight);
}

// ============================================
// PARTICLE SYSTEM (MORE WHITE DOTS)
// ============================================

function initImmersiveParticles() {
    particleCanvas = document.getElementById('particle-canvas');
    if (!particleCanvas) return;

    particleCtx = particleCanvas.getContext('2d');

    // Set canvas size
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;

    // Create more particles with 70% white
    const particleCount = Math.min(400, window.innerWidth / 3);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 3 + 1,
            // 70% white, 30% pink
            color: Math.random() > 0.3 ? 'rgba(240, 240, 240, 0.8)' : 'rgba(255, 0, 110, 0.8)',
            parallaxSpeed: Math.random() * 0.05 + 0.02
        });
    }
}

function updateImmersiveParticles() {
    if (!particleCtx) return;

    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    // Smooth mouse position
    immersiveState.mouse.smoothX += (immersiveState.mouse.x - immersiveState.mouse.smoothX) * 0.05;
    immersiveState.mouse.smoothY += (immersiveState.mouse.y - immersiveState.mouse.smoothY) * 0.05;

    particles.forEach(particle => {
        // Parallax effect based on mouse
        const dx = (immersiveState.mouse.smoothX - particleCanvas.width / 2) * particle.parallaxSpeed;
        const dy = (immersiveState.mouse.smoothY - particleCanvas.height / 2) * particle.parallaxSpeed;

        // Update position with drift
        particle.x += particle.vx + dx * 0.01;
        particle.y += particle.vy + dy * 0.01;

        // Wrap around edges
        if (particle.x < 0) particle.x = particleCanvas.width;
        if (particle.x > particleCanvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = particleCanvas.height;
        if (particle.y > particleCanvas.height) particle.y = 0;

        // Draw particle with glow
        particleCtx.save();
        particleCtx.shadowBlur = 10;
        particleCtx.shadowColor = particle.color;
        particleCtx.fillStyle = particle.color;
        particleCtx.beginPath();
        particleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        particleCtx.fill();
        particleCtx.restore();
    });
}

// ============================================
// RIPPLE EFFECT
// ============================================

function initImmersiveRipples() {
    rippleCanvas = document.getElementById('ripple-canvas');
    if (!rippleCanvas) return;

    rippleCtx = rippleCanvas.getContext('2d');
    rippleCanvas.width = window.innerWidth;
    rippleCanvas.height = window.innerHeight;
}

function createImmersiveRipple(x, y) {
    ripples.push({
        x: x,
        y: y,
        radius: 0,
        maxRadius: 200,
        alpha: 1
    });
}

function updateImmersiveRipples() {
    if (!rippleCtx) return;

    rippleCtx.clearRect(0, 0, rippleCanvas.width, rippleCanvas.height);

    ripples = ripples.filter(ripple => {
        ripple.radius += 3;
        ripple.alpha -= 0.015;

        if (ripple.alpha <= 0) return false;

        // Draw ripple
        rippleCtx.save();
        rippleCtx.strokeStyle = `rgba(255, 0, 110, ${ripple.alpha * 0.6})`;
        rippleCtx.lineWidth = 2;
        rippleCtx.shadowBlur = 15;
        rippleCtx.shadowColor = `rgba(255, 0, 110, ${ripple.alpha})`;
        rippleCtx.beginPath();
        rippleCtx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        rippleCtx.stroke();
        rippleCtx.restore();

        return true;
    });
}

// ============================================
// ANIMATION LOOP
// ============================================

function animateImmersive() {
    requestAnimationFrame(animateImmersive);

    immersiveState.time += 0.01;

    // Update particles
    updateImmersiveParticles();

    // Update ripples
    updateImmersiveRipples();

    // Rotate spiral on Y-axis
    if (spiral) {
        spiral.rotation.y += 0.003;

        // Scroll-based distortion (stretch/squash)
        const distortion = Math.sin(immersiveState.scroll * 0.001) * 0.3;
        spiral.scale.y = 1 + distortion;
        spiral.scale.x = 1 - distortion * 0.5;
        spiral.scale.z = 1 - distortion * 0.5;

        // Subtle wave animation
        spiral.rotation.x = Math.PI / 6 + Math.sin(immersiveState.time * 0.5) * 0.1;
    }

    // Animate infinite space - squares moving toward viewer
    spaceSquares.forEach(square => {
        // Move square toward camera (infinite zoom effect)
        square.position.z += square.userData.speed;

        // Reset to back when it passes camera
        if (square.position.z > 15) {
            square.position.z = square.userData.initialZ;
        }

        // Fade based on distance
        const distance = Math.abs(square.position.z);
        square.material.opacity = Math.max(0.1, Math.min(0.4, 1 - distance / 40));

        // Subtle rotation
        square.rotation.x += 0.001;
        square.rotation.y += 0.001;
    });

    // Camera tilt based on mouse (subtle)
    if (immersiveCamera) {
        const targetX = (immersiveState.mouse.smoothX / window.innerWidth - 0.5) * 0.1;
        const targetY = (immersiveState.mouse.smoothY / window.innerHeight - 0.5) * 0.1;

        immersiveCamera.rotation.y += (targetX - immersiveCamera.rotation.y) * 0.02;
        immersiveCamera.rotation.x += (targetY - immersiveCamera.rotation.x) * 0.02;
    }

    // Render Three.js scene
    if (immersiveRenderer && immersiveScene && immersiveCamera) {
        immersiveRenderer.render(immersiveScene, immersiveCamera);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

function addImmersiveEventListeners() {
    const section = document.getElementById('immersive-graphics');
    if (!section) return;

    // Mouse move for parallax (only when over section)
    let mouseMoveTimeout;
    section.addEventListener('mousemove', (e) => {
        immersiveState.mouse.x = e.clientX;
        immersiveState.mouse.y = e.clientY;

        // Throttled ripple creation
        clearTimeout(mouseMoveTimeout);
        mouseMoveTimeout = setTimeout(() => {
            if (Math.random() > 0.95) {
                createImmersiveRipple(e.clientX, e.clientY);
            }
        }, 100);
    });

    // Scroll for distortion
    window.addEventListener('scroll', () => {
        immersiveState.scroll = window.scrollY;
    }, { passive: true });

    // Click for ripple burst
    section.addEventListener('click', (e) => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                createImmersiveRipple(e.clientX, e.clientY);
            }, i * 100);
        }
    });

    // Resize handler
    window.addEventListener('resize', onImmersiveResize);
}

function onImmersiveResize() {
    if (!immersiveCamera || !immersiveRenderer) return;

    // Update camera
    immersiveCamera.aspect = window.innerWidth / window.innerHeight;
    immersiveCamera.updateProjectionMatrix();

    // Update renderer
    immersiveRenderer.setSize(window.innerWidth, window.innerHeight);

    // Update particle canvas
    if (particleCanvas) {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }

    // Update ripple canvas
    if (rippleCanvas) {
        rippleCanvas.width = window.innerWidth;
        rippleCanvas.height = window.innerHeight;
    }
}
