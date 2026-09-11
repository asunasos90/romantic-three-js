// Three.js Scene Setup
let scene, camera, renderer;
let particles = [];
let hearts = [];

function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    scene.fog = new THREE.Fog(0x1a1a2e, 100, 1000);

    // Camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 50;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.insertBefore(renderer.domElement, document.body.firstChild);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff69b4, 1, 100);
    pointLight.position.set(20, 20, 20);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x667eea, 0.8, 100);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);

    // Create particles
    createParticles();

    // Create hearts
    createHearts();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);

    // Start animation loop
    animate();
}

// Create floating particles
function createParticles() {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 150;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;

        // Random colors (pink, purple, white)
        const colorChoice = Math.random();
        if (colorChoice < 0.4) {
            colors[i * 3] = 1; // pink
            colors[i * 3 + 1] = 0.4;
            colors[i * 3 + 2] = 0.6;
        } else if (colorChoice < 0.8) {
            colors[i * 3] = 0.4; // purple
            colors[i * 3 + 1] = 0.4;
            colors[i * 3 + 2] = 0.8;
        } else {
            colors[i * 3] = 1; // white
            colors[i * 3 + 1] = 1;
            colors[i * 3 + 2] = 1;
        }

        particles.push({
            x: positions[i * 3],
            y: positions[i * 3 + 1],
            z: positions[i * 3 + 2],
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            vz: (Math.random() - 0.5) * 0.5
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 1.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
}

// Create 3D hearts
function createHearts() {
    // Create multiple heart shapes
    for (let i = 0; i < 5; i++) {
        const heart = createHeartShape();
        
        heart.position.x = (Math.random() - 0.5) * 80;
        heart.position.y = (Math.random() - 0.5) * 80;
        heart.position.z = (Math.random() - 0.5) * 80;
        
        heart.rotation.x = Math.random() * Math.PI;
        heart.rotation.y = Math.random() * Math.PI;
        
        heart.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            },
            floatSpeed: Math.random() * 0.02 + 0.01,
            floatAmount: Math.random() * 20 + 10
        };

        hearts.push(heart);
        scene.add(heart);
    }
}

// Create a 3D heart geometry
function createHeartShape() {
    const heartShape = new THREE.Shape();

    // Draw heart shape
    const x = 0, y = 0;
    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y + 0, x + 0, y + 0);
    heartShape.bezierCurveTo(x - 6, y + 0, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.7, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.7, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y + 0, x + 10, y + 0);
    heartShape.bezierCurveTo(x + 7, y + 0, x + 5, y + 5, x + 5, y + 5);

    // Extrude to create 3D shape
    const extrudeSettings = {
        depth: 8,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 2,
        bevelSegments: 3
    };

    const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    geometry.center();

    const material = new THREE.MeshPhongMaterial({
        color: 0xff69b4,
        emissive: 0xff1493,
        shininess: 100
    });

    return new THREE.Mesh(geometry, material);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Animate particles
    particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.z += particle.vz;

        // Bounce off boundaries
        if (Math.abs(particle.x) > 100) particle.vx *= -1;
        if (Math.abs(particle.y) > 100) particle.vy *= -1;
        if (Math.abs(particle.z) > 100) particle.vz *= -1;
    });

    // Rotate and float hearts
    hearts.forEach((heart) => {
        heart.rotation.x += heart.userData.rotationSpeed.x;
        heart.rotation.y += heart.userData.rotationSpeed.y;
        heart.rotation.z += heart.userData.rotationSpeed.z;

        // Float up and down
        heart.userData.floatPhase = (heart.userData.floatPhase || 0) + heart.userData.floatSpeed;
        heart.position.y += Math.sin(heart.userData.floatPhase) * 0.1;

        // Pulse effect
        const scale = 1 + Math.sin(heart.userData.floatPhase * 0.5) * 0.1;
        heart.scale.set(scale, scale, scale);
    });

    // Rotate camera slowly
    camera.position.x = Math.sin(Date.now() * 0.0001) * 50;
    camera.position.z = Math.cos(Date.now() * 0.0001) * 50;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

// UI Functions
function showConfess() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('confessSection').classList.remove('hidden');
    
    // Add confess hearts animation
    createConfessHearts();
}

function showMiss() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('missSection').classList.remove('hidden');
    
    // Change scene to melancholic
    changeSceneColor(0x2d1b4e);
}

function showMemory() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('memorySection').classList.remove('hidden');
    
    // Change scene to warm
    changeSceneColor(0x3d2817);
}

function backToMenu() {
    document.getElementById('confessSection').classList.add('hidden');
    document.getElementById('missSection').classList.add('hidden');
    document.getElementById('memorySection').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
    
    // Reset scene color
    changeSceneColor(0x1a1a2e);
}

function changeSceneColor(color) {
    scene.background = new THREE.Color(color);
    scene.fog.color = new THREE.Color(color);
}

function createConfessHearts() {
    // Add extra hearts when confessing
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const heart = createHeartShape();
            heart.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60
            );
            heart.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.02,
                    y: (Math.random() - 0.5) * 0.02,
                    z: (Math.random() - 0.5) * 0.02
                },
                floatSpeed: 0.05,
                floatAmount: 20
            };
            hearts.push(heart);
            scene.add(heart);
        }, i * 500);
    }
}

// Initialize when page loads
window.addEventListener('load', initThreeJS);