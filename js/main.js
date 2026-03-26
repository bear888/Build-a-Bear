// Build-a-Bear Main JavaScript File

class BuildABear {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.canvas = null;
        this.bear = null;
        this.currentAnimation = null;
        this.animationStartTime = 0;
        this.animationDuration = 0;
        this.frameCount = 0;
        this.lastTime = Date.now();
        this.fps = 0;

        this.init();
    }

    init() {
        try {
            // Check browser compatibility first
            if (!this.checkBrowserCompatibility()) {
                console.warn('Browser compatibility issues detected');
            }

            this.setupScene();
            this.setupCamera();
            this.setupRenderer();
            this.setupLighting();
            this.setupControls();
            this.setupBearInteraction();
            this.addTestObjects();
            this.setupCustomizationControls();

            // Performance optimizations
            this.optimizePerformance();

            this.animate();

            console.log('Build-a-Bear initialized successfully');
        } catch (error) {
            console.error('Error initializing Build-a-Bear:', error);
            this.showError('Failed to initialize the application. Please refresh the page.');
        }
    }

    setupScene() {
        // Create the Three.js scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue background
        console.log('Scene created with background:', this.scene.background);
    }

    setupCamera() {
        // Create camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 2, 8); // Moved back and up for better view
        this.camera.lookAt(0, 0, 0); // Look at the center
        console.log('Camera positioned at:', this.camera.position);
    }

    setupRenderer() {
        // Get canvas element
        this.canvas = document.getElementById('bear-canvas');
        if (!this.canvas) {
            throw new Error('Canvas element not found');
        }

        // Ensure canvas has proper dimensions
        const canvasContainer = this.canvas.parentElement;
        const containerWidth = canvasContainer.clientWidth || window.innerWidth;
        const containerHeight = canvasContainer.clientHeight || 600;

        // Set canvas size explicitly
        this.canvas.width = containerWidth;
        this.canvas.height = containerHeight;

        // Create renderer with performance optimizations
        const pixelRatio = this.isMobile() ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio;
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: !this.isMobile(), // Disable antialiasing on mobile for performance
            powerPreference: "high-performance",
            failIfMajorPerformanceCaveat: false
        });

        // Set renderer size
        this.renderer.setSize(containerWidth, containerHeight, false);
        this.renderer.setPixelRatio(pixelRatio);

        // Additional performance settings
        this.renderer.shadowMap.enabled = false; // No shadows in this simple scene
        // this.renderer.outputEncoding = THREE.sRGBEncoding; // Commented out for compatibility

        // Handle window resize
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });

        console.log('Renderer initialized:', {
            width: containerWidth,
            height: containerHeight,
            pixelRatio: pixelRatio,
            webgl: !!this.renderer.getContext()
        });
    }

    onWindowResize() {
        if (!this.canvas || !this.renderer || !this.camera) return;

        const canvasContainer = this.canvas.parentElement;
        const containerWidth = canvasContainer.clientWidth || window.innerWidth;
        const containerHeight = canvasContainer.clientHeight || 600;

        // Update canvas size
        this.canvas.width = containerWidth;
        this.canvas.height = containerHeight;

        // Update renderer
        this.renderer.setSize(containerWidth, containerHeight, false);

        // Update camera
        this.camera.aspect = containerWidth / containerHeight;
        this.camera.updateProjectionMatrix();

        console.log('Resized to:', containerWidth, 'x', containerHeight);
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(directionalLight);
    }

    setupControls() {
        // Orbit controls for camera movement
        this.controls = new THREE.OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.enableZoom = true;
        this.controls.enableRotate = true;
        this.controls.enablePan = false;
        this.controls.target.set(0, 1, 0); // Look at the bear area
        this.controls.update();
        console.log('Controls initialized');
    }

    setupBearInteraction() {
        this.isDraggingBear = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.bearRotation = { x: 0, y: 0 };

        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.onBearMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onBearMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onBearMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.onBearMouseUp(e));

        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.onBearTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.onBearTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.onBearTouchEnd(e));

        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Set initial cursor
        this.canvas.style.cursor = 'grab';
    }

    onBearMouseDown(event) {
        // Only handle left mouse button
        if (event.button !== 0) return;

        this.isDraggingBear = true;
        this.previousMousePosition.x = event.clientX;
        this.previousMousePosition.y = event.clientY;

        // Change cursor to indicate dragging
        this.canvas.style.cursor = 'grabbing';
    }

    onBearMouseMove(event) {
        if (!this.isDraggingBear) return;

        const deltaX = event.clientX - this.previousMousePosition.x;
        const deltaY = event.clientY - this.previousMousePosition.y;

        // Rotate bear based on mouse movement
        this.bearRotation.y += deltaX * 0.01;
        this.bearRotation.x += deltaY * 0.01;

        // Apply rotation to bear
        if (this.bear && this.bear.group) {
            this.bear.group.rotation.y = this.bearRotation.y;
            this.bear.group.rotation.x = this.bearRotation.x;
        }

        this.previousMousePosition.x = event.clientX;
        this.previousMousePosition.y = event.clientY;
    }

    onBearMouseUp(event) {
        this.isDraggingBear = false;
        this.canvas.style.cursor = 'grab';
    }

    onBearTouchStart(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            this.isDraggingBear = true;
            this.previousMousePosition.x = event.touches[0].clientX;
            this.previousMousePosition.y = event.touches[0].clientY;
        }
    }

    onBearTouchMove(event) {
        if (!this.isDraggingBear || event.touches.length !== 1) return;

        event.preventDefault();
        const deltaX = event.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = event.touches[0].clientY - this.previousMousePosition.y;

        // Rotate bear based on touch movement
        this.bearRotation.y += deltaX * 0.01;
        this.bearRotation.x += deltaY * 0.01;

        // Apply rotation to bear
        if (this.bear && this.bear.group) {
            this.bear.group.rotation.y = this.bearRotation.y;
            this.bear.group.rotation.x = this.bearRotation.x;
        }

        this.previousMousePosition.x = event.touches[0].clientX;
        this.previousMousePosition.y = event.touches[0].clientY;
    }

    onBearTouchEnd(event) {
        this.isDraggingBear = false;
    }

    handleKeyDown(event) {
        // Animation shortcuts
        switch (event.key.toLowerCase()) {
            case 'w':
                event.preventDefault();
                this.playWaveAnimation();
                break;
            case 'd':
                event.preventDefault();
                this.playDanceAnimation();
                break;
            case 'i':
                event.preventDefault();
                this.playIdleAnimation();
                break;
            case 'p':
                event.preventDefault();
                this.petBear();
                break;
            case 's':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    this.saveBear();
                }
                break;
            case 'r':
                if (event.ctrlKey || event.metaKey) {
                    event.preventDefault();
                    this.resetBearToDefault();
                }
                break;
        }
    }

    addTestObjects() {
        console.log('Adding test objects to scene...');

        // Add a simple cube for testing
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(-3, 0, 0);
        this.scene.add(cube);
        console.log('Added green cube to scene');

        // Add a sphere for testing
        const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
        const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(2, 0, 0);
        this.scene.add(sphere);
        console.log('Added red sphere to scene');

        // Add basic bear model
        this.createBasicBear();
        console.log('Scene objects added, total children:', this.scene.children.length);
    }

    createBasicBear() {
        // Create bear using the Bear class
        this.bear = new Bear();
        this.bear.setPosition(0, 1, 0);
        this.bear.addToScene(this.scene);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Monitor FPS
        this.updateFPS();

        // Animate bear (idle pose)
        this.animateBear();

        // Render the scene
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        } else {
            console.error('Missing renderer, scene, or camera for rendering');
        }
    }

    updateFPS() {
        this.frameCount++;
        const currentTime = Date.now();

        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;

            // Log FPS for debugging (can be removed in production)
            console.log('FPS:', this.fps);
        }
    }

    animateBear() {
        // Only run idle animation if no other animation is playing
        if (this.currentAnimation) return;

        if (this.bear && this.bear.group) {
            const time = Date.now() * 0.001; // Convert to seconds

            // Gentle bobbing motion
            this.bear.group.position.y = 1 + Math.sin(time * 2) * 0.05;

            // Slight head tilting
            if (this.bear.head) {
                this.bear.head.rotation.z = Math.sin(time * 1.5) * 0.1;
            }

            // Arm swaying
            if (this.bear.leftArm) {
                this.bear.leftArm.rotation.x = Math.sin(time * 1.8) * 0.2;
            }
            if (this.bear.rightArm) {
                this.bear.rightArm.rotation.x = Math.sin(time * 1.8 + Math.PI) * 0.2;
            }
        }
    }

    setupCustomizationControls() {
        // Fur Color
        const furColorSelect = document.getElementById('fur-color');
        furColorSelect.addEventListener('change', (e) => {
            this.showLoadingState();
            const color = parseInt(e.target.value.replace('#', ''), 16);
            this.bear.updateProperty('bodyColor', color);
            this.bear.updateProperty('headColor', color);
            this.bear.updateProperty('earColor', color);
            this.bear.updateProperty('armColor', color);
            this.bear.updateProperty('legColor', color);
            this.hideLoadingState();
        });

        // Body Size
        const bodySizeSlider = document.getElementById('body-size');
        const bodySizeValue = document.getElementById('body-size-value');
        bodySizeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            bodySizeValue.textContent = value.toFixed(1);
            this.bear.updateProperty('bodySize', value);
        });

        // Head Size
        const headSizeSlider = document.getElementById('head-size');
        const headSizeValue = document.getElementById('head-size-value');
        headSizeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            headSizeValue.textContent = value.toFixed(1);
            this.bear.updateProperty('headSize', value);
        });

        // Arm Length
        const armLengthSlider = document.getElementById('arm-length');
        const armLengthValue = document.getElementById('arm-length-value');
        armLengthSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            armLengthValue.textContent = value.toFixed(1);
            this.bear.updateProperty('armLength', value);
        });

        // Leg Length
        const legLengthSlider = document.getElementById('leg-length');
        const legLengthValue = document.getElementById('leg-length-value');
        legLengthSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            legLengthValue.textContent = value.toFixed(1);
            this.bear.updateProperty('legLength', value);
        });

        // Hair Style
        const hairStyleSelect = document.getElementById('hair-style');
        hairStyleSelect.addEventListener('change', (e) => {
            this.bear.updateProperty('hairStyle', e.target.value);
        });

        // Eye Style
        const eyeStyleSelect = document.getElementById('eye-style');
        eyeStyleSelect.addEventListener('change', (e) => {
            this.bear.updateProperty('eyeStyle', e.target.value);
        });

        // Reset Button
        const resetButton = document.getElementById('reset-bear');
        resetButton.addEventListener('click', () => {
            this.showLoadingState();
            setTimeout(() => {
                this.resetBearToDefault();
                this.hideLoadingState();
            }, 100);
        });

        // Animation Buttons
        const waveButton = document.getElementById('wave-animation');
        const danceButton = document.getElementById('dance-animation');
        const idleButton = document.getElementById('idle-animation');

        waveButton.addEventListener('click', () => this.playWaveAnimation());
        danceButton.addEventListener('click', () => this.playDanceAnimation());
        idleButton.addEventListener('click', () => this.playIdleAnimation());

        // Background selector
        const backgroundSelect = document.getElementById('background');
        backgroundSelect.addEventListener('change', (e) => {
            this.changeBackground(e.target.value);
        });

        // Play buttons
        const petButton = document.getElementById('pet-bear');
        const surpriseButton = document.getElementById('surprise-bear');

        petButton.addEventListener('click', () => this.petBear());
        surpriseButton.addEventListener('click', () => this.surpriseBear());

        // Save/Load buttons
        const saveButton = document.getElementById('save-bear');
        const loadButton = document.getElementById('load-bear');

        saveButton.addEventListener('click', () => this.saveBear());
        loadButton.addEventListener('click', () => this.loadBear());

        // Preset buttons
        const teddyButton = document.getElementById('preset-teddy');
        const pandaButton = document.getElementById('preset-panda');
        const unicornButton = document.getElementById('preset-unicorn');

        teddyButton.addEventListener('click', () => this.loadPreset('teddy'));
        pandaButton.addEventListener('click', () => this.loadPreset('panda'));
        unicornButton.addEventListener('click', () => this.loadPreset('unicorn'));
    }

    resetBearToDefault() {
        // Reset all controls to default values
        document.getElementById('fur-color').value = '#8B4513';
        document.getElementById('body-size').value = '1.0';
        document.getElementById('body-size-value').textContent = '1.0';
        document.getElementById('head-size').value = '1.0';
        document.getElementById('head-size-value').textContent = '1.0';
        document.getElementById('arm-length').value = '1.0';
        document.getElementById('arm-length-value').textContent = '1.0';
        document.getElementById('leg-length').value = '1.0';
        document.getElementById('leg-length-value').textContent = '1.0';
        document.getElementById('hair-style').value = 'none';
        document.getElementById('eye-style').value = 'round';

        // Reset bear to default properties
        this.bear = new Bear();
        this.bear.setPosition(0, 1, 0);
        this.bear.addToScene(this.scene);
    }

    showLoadingState() {
        // Add a simple loading overlay
        if (!document.getElementById('loading-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'loading-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                color: white;
                font-size: 1.2rem;
            `;
            overlay.innerHTML = 'Updating bear...';
            document.body.appendChild(overlay);
        }
    }

    hideLoadingState() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    playWaveAnimation() {
        if (!this.bear || !this.bear.group) return;

        // Stop any current animation
        this.stopCurrentAnimation();

        this.currentAnimation = 'wave';
        this.animationStartTime = Date.now();
        this.animationDuration = 2000; // 2 seconds

        const animate = () => {
            const elapsed = Date.now() - this.animationStartTime;
            const progress = Math.min(elapsed / this.animationDuration, 1);

            if (progress < 1) {
                // Wave animation: move right arm up and down
                const waveAngle = Math.sin(progress * Math.PI * 4) * 0.5; // 2 full waves
                if (this.bear.rightArm) {
                    this.bear.rightArm.rotation.x = waveAngle;
                }
                requestAnimationFrame(animate);
            } else {
                // Reset arm position
                if (this.bear.rightArm) {
                    this.bear.rightArm.rotation.x = -Math.PI / 6;
                }
                this.currentAnimation = null;
            }
        };

        animate();
    }

    playDanceAnimation() {
        if (!this.bear || !this.bear.group) return;

        // Stop any current animation
        this.stopCurrentAnimation();

        this.currentAnimation = 'dance';
        this.animationStartTime = Date.now();
        this.animationDuration = 3000; // 3 seconds

        const animate = () => {
            const elapsed = Date.now() - this.animationStartTime;
            const progress = Math.min(elapsed / this.animationDuration, 1);

            if (progress < 1) {
                // Dance animation: bounce and twist
                const bounce = Math.sin(progress * Math.PI * 6) * 0.1; // 3 bounces
                const twist = Math.sin(progress * Math.PI * 4) * 0.3; // 2 twists

                this.bear.group.position.y = 1 + bounce;
                this.bear.group.rotation.y = this.bearRotation.y + twist;

                // Move arms
                const armSwing = Math.sin(progress * Math.PI * 8) * 0.4;
                if (this.bear.leftArm) {
                    this.bear.leftArm.rotation.x = armSwing;
                }
                if (this.bear.rightArm) {
                    this.bear.rightArm.rotation.x = -armSwing;
                }

                requestAnimationFrame(animate);
            } else {
                // Reset positions
                this.bear.group.position.y = 1;
                this.bear.group.rotation.y = this.bearRotation.y;
                if (this.bear.leftArm) {
                    this.bear.leftArm.rotation.x = Math.PI / 6;
                }
                if (this.bear.rightArm) {
                    this.bear.rightArm.rotation.x = -Math.PI / 6;
                }
                this.currentAnimation = null;
            }
        };

        animate();
    }

    playIdleAnimation() {
        // Stop any current animation and return to idle state
        this.stopCurrentAnimation();
        this.currentAnimation = null;
    }

    stopCurrentAnimation() {
        if (this.currentAnimation) {
            // Reset bear to current rotation state
            if (this.bear && this.bear.group) {
                this.bear.group.rotation.y = this.bearRotation.y;
                this.bear.group.rotation.x = this.bearRotation.x;
                this.bear.group.position.y = 1;

                // Reset arm positions
                if (this.bear.leftArm) {
                    this.bear.leftArm.rotation.x = Math.PI / 6;
                }
                if (this.bear.rightArm) {
                    this.bear.rightArm.rotation.x = -Math.PI / 6;
                }
            }
            this.currentAnimation = null;
        }
    }

    changeBackground(color) {
        this.scene.background = new THREE.Color(color);
        this.playSound('background-change');
    }

    petBear() {
        // Simple pet interaction - make bear react
        if (!this.bear || !this.bear.group) return;

        this.playSound('pet');

        // Quick happy reaction
        const originalY = this.bear.group.position.y;
        this.bear.group.position.y = originalY + 0.2;

        setTimeout(() => {
            this.bear.group.position.y = originalY;
        }, 200);

        // Maybe trigger a wave animation
        setTimeout(() => {
            this.playWaveAnimation();
        }, 300);
    }

    surpriseBear() {
        // Surprise interaction - make bear jump and spin
        if (!this.bear || !this.bear.group) return;

        this.playSound('surprise');

        // Stop any current animation
        this.stopCurrentAnimation();

        // Surprise animation
        this.currentAnimation = 'surprise';
        this.animationStartTime = Date.now();
        this.animationDuration = 1500;

        const originalY = 1;
        const animate = () => {
            const elapsed = Date.now() - this.animationStartTime;
            const progress = Math.min(elapsed / this.animationDuration, 1);

            if (progress < 1) {
                // Jump up and spin
                const jump = Math.sin(progress * Math.PI) * 0.5;
                const spin = progress * Math.PI * 4; // 2 full spins

                this.bear.group.position.y = originalY + jump;
                this.bear.group.rotation.y = this.bearRotation.y + spin;

                requestAnimationFrame(animate);
            } else {
                // Reset position
                this.bear.group.position.y = originalY;
                this.bear.group.rotation.y = this.bearRotation.y;
                this.currentAnimation = null;
            }
        };

        animate();
    }

    playSound(soundType) {
        // Simple sound effects using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            switch (soundType) {
                case 'pet':
                    oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
                    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                    break;

                case 'surprise':
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
                    oscillator.frequency.setValueAtTime(880, audioContext.currentTime + 0.05); // A5
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime + 0.1);
                    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.4);
                    break;

                case 'background-change':
                    oscillator.frequency.setValueAtTime(330, audioContext.currentTime); // E4
                    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;

                case 'save':
                    oscillator.frequency.setValueAtTime(523, audioContext.currentTime); // C5
                    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
                    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // G5
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.5);
                    break;

                case 'load':
                    oscillator.frequency.setValueAtTime(784, audioContext.currentTime); // G5
                    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // E5
                    oscillator.frequency.setValueAtTime(523, audioContext.currentTime + 0.2); // C5
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.5);
                    break;
            }
        } catch (e) {
            // Fallback: no sound if Web Audio API is not supported
            console.log('Sound not available:', soundType);
        }
    }

    saveBear() {
        if (!this.bear || !this.bear.group) {
            this.showError('No bear to save! Create a bear first.');
            return;
        }

        try {
            this.showLoadingState();

            const exporter = new THREE.GLTFExporter();

            exporter.parse(
                this.bear.group,
                (result) => {
                    try {
                        const output = JSON.stringify(result, null, 2);
                        const blob = new Blob([output], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);

                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `my-custom-bear-${Date.now()}.gltf`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        URL.revokeObjectURL(url);
                        this.hideLoadingState();
                        this.playSound('save');

                        // Show success message
                        this.showSuccess('Bear saved successfully!');
                    } catch (error) {
                        console.error('Error creating download:', error);
                        this.hideLoadingState();
                        this.showError('Failed to create download file.');
                    }
                },
                (error) => {
                    console.error('Error exporting GLTF:', error);
                    this.hideLoadingState();
                    this.showError('Failed to export bear. Please try again.');
                },
                { binary: false }
            );
        } catch (error) {
            console.error('Error in saveBear:', error);
            this.hideLoadingState();
            this.showError('An unexpected error occurred while saving.');
        }
    }

    loadBear() {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.gltf,.glb';

            input.onchange = (event) => {
                const file = event.target.files[0];
                if (!file) return;

                // Check file size (limit to 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    this.showError('File is too large. Please select a file smaller than 10MB.');
                    return;
                }

                this.showLoadingState();

                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const loader = new THREE.GLTFLoader();

                        loader.parse(
                            e.target.result,
                            '',
                            (gltf) => {
                                try {
                                    // Remove current bear
                                    if (this.bear) {
                                        this.scene.remove(this.bear.group);
                                    }

                                    // Add loaded bear
                                    this.scene.add(gltf.scene);
                                    this.bear = {
                                        group: gltf.scene,
                                        setPosition: (x, y, z) => gltf.scene.position.set(x, y, z),
                                        addToScene: (scene) => scene.add(gltf.scene),
                                        removeFromScene: (scene) => scene.remove(gltf.scene)
                                    };

                                    this.bear.setPosition(0, 1, 0);
                                    this.bearRotation = { x: 0, y: 0 };

                                    this.hideLoadingState();
                                    this.playSound('load');
                                    this.showSuccess('Bear loaded successfully!');
                                } catch (error) {
                                    console.error('Error setting up loaded bear:', error);
                                    this.hideLoadingState();
                                    this.showError('Failed to set up the loaded bear.');
                                }
                            },
                            (error) => {
                                console.error('Error loading GLTF:', error);
                                this.hideLoadingState();
                                this.showError('Failed to load bear file. Please check the file format.');
                            }
                        );
                    } catch (error) {
                        console.error('Error in file reader:', error);
                        this.hideLoadingState();
                        this.showError('Failed to read the file.');
                    }
                };

                reader.onerror = () => {
                    this.hideLoadingState();
                    this.showError('Failed to read the file.');
                };

                reader.readAsArrayBuffer(file);
            };

            input.click();
        } catch (error) {
            console.error('Error in loadBear:', error);
            this.showError('An unexpected error occurred while loading.');
        }
    }

    checkBrowserCompatibility() {
        const issues = [];

        // Check for WebGL support
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) {
                issues.push('WebGL is not supported by your browser. Please use a modern browser like Chrome, Firefox, or Safari.');
            }
        } catch (e) {
            issues.push('WebGL initialization failed.');
        }

        // Check for File API support
        if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            issues.push('File API is not fully supported. Save/Load features may not work.');
        }

        // Check for Web Audio API support
        if (!window.AudioContext && !window.webkitAudioContext) {
            console.warn('Web Audio API not supported - sound effects will be disabled');
        }

        // Check for URL API support
        if (!window.URL || !window.URL.createObjectURL) {
            issues.push('URL API not supported. Save feature may not work.');
        }

        if (issues.length > 0) {
            const message = 'Browser Compatibility Issues:\n' + issues.join('\n');
            this.showError(message);
            console.warn(message);
        }

        return issues.length === 0;
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    optimizePerformance() {
        // Enable power preference for better performance
        const contextAttributes = {
            powerPreference: 'high-performance',
            antialias: true,
            alpha: false
        };

        // Reinitialize renderer with performance settings if needed
        if (this.renderer) {
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2x for performance
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }

        // Reduce quality on mobile devices
        if (this.isMobile()) {
            this.renderer.setPixelRatio(1);
            this.controls.enableDamping = false;
            this.controls.enablePan = false;
            this.controls.enableZoom = true;
            this.controls.zoomSpeed = 0.5;
        }

        // Monitor memory usage if available
        if (performance.memory) {
            console.log('Memory usage:', {
                used: Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1048576) + ' MB',
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + ' MB'
            });
        }
    }

    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth < 768;
    }

    loadPreset(presetName) {
        this.showLoadingState();

        const presets = {
            teddy: {
                bodyColor: 0x8B4513,
                headColor: 0x8B4513,
                earColor: 0x8B4513,
                armColor: 0x8B4513,
                legColor: 0x8B4513,
                bodySize: 1.0,
                headSize: 1.0,
                armLength: 1.0,
                legLength: 1.0,
                hairStyle: 'none',
                eyeStyle: 'round'
            },
            panda: {
                bodyColor: 0xFFFFFF,
                headColor: 0xFFFFFF,
                earColor: 0x000000,
                armColor: 0xFFFFFF,
                legColor: 0xFFFFFF,
                bodySize: 0.9,
                headSize: 1.1,
                armLength: 0.9,
                legLength: 0.9,
                hairStyle: 'none',
                eyeStyle: 'big'
            },
            unicorn: {
                bodyColor: 0xFFB6C1,
                headColor: 0xFFB6C1,
                earColor: 0xFFB6C1,
                armColor: 0xFFB6C1,
                legColor: 0xFFB6C1,
                bodySize: 0.8,
                headSize: 1.2,
                armLength: 1.1,
                legLength: 1.1,
                hairStyle: 'long',
                eyeStyle: 'big'
            }
        };

        const preset = presets[presetName];
        if (!preset) {
            this.hideLoadingState();
            return;
        }

        // Update bear properties
        Object.keys(preset).forEach(key => {
            this.bear.updateProperty(key, preset[key]);
        });

        // Update UI controls
        this.updateUIFromPreset(preset);

        // Change background for themed experience
        const backgrounds = {
            teddy: '#f0f0f0',
            panda: '#E6E6FA',
            unicorn: '#FFF0F5'
        };
        this.changeBackground(backgrounds[presetName]);

        setTimeout(() => {
            this.hideLoadingState();
            this.showNotification(`${presetName.charAt(0).toUpperCase() + presetName.slice(1)} preset loaded!`, 'success');
            this.playSound('load');
        }, 200);
    }

    updateUIFromPreset(preset) {
        // Update form controls to match preset
        document.getElementById('fur-color').value = '#' + preset.bodyColor.toString(16).padStart(6, '0');
        document.getElementById('body-size').value = preset.bodySize;
        document.getElementById('body-size-value').textContent = preset.bodySize.toFixed(1);
        document.getElementById('head-size').value = preset.headSize;
        document.getElementById('head-size-value').textContent = preset.headSize.toFixed(1);
        document.getElementById('arm-length').value = preset.armLength;
        document.getElementById('arm-length-value').textContent = preset.armLength.toFixed(1);
        document.getElementById('leg-length').value = preset.legLength;
        document.getElementById('leg-length-value').textContent = preset.legLength.toFixed(1);
        document.getElementById('hair-style').value = preset.hairStyle;
        document.getElementById('eye-style').value = preset.eyeStyle;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready, initializing Build-a-Bear...');
    new BuildABear();
});
