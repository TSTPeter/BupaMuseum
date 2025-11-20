import * as THREE from 'three';

export class FirstPersonControls {
  private camera: THREE.PerspectiveCamera;
  private domElement: HTMLElement;

  private moveForward = false;
  private moveBackward = false;
  private moveLeft = false;
  private moveRight = false;
  private canJump = false;
  private isRunning = false;

  private velocity = new THREE.Vector3();
  private direction = new THREE.Vector3();

  private euler = new THREE.Euler(0, 0, 0, 'YXZ');

  public enabled = true;
  public movementSpeed = 10.0;
  public sprintMultiplier = 2.0;
  public lookSpeed = 0.002;

  private minPolarAngle = 0;
  private maxPolarAngle = Math.PI;

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.domElement.addEventListener('click', () => {
      this.domElement.requestPointerLock();
    });

    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));

    // Initialize euler from camera rotation
    this.euler.setFromQuaternion(this.camera.quaternion);
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.enabled || document.pointerLockElement !== this.domElement) return;

    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;

    this.euler.y -= movementX * this.lookSpeed;
    this.euler.x -= movementY * this.lookSpeed;

    this.euler.x = Math.max(
      Math.PI / 2 - this.maxPolarAngle,
      Math.min(Math.PI / 2 - this.minPolarAngle, this.euler.x)
    );

    this.camera.quaternion.setFromEuler(this.euler);
  }

  private onKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isRunning = true;
        break;
      case 'Space':
        if (this.canJump) this.velocity.y += 8;
        this.canJump = false;
        break;
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isRunning = false;
        break;
    }
  }

  public update(delta: number): void {
    if (!this.enabled) return;

    const speedMultiplier = this.isRunning ? this.sprintMultiplier : 1.0;
    const actualSpeed = this.movementSpeed * speedMultiplier;

    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;
    this.velocity.y -= 9.8 * 10.0 * delta; // Gravity

    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.normalize();

    if (this.moveForward || this.moveBackward) {
      this.velocity.z -= this.direction.z * actualSpeed * delta;
    }
    if (this.moveLeft || this.moveRight) {
      this.velocity.x -= this.direction.x * actualSpeed * delta;
    }

    // Apply movement
    const moveVector = new THREE.Vector3(this.velocity.x * delta, this.velocity.y * delta, this.velocity.z * delta);
    moveVector.applyQuaternion(this.camera.quaternion);
    this.camera.position.add(moveVector);

    // Simple ground collision
    if (this.camera.position.y < 1.7) {
      this.velocity.y = 0;
      this.camera.position.y = 1.7;
      this.canJump = true;
    }
  }

  public getVelocity(): THREE.Vector3 {
    return this.velocity.clone();
  }

  public getDirection(): THREE.Vector3 {
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    return direction;
  }

  public dispose(): void {
    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);
    this.domElement.removeEventListener('mousemove', this.onMouseMove);
  }
}
