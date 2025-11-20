import * as THREE from 'three';
import { Artifact, ArtifactConfig } from './Artifact';

export interface RoomConfig {
  name: string;
  displayName: string;
  description: string;
  type: string;
  position: THREE.Vector3;
  size: { width: number; height: number; depth: number };
  wallColor: number;
  floorColor: number;
  ceilingColor: number;
  ambientLightColor: number;
  ambientLightIntensity: number;
  artifacts: ArtifactConfig[];
}

export class Room {
  public config: RoomConfig;
  public group: THREE.Group;
  public artifacts: Artifact[] = [];
  private walls: THREE.Mesh[] = [];
  private floor?: THREE.Mesh;
  private ceiling?: THREE.Mesh;
  private lights: THREE.Light[] = [];

  constructor(config: RoomConfig) {
    this.config = config;
    this.group = new THREE.Group();
    this.group.position.copy(config.position);
    this.buildRoom();
    this.addLighting();
    this.addArtifacts();
  }

  private buildRoom(): void {
    const { width, height, depth } = this.config.size;

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(width, depth, 10, 10);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: this.config.floorColor,
      metalness: 0.7,
      roughness: 0.3,
      envMapIntensity: 1.0
    });
    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    this.group.add(this.floor);

    // Ceiling
    const ceilingGeometry = new THREE.PlaneGeometry(width, depth, 10, 10);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: this.config.ceilingColor,
      metalness: 0.5,
      roughness: 0.5,
      emissive: this.config.ceilingColor,
      emissiveIntensity: 0.1
    });
    this.ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    this.ceiling.rotation.x = Math.PI / 2;
    this.ceiling.position.y = height;
    this.group.add(this.ceiling);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: this.config.wallColor,
      metalness: 0.3,
      roughness: 0.7,
      side: THREE.DoubleSide
    });

    // Front and Back walls
    const wallGeometryFB = new THREE.PlaneGeometry(width, height);

    const frontWall = new THREE.Mesh(wallGeometryFB, wallMaterial);
    frontWall.position.z = -depth / 2;
    frontWall.position.y = height / 2;
    frontWall.receiveShadow = true;
    this.walls.push(frontWall);
    this.group.add(frontWall);

    const backWall = new THREE.Mesh(wallGeometryFB, wallMaterial);
    backWall.position.z = depth / 2;
    backWall.position.y = height / 2;
    backWall.rotation.y = Math.PI;
    backWall.receiveShadow = true;
    this.walls.push(backWall);
    this.group.add(backWall);

    // Left and Right walls
    const wallGeometryLR = new THREE.PlaneGeometry(depth, height);

    const leftWall = new THREE.Mesh(wallGeometryLR, wallMaterial);
    leftWall.position.x = -width / 2;
    leftWall.position.y = height / 2;
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    this.walls.push(leftWall);
    this.group.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeometryLR, wallMaterial);
    rightWall.position.x = width / 2;
    rightWall.position.y = height / 2;
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    this.walls.push(rightWall);
    this.group.add(rightWall);

    // Add decorative elements
    this.addDecorativeElements();
  }

  private addDecorativeElements(): void {
    const { width, height, depth } = this.config.size;

    // Add glowing lines along edges
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.6
    });

    // Floor perimeter
    const floorPoints = [
      new THREE.Vector3(-width / 2, 0.01, -depth / 2),
      new THREE.Vector3(width / 2, 0.01, -depth / 2),
      new THREE.Vector3(width / 2, 0.01, depth / 2),
      new THREE.Vector3(-width / 2, 0.01, depth / 2),
      new THREE.Vector3(-width / 2, 0.01, -depth / 2)
    ];
    const floorGeometry = new THREE.BufferGeometry().setFromPoints(floorPoints);
    const floorLine = new THREE.Line(floorGeometry, lineMaterial);
    this.group.add(floorLine);

    // Ceiling perimeter
    const ceilingPoints = floorPoints.map(p => new THREE.Vector3(p.x, height - 0.01, p.z));
    const ceilingGeometry = new THREE.BufferGeometry().setFromPoints(ceilingPoints);
    const ceilingLine = new THREE.Line(ceilingGeometry, lineMaterial);
    this.group.add(ceilingLine);
  }

  private addLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(
      this.config.ambientLightColor,
      this.config.ambientLightIntensity
    );
    this.lights.push(ambientLight);
    this.group.add(ambientLight);

    // Add several point lights for better illumination
    const { width, height, depth } = this.config.size;
    const lightPositions = [
      { x: -width / 4, y: height - 0.5, z: -depth / 4 },
      { x: width / 4, y: height - 0.5, z: -depth / 4 },
      { x: -width / 4, y: height - 0.5, z: depth / 4 },
      { x: width / 4, y: height - 0.5, z: depth / 4 }
    ];

    lightPositions.forEach(pos => {
      const pointLight = new THREE.PointLight(0xffffff, 1.5, 20);
      pointLight.position.set(pos.x, pos.y, pos.z);
      pointLight.castShadow = true;
      pointLight.shadow.mapSize.width = 512;
      pointLight.shadow.mapSize.height = 512;
      this.lights.push(pointLight);
      this.group.add(pointLight);

      // Add light sphere visualization
      const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.6
      });
      const lightSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      lightSphere.position.copy(pointLight.position);
      this.group.add(lightSphere);
    });
  }

  private addArtifacts(): void {
    this.config.artifacts.forEach(artifactConfig => {
      const artifact = new Artifact(artifactConfig);
      this.artifacts.push(artifact);
      this.group.add(artifact.mesh);
    });
  }

  public update(deltaTime: number): void {
    // Animate artifacts
    this.artifacts.forEach(artifact => {
      artifact.animate(deltaTime);
    });

    // Pulsing light effect
    this.lights.forEach((light, index) => {
      if (light instanceof THREE.PointLight) {
        light.intensity = 1.5 + Math.sin(Date.now() * 0.001 + index) * 0.2;
      }
    });
  }

  public getArtifactByName(name: string): Artifact | undefined {
    return this.artifacts.find(a => a.config.name === name);
  }

  public getAllArtifactMeshes(): THREE.Object3D[] {
    return this.artifacts.map(a => a.mesh);
  }
}
