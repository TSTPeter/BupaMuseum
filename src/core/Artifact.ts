import * as THREE from 'three';
import { gsap } from 'gsap';

export interface ArtifactConfig {
  name: string;
  description: string;
  type: 'sculpture' | 'painting' | 'relic' | 'crystal' | 'hologram';
  position: THREE.Vector3;
  rotation?: THREE.Euler;
  scale?: number;
  color?: number;
  emissive?: number;
}

export class Artifact {
  public mesh: THREE.Object3D;
  public config: ArtifactConfig;
  public boundingBox: THREE.Box3;
  private isHovered: boolean = false;
  private originalPosition: THREE.Vector3;
  private spotLight?: THREE.SpotLight;

  constructor(config: ArtifactConfig) {
    this.config = config;
    this.mesh = this.createArtifact();
    this.originalPosition = this.mesh.position.clone();
    this.boundingBox = new THREE.Box3().setFromObject(this.mesh);

    // Add spotlight for dramatic effect
    this.addSpotlight();
  }

  private createArtifact(): THREE.Object3D {
    const group = new THREE.Group();
    let artifact: THREE.Mesh;

    const scale = this.config.scale || 1;
    const color = this.config.color || 0x00ffff;
    const emissive = this.config.emissive || 0x003333;

    switch (this.config.type) {
      case 'sculpture':
        artifact = this.createSculpture(color, emissive);
        break;
      case 'painting':
        artifact = this.createPainting(color);
        break;
      case 'relic':
        artifact = this.createRelic(color, emissive);
        break;
      case 'crystal':
        artifact = this.createCrystal(color, emissive);
        break;
      case 'hologram':
        artifact = this.createHologram(color);
        break;
      default:
        artifact = this.createSculpture(color, emissive);
    }

    artifact.scale.setScalar(scale);
    artifact.userData.artifactName = this.config.name;
    artifact.userData.isArtifact = true;

    group.add(artifact);

    // Add pedestal for non-painting artifacts
    if (this.config.type !== 'painting') {
      const pedestal = this.createPedestal();
      group.add(pedestal);
    }

    group.position.copy(this.config.position);
    if (this.config.rotation) {
      group.rotation.copy(this.config.rotation);
    }

    return group;
  }

  private createSculpture(color: number, emissive: number): THREE.Mesh {
    const geometry = new THREE.Group();

    // Abstract sculpture with multiple geometric shapes
    const shapes = [
      new THREE.TorusKnotGeometry(0.5, 0.15, 100, 16),
      new THREE.OctahedronGeometry(0.4, 0),
      new THREE.IcosahedronGeometry(0.3, 0)
    ];

    shapes.forEach((shape, index) => {
      const material = new THREE.MeshPhysicalMaterial({
        color: color,
        emissive: emissive,
        metalness: 0.8,
        roughness: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        reflectivity: 1.0
      });

      const mesh = new THREE.Mesh(shape, material);
      mesh.position.y = index * 0.3;
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      geometry.add(mesh);
    });

    const container = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());
    container.add(geometry);
    container.position.y = 1.0;

    return container;
  }

  private createPainting(color: number): THREE.Mesh {
    const canvas = new THREE.Group();

    // Frame
    const frameGeometry = new THREE.BoxGeometry(2.2, 1.6, 0.1);
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.9,
      roughness: 0.3
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);

    // Canvas
    const canvasGeometry = new THREE.PlaneGeometry(2, 1.5);
    const canvasMaterial = new THREE.MeshStandardMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.3
    });
    const canvasMesh = new THREE.Mesh(canvasGeometry, canvasMaterial);
    canvasMesh.position.z = 0.06;

    // Add abstract pattern
    const pattern = new THREE.Group();
    for (let i = 0; i < 20; i++) {
      const geo = new THREE.CircleGeometry(Math.random() * 0.2, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6),
        transparent: true,
        opacity: 0.6
      });
      const circle = new THREE.Mesh(geo, mat);
      circle.position.set(
        (Math.random() - 0.5) * 1.8,
        (Math.random() - 0.5) * 1.3,
        0.07
      );
      pattern.add(circle);
    }

    canvas.add(frame);
    canvas.add(canvasMesh);
    canvas.add(pattern);
    canvas.position.y = 1.5;

    const container = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial());
    container.add(canvas);

    return container;
  }

  private createRelic(color: number, emissive: number): THREE.Mesh {
    const geometry = new THREE.DodecahedronGeometry(0.5, 0);
    const material = new THREE.MeshPhysicalMaterial({
      color: color,
      emissive: emissive,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1.0,
      transmission: 0.3,
      thickness: 0.5
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 1.0;

    // Add glowing core
    const coreGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: emissive,
      transparent: true,
      opacity: 0.8
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    mesh.add(core);

    return mesh;
  }

  private createCrystal(color: number, emissive: number): THREE.Mesh {
    const geometry = new THREE.ConeGeometry(0.4, 1.5, 6);
    const material = new THREE.MeshPhysicalMaterial({
      color: color,
      emissive: emissive,
      emissiveIntensity: 0.6,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 1.5,
      clearcoat: 1.0,
      reflectivity: 1.0,
      ior: 2.4
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 1.2;

    // Add smaller crystals around
    for (let i = 0; i < 4; i++) {
      const smallCrystal = new THREE.Mesh(
        new THREE.ConeGeometry(0.15, 0.6, 6),
        material
      );
      const angle = (i / 4) * Math.PI * 2;
      smallCrystal.position.set(
        Math.cos(angle) * 0.3,
        0.3,
        Math.sin(angle) * 0.3
      );
      smallCrystal.rotation.z = Math.random() * 0.3;
      mesh.add(smallCrystal);
    }

    return mesh;
  }

  private createHologram(color: number): THREE.Mesh {
    const geometry = new THREE.TorusGeometry(0.5, 0.15, 16, 100);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.6,
      wireframe: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = 1.5;

    // Add inner sphere
    const sphereGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      wireframe: true
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    mesh.add(sphere);

    return mesh;
  }

  private createPedestal(): THREE.Mesh {
    const geometry = new THREE.CylinderGeometry(0.4, 0.5, 0.8, 8);
    const material = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.8,
      roughness: 0.4
    });

    const pedestal = new THREE.Mesh(geometry, material);
    pedestal.position.y = 0.4;

    // Add label plate
    const plateGeometry = new THREE.BoxGeometry(0.6, 0.1, 0.3);
    const plateMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      emissive: 0x003333,
      metalness: 0.9,
      roughness: 0.1
    });
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.y = 0.45;
    pedestal.add(plate);

    return pedestal;
  }

  private addSpotlight(): void {
    this.spotLight = new THREE.SpotLight(0xffffff, 2.0);
    this.spotLight.position.set(
      this.config.position.x,
      this.config.position.y + 3,
      this.config.position.z
    );
    this.spotLight.angle = Math.PI / 6;
    this.spotLight.penumbra = 0.3;
    this.spotLight.decay = 2;
    this.spotLight.distance = 10;
    this.spotLight.castShadow = true;

    this.spotLight.shadow.mapSize.width = 1024;
    this.spotLight.shadow.mapSize.height = 1024;

    this.mesh.add(this.spotLight);
    this.spotLight.target = this.mesh;
  }

  public animate(deltaTime: number): void {
    // Gentle rotation for non-painting artifacts
    if (this.config.type !== 'painting') {
      this.mesh.children[0].rotation.y += deltaTime * 0.2;
    }

    // Pulsing effect for holograms and crystals
    if (this.config.type === 'hologram' || this.config.type === 'crystal') {
      const scale = 1.0 + Math.sin(Date.now() * 0.001) * 0.05;
      this.mesh.children[0].scale.setScalar(scale * (this.config.scale || 1));
    }
  }

  public onHover(): void {
    if (!this.isHovered) {
      this.isHovered = true;

      // Animate up
      gsap.to(this.mesh.position, {
        y: this.originalPosition.y + 0.2,
        duration: 0.3,
        ease: 'power2.out'
      });

      // Brighten spotlight
      if (this.spotLight) {
        gsap.to(this.spotLight, {
          intensity: 4.0,
          duration: 0.3
        });
      }
    }
  }

  public onLeave(): void {
    if (this.isHovered) {
      this.isHovered = false;

      // Animate back down
      gsap.to(this.mesh.position, {
        y: this.originalPosition.y,
        duration: 0.3,
        ease: 'power2.out'
      });

      // Dim spotlight
      if (this.spotLight) {
        gsap.to(this.spotLight, {
          intensity: 2.0,
          duration: 0.3
        });
      }
    }
  }
}
