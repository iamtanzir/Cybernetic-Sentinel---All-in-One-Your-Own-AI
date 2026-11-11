import * as THREE from 'three';
import * as xb from 'xrblocks';
import { AiService } from '../services/aiService.js';

export class HoloAvatarPedestal extends THREE.Group {
  private avatarMesh!: THREE.Mesh;
  private ring1!: THREE.Mesh;
  private ring2!: THREE.Mesh;
  private ring3!: THREE.Mesh;
  private particleSystem!: THREE.Points;
  private time = 0;
  private basePosition = new THREE.Vector3(0, 0, -1.9);

  constructor() {
    super();
    this.position.copy(this.basePosition);
    this.buildPedestal();
    this.buildAvatarBillboard();
    this.buildFloatingDataParticles();
  }

  private buildPedestal() {
    // 1. Base platform disc
    const baseGeo = new THREE.CylinderGeometry(0.55, 0.65, 0.08, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x07111e,
      roughness: 0.3,
      metalness: 0.85,
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = 0.04;
    this.add(baseMesh);

    // 2. Glowing cyber concentric rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const ringGeo1 = new THREE.RingGeometry(0.35, 0.48, 32);
    this.ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    this.ring1.rotation.x = -Math.PI / 2;
    this.ring1.position.y = 0.09;
    this.add(this.ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x2979ff,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const ringGeo2 = new THREE.RingGeometry(0.52, 0.62, 32);
    this.ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    this.ring2.rotation.x = -Math.PI / 2;
    this.ring2.position.y = 0.1;
    this.add(this.ring2);

    // 3. Floating orbit energy ring
    const orbitGeo = new THREE.TorusGeometry(0.42, 0.008, 16, 64);
    const orbitMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.8,
    });
    this.ring3 = new THREE.Mesh(orbitGeo, orbitMat);
    this.ring3.position.y = 0.6;
    this.add(this.ring3);
  }

  private buildAvatarBillboard() {
    // Load texture of user's attached avatar
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      '/assets/aistudio/image_d022858b.png',
      () => {
        texture.colorSpace = THREE.SRGBColorSpace;
      },
      undefined,
      (err) => {
        console.warn('Could not load avatar texture, using fallback:', err);
      }
    );

    // Create 1.15m high avatar plane standing on the pedestal
    const avatarGeo = new THREE.PlaneGeometry(0.72, 1.28);
    const avatarMat = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.96,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    this.avatarMesh = new THREE.Mesh(avatarGeo, avatarMat);
    this.avatarMesh.position.set(0, 0.95, 0);
    this.avatarMesh.name = 'SentinelAvatarMesh';
    this.add(this.avatarMesh);

    // Back glow aura plane
    const glowGeo = new THREE.PlaneGeometry(0.9, 1.45);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00b0ff,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.position.set(0, 0.95, -0.02);
    this.add(glowMesh);
  }

  private buildFloatingDataParticles() {
    const particleCount = 70;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const radius = 0.2 + Math.random() * 0.45;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 0.1 + Math.random() * 1.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x64ffda,
      size: 0.02,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    this.particleSystem = new THREE.Points(geo, mat);
    this.add(this.particleSystem);
  }

  public pulseAvatar() {
    AiService.playHoloTone('scan');
    if (this.avatarMesh) {
      const originalScale = this.avatarMesh.scale.clone();
      this.avatarMesh.scale.set(1.15, 1.15, 1.15);
      setTimeout(() => {
        this.avatarMesh.scale.copy(originalScale);
      }, 250);
    }
  }

  public update(delta: number) {
    this.time += delta;

    // Rotate pedestal cyber rings
    if (this.ring1) this.ring1.rotation.z += delta * 0.4;
    if (this.ring2) this.ring2.rotation.z -= delta * 0.3;
    if (this.ring3) {
      this.ring3.rotation.x = Math.sin(this.time * 1.2) * 0.2;
      this.ring3.rotation.y += delta * 0.8;
      this.ring3.position.y = 0.65 + Math.sin(this.time * 2) * 0.08;
    }

    // Avatar breathing / hover floating effect
    if (this.avatarMesh) {
      this.avatarMesh.position.y = 0.95 + Math.sin(this.time * 2.5) * 0.035;
    }

    // Animate data particles rising up
    if (this.particleSystem) {
      const positions = this.particleSystem.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += delta * 0.35;
        if (positions[i] > 1.6) {
          positions[i] = 0.1;
        }
      }
      this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }
  }
}
