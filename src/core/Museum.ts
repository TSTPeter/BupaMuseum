import * as THREE from 'three';
import { FirstPersonControls } from '../utils/Controls';
import { AnalyticsManager } from '../analytics/insights';
import { Room } from './Room';
import { ROOM_CONFIGS, ROOM_ORDER } from '../config/rooms';
import { gsap } from 'gsap';

export class Museum {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: FirstPersonControls;
  private analytics: AnalyticsManager;

  private rooms: Map<string, Room> = new Map();
  private currentRoom: string = 'entrance';

  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;

  private clock: THREE.Clock;
  private frameCount: number = 0;
  private lastFPSUpdate: number = 0;
  private fps: number = 60;

  private hoveredArtifact: any = null;

  constructor(container: HTMLElement) {
    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Initialize Analytics
    this.analytics = new AnalyticsManager();

    // Setup Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.fog = new THREE.Fog(0x000000, 10, 50);

    // Setup Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.7, 5);

    // Setup Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    container.appendChild(this.renderer.domElement);

    // Setup Controls
    this.controls = new FirstPersonControls(this.camera, this.renderer.domElement);

    // Create Rooms
    this.createRooms();

    // Add Global Lighting
    this.addGlobalLighting();

    // Add Particle System
    this.addParticleSystem();

    // Setup Event Listeners
    this.setupEventListeners();

    // Start tracking
    this.analytics.trackRoomEntry(
      ROOM_CONFIGS[this.currentRoom].displayName,
      ROOM_CONFIGS[this.currentRoom].type
    );

    // Start Animation Loop
    this.animate();
  }

  private createRooms(): void {
    Object.values(ROOM_CONFIGS).forEach(config => {
      const room = new Room(config);
      this.rooms.set(config.name, room);
      this.scene.add(room.group);
    });
  }

  private addGlobalLighting(): void {
    // Hemisphere light for ambient fill
    const hemisphereLight = new THREE.HemisphereLight(0x4a5568, 0x1a1a2e, 0.6);
    this.scene.add(hemisphereLight);

    // Directional light for overall scene
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
  }

  private addParticleSystem(): void {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.8, 0.6);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    particles.name = 'particles';
    this.scene.add(particles);
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('click', this.onClick.bind(this));

    // Setup room navigation buttons
    document.querySelectorAll('.nav-button').forEach(button => {
      button.addEventListener('click', (e) => {
        const roomName = (e.target as HTMLElement).getAttribute('data-room');
        if (roomName) {
          this.navigateToRoom(roomName);
        }
      });
    });

    // Track session end on page unload
    window.addEventListener('beforeunload', () => {
      this.analytics.trackSessionEnd();
    });
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.analytics.trackCustomEvent('WindowResize', {
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  private onMouseMove(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  private onClick(): void {
    if (this.hoveredArtifact) {
      const room = this.rooms.get(this.currentRoom);
      if (room) {
        const artifact = room.artifacts.find(a => a.mesh === this.hoveredArtifact);
        if (artifact) {
          this.analytics.trackArtifactInteraction(
            artifact.config.name,
            artifact.config.type,
            'click',
            room.config.displayName
          );

          this.analytics.trackCustomEvent('ArtifactClick', {
            artifactName: artifact.config.name,
            artifactType: artifact.config.type
          });
        }
      }
    }
  }

  public navigateToRoom(roomName: string): void {
    if (!this.rooms.has(roomName) || roomName === this.currentRoom) return;

    const targetRoom = this.rooms.get(roomName)!;
    const targetPosition = targetRoom.config.position.clone();
    targetPosition.y = 1.7;
    targetPosition.z += 10;

    // Animate camera transition
    gsap.to(this.camera.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 2,
      ease: 'power2.inOut',
      onComplete: () => {
        this.currentRoom = roomName;
        this.updateUI();
        this.analytics.trackRoomEntry(
          targetRoom.config.displayName,
          targetRoom.config.type
        );
      }
    });

    this.analytics.trackCustomEvent('RoomNavigation', {
      fromRoom: this.currentRoom,
      toRoom: roomName
    });
  }

  private updateUI(): void {
    const room = this.rooms.get(this.currentRoom);
    if (!room) return;

    const roomNameEl = document.getElementById('current-room-name');
    const roomDescEl = document.getElementById('current-room-description');

    if (roomNameEl) roomNameEl.textContent = room.config.displayName;
    if (roomDescEl) roomDescEl.textContent = room.config.description;

    // Update nav buttons
    document.querySelectorAll('.nav-button').forEach(button => {
      const btnRoomName = button.getAttribute('data-room');
      if (btnRoomName === this.currentRoom) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }

  private checkArtifactHover(): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);

    const room = this.rooms.get(this.currentRoom);
    if (!room) return;

    const artifacts = room.getAllArtifactMeshes();
    const intersects = this.raycaster.intersectObjects(artifacts, true);

    const artifactInfoEl = document.getElementById('artifact-info');
    const artifactTitleEl = document.getElementById('artifact-title');
    const artifactDescEl = document.getElementById('artifact-description');

    if (intersects.length > 0) {
      const intersectedObject = intersects[0].object;
      let artifactMesh = intersectedObject;

      // Find the parent artifact mesh
      while (artifactMesh.parent && !artifactMesh.userData.isArtifact) {
        artifactMesh = artifactMesh.parent;
      }

      if (this.hoveredArtifact !== artifactMesh) {
        // Clear previous hover
        if (this.hoveredArtifact) {
          const prevArtifact = room.artifacts.find(a => a.mesh === this.hoveredArtifact);
          if (prevArtifact) prevArtifact.onLeave();
        }

        // Set new hover
        this.hoveredArtifact = artifactMesh;
        const artifact = room.artifacts.find(a => a.mesh === this.hoveredArtifact);

        if (artifact) {
          artifact.onHover();

          if (artifactTitleEl) artifactTitleEl.textContent = artifact.config.name;
          if (artifactDescEl) artifactDescEl.textContent = artifact.config.description;
          if (artifactInfoEl) artifactInfoEl.classList.add('visible');

          this.analytics.trackCustomEvent('ArtifactHover', {
            artifactName: artifact.config.name,
            artifactType: artifact.config.type
          });
        }
      }
    } else {
      if (this.hoveredArtifact) {
        const artifact = room.artifacts.find(a => a.mesh === this.hoveredArtifact);
        if (artifact) artifact.onLeave();

        this.hoveredArtifact = null;
        if (artifactInfoEl) artifactInfoEl.classList.remove('visible');
      }
    }
  }

  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();

    // Update controls
    this.controls.update(delta);

    // Update current room
    const room = this.rooms.get(this.currentRoom);
    if (room) {
      room.update(delta);
    }

    // Animate particles
    const particles = this.scene.getObjectByName('particles');
    if (particles) {
      particles.rotation.y += delta * 0.05;
    }

    // Check artifact hover
    this.checkArtifactHover();

    // Track movement
    const velocity = this.controls.getVelocity();
    const speed = velocity.length();
    if (speed > 0.01) {
      this.analytics.trackMovement(this.camera.position, speed);
    }

    // Track view direction
    const direction = this.controls.getDirection();
    this.analytics.trackViewDirection(direction);

    // Calculate FPS
    this.frameCount++;
    const now = performance.now();
    if (now >= this.lastFPSUpdate + 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFPSUpdate));
      this.frameCount = 0;
      this.lastFPSUpdate = now;

      // Track performance metrics every 5 seconds
      if (Math.random() < 0.2) {
        this.analytics.trackPerformance(
          this.fps,
          this.renderer.info.render.frame,
          this.renderer.info.render.triangles
        );
      }
    }

    // Render
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.controls.dispose();
    this.renderer.dispose();
    this.analytics.trackSessionEnd();
  }
}
