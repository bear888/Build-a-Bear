// Bear Model Class

class Bear {
    constructor(options = {}) {
        this.group = new THREE.Group();

        // Detect mobile for LOD
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.geometryQuality = this.isMobile ? 16 : 32; // Lower quality on mobile

        // Default bear properties
        this.properties = {
            bodyColor: options.bodyColor || 0x8B4513,
            headColor: options.headColor || 0x8B4513,
            earColor: options.earColor || 0x8B4513,
            armColor: options.armColor || 0x8B4513,
            legColor: options.legColor || 0x8B4513,
            bodySize: options.bodySize || 1.0,
            headSize: options.headSize || 1.0,
            armLength: options.armLength || 1.0,
            legLength: options.legLength || 1.0,
            hairStyle: options.hairStyle || 'none',
            eyeStyle: options.eyeStyle || 'round'
        };

        this.createBear();
    }

    createBear() {
        // Clear existing parts
        while (this.group.children.length > 0) {
            this.group.remove(this.group.children[0]);
        }

        this.createBody();
        this.createHead();
        this.createEars();
        this.createArms();
        this.createLegs();
        this.createHair();
        this.createEyes();
    }

    createBody() {
        const bodyGeometry = new THREE.SphereGeometry(0.8 * this.properties.bodySize, this.geometryQuality, this.geometryQuality);
        // Use PhongMaterial for better lighting and shininess
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: this.properties.bodyColor,
            shininess: 30,
            specular: 0x111111
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(0, -0.5, 0);
        this.group.add(body);
        this.body = body;
    }

    createHead() {
        const headGeometry = new THREE.SphereGeometry(0.6 * this.properties.headSize, this.geometryQuality, this.geometryQuality);
        const headMaterial = new THREE.MeshPhongMaterial({
            color: this.properties.headColor,
            shininess: 30,
            specular: 0x111111
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 0.3, 0);
        this.group.add(head);
        this.head = head;
    }

    createEars() {
        const earGeometry = new THREE.SphereGeometry(0.15, this.geometryQuality / 2, this.geometryQuality / 2);
        const earMaterial = new THREE.MeshPhongMaterial({
            color: this.properties.earColor,
            shininess: 20,
            specular: 0x111111
        });

        const leftEar = new THREE.Mesh(earGeometry, earMaterial);
        leftEar.position.set(-0.4, 0.7, 0.1);
        this.group.add(leftEar);

        const rightEar = new THREE.Mesh(earGeometry, earMaterial);
        rightEar.position.set(0.4, 0.7, 0.1);
        this.group.add(rightEar);

        this.leftEar = leftEar;
        this.rightEar = rightEar;
    }

    createArms() {
        const armGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8 * this.properties.armLength, this.geometryQuality);
        const armMaterial = new THREE.MeshPhongMaterial({
            color: this.properties.armColor,
            shininess: 30,
            specular: 0x111111
        });

        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.7, -0.3, 0);
        leftArm.rotation.z = Math.PI / 6;
        this.group.add(leftArm);

        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.7, -0.3, 0);
        rightArm.rotation.z = -Math.PI / 6;
        this.group.add(rightArm);

        this.leftArm = leftArm;
        this.rightArm = rightArm;
    }

    createLegs() {
        const legGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.6 * this.properties.legLength, this.geometryQuality);
        const legMaterial = new THREE.MeshPhongMaterial({
            color: this.properties.legColor,
            shininess: 30,
            specular: 0x111111
        });

        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.3, -1.2, 0);
        this.group.add(leftLeg);

        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.3, -1.2, 0);
        this.group.add(rightLeg);

        this.leftLeg = leftLeg;
        this.rightLeg = rightLeg;
    }

    createHair() {
        // Remove existing hair
        if (this.hair) {
            this.group.remove(this.hair);
        }

        if (this.properties.hairStyle === 'none') {
            return;
        }

        let hairGeometry;
        let hairMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513, shininess: 10 });

        switch (this.properties.hairStyle) {
            case 'spiky':
                hairGeometry = new THREE.ConeGeometry(0.3, 0.4, this.geometryQuality / 2);
                break;
            case 'curly':
                hairGeometry = new THREE.SphereGeometry(0.25, this.geometryQuality / 2, this.geometryQuality / 2);
                break;
            case 'long':
                hairGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.6, this.geometryQuality / 2);
                break;
            default:
                return;
        }

        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.set(0, 0.8, 0);
        this.group.add(hair);
        this.hair = hair;
    }

    createEyes() {
        // Remove existing eyes
        if (this.leftEye) {
            this.group.remove(this.leftEye);
        }
        if (this.rightEye) {
            this.group.remove(this.rightEye);
        }

        let eyeGeometry;
        const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, shininess: 100 });

        switch (this.properties.eyeStyle) {
            case 'round':
                eyeGeometry = new THREE.SphereGeometry(0.08, this.geometryQuality / 4, this.geometryQuality / 4);
                break;
            case 'big':
                eyeGeometry = new THREE.SphereGeometry(0.12, this.geometryQuality / 4, this.geometryQuality / 4);
                break;
            case 'small':
                eyeGeometry = new THREE.SphereGeometry(0.05, this.geometryQuality / 4, this.geometryQuality / 4);
                break;
            case 'sleepy':
                eyeGeometry = new THREE.SphereGeometry(0.08, this.geometryQuality / 4, this.geometryQuality / 4);
                break;
            default:
                eyeGeometry = new THREE.SphereGeometry(0.08, this.geometryQuality / 4, this.geometryQuality / 4);
        }

        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.15, 0.4, 0.4);
        this.group.add(leftEye);

        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.15, 0.4, 0.4);
        this.group.add(rightEye);

        this.leftEye = leftEye;
        this.rightEye = rightEye;
    }

    // Methods to update bear properties
    updateProperty(property, value) {
        this.properties[property] = value;
        this.createBear(); // Recreate bear with new properties
    }

    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    addToScene(scene) {
        scene.add(this.group);
    }

    removeFromScene(scene) {
        scene.remove(this.group);
    }
}