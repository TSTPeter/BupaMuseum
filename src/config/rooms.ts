import * as THREE from 'three';
import { RoomConfig } from '../core/Room';

export const ROOM_CONFIGS: Record<string, RoomConfig> = {
  entrance: {
    name: 'entrance',
    displayName: 'Entrance Hall',
    description: 'Welcome to the Museum of the Future. Begin your journey through time and space.',
    type: 'lobby',
    position: new THREE.Vector3(0, 0, 0),
    size: { width: 20, height: 5, depth: 20 },
    wallColor: 0x1a1a2e,
    floorColor: 0x0f0f1e,
    ceilingColor: 0x16213e,
    ambientLightColor: 0x4a5568,
    ambientLightIntensity: 0.4,
    artifacts: [
      {
        name: 'Welcome Crystal',
        description: 'A shimmering crystal that marks the beginning of your journey. Its facets reflect infinite possibilities.',
        type: 'crystal',
        position: new THREE.Vector3(0, 0, 0),
        scale: 1.5,
        color: 0x00ffff,
        emissive: 0x00aaaa
      },
      {
        name: 'Temporal Hologram',
        description: 'A holographic display showing the convergence of past, present, and future.',
        type: 'hologram',
        position: new THREE.Vector3(-5, 0, -5),
        scale: 1.2,
        color: 0xff00ff,
        emissive: 0xff00ff
      },
      {
        name: 'Guardian Sculpture',
        description: 'An abstract sculpture representing the eternal guardians of knowledge.',
        type: 'sculpture',
        position: new THREE.Vector3(5, 0, -5),
        scale: 1.3,
        color: 0xffd700,
        emissive: 0x664400
      }
    ]
  },

  ancient: {
    name: 'ancient',
    displayName: 'Ancient Civilizations',
    description: 'Discover artifacts from the dawn of human civilization.',
    type: 'gallery',
    position: new THREE.Vector3(25, 0, 0),
    size: { width: 18, height: 4.5, depth: 18 },
    wallColor: 0x2c1810,
    floorColor: 0x1a0f08,
    ceilingColor: 0x3d2817,
    ambientLightColor: 0x8b7355,
    ambientLightIntensity: 0.3,
    artifacts: [
      {
        name: 'Pharaoh\'s Crown',
        description: 'A reconstructed crown from ancient Egypt, symbolizing divine authority and eternal power.',
        type: 'relic',
        position: new THREE.Vector3(-4, 0, -4),
        scale: 0.8,
        color: 0xffd700,
        emissive: 0x886622
      },
      {
        name: 'Mesopotamian Tablet',
        description: 'One of the earliest forms of writing, containing records of ancient trade and wisdom.',
        type: 'relic',
        position: new THREE.Vector3(0, 0, -4),
        scale: 0.9,
        color: 0xcd853f,
        emissive: 0x654321
      },
      {
        name: 'Greek Amphora',
        description: 'A perfectly preserved vessel depicting scenes from classical mythology.',
        type: 'sculpture',
        position: new THREE.Vector3(4, 0, -4),
        scale: 1.0,
        color: 0xff6347,
        emissive: 0x662211
      },
      {
        name: 'Mayan Calendar Stone',
        description: 'An intricate representation of the Mayan understanding of cosmic time.',
        type: 'relic',
        position: new THREE.Vector3(-4, 0, 0),
        scale: 1.1,
        color: 0x8fbc8f,
        emissive: 0x2d5016
      },
      {
        name: 'Chinese Oracle Bone',
        description: 'Ancient divination tool used to communicate with ancestors and spirits.',
        type: 'relic',
        position: new THREE.Vector3(4, 0, 0),
        scale: 0.7,
        color: 0xf5f5dc,
        emissive: 0x888866
      }
    ]
  },

  renaissance: {
    name: 'renaissance',
    displayName: 'Renaissance Gallery',
    description: 'Experience the rebirth of art, science, and human thought.',
    type: 'gallery',
    position: new THREE.Vector3(0, 0, 25),
    size: { width: 22, height: 5.5, depth: 16 },
    wallColor: 0x3e2723,
    floorColor: 0x1b0000,
    ceilingColor: 0x4e342e,
    ambientLightColor: 0xffdbac,
    ambientLightIntensity: 0.5,
    artifacts: [
      {
        name: 'Portrait of a Scholar',
        description: 'A masterwork capturing the intellectual spirit of the Renaissance era.',
        type: 'painting',
        position: new THREE.Vector3(-6, 0, -6),
        rotation: new THREE.Euler(0, 0, 0),
        color: 0x8b4513,
        scale: 1.2
      },
      {
        name: 'The Mechanical Lion',
        description: 'A recreation of da Vinci\'s famous automaton, blending art with engineering.',
        type: 'sculpture',
        position: new THREE.Vector3(0, 0, 0),
        scale: 1.4,
        color: 0xcd7f32,
        emissive: 0x442211
      },
      {
        name: 'Celestial Sphere',
        description: 'An armillary sphere demonstrating the revolutionary heliocentric model.',
        type: 'sculpture',
        position: new THREE.Vector3(6, 0, -6),
        scale: 1.1,
        color: 0x4682b4,
        emissive: 0x1a3a52
      },
      {
        name: 'The Garden of Earthly Delights',
        description: 'A triptych exploring the complexity of human nature and divine judgment.',
        type: 'painting',
        position: new THREE.Vector3(-6, 0, 6),
        rotation: new THREE.Euler(0, Math.PI, 0),
        color: 0x228b22,
        scale: 1.5
      },
      {
        name: 'Perspective Studies',
        description: 'Architectural drawings demonstrating the mathematical principles of linear perspective.',
        type: 'painting',
        position: new THREE.Vector3(6, 0, 6),
        rotation: new THREE.Euler(0, Math.PI, 0),
        color: 0x4169e1,
        scale: 1.0
      }
    ]
  },

  modern: {
    name: 'modern',
    displayName: 'Modern Art Wing',
    description: 'Bold expressions of the 20th and 21st centuries.',
    type: 'gallery',
    position: new THREE.Vector3(-25, 0, 0),
    size: { width: 20, height: 6, depth: 20 },
    wallColor: 0xf5f5f5,
    floorColor: 0xe0e0e0,
    ceilingColor: 0xffffff,
    ambientLightColor: 0xffffff,
    ambientLightIntensity: 0.6,
    artifacts: [
      {
        name: 'Chromatic Explosion',
        description: 'An abstract expressionist piece exploring the emotional power of color.',
        type: 'painting',
        position: new THREE.Vector3(-6, 0, -6),
        color: 0xff1493,
        scale: 1.5
      },
      {
        name: 'Deconstructed Reality',
        description: 'A cubist sculpture fragmenting and reassembling perception itself.',
        type: 'sculpture',
        position: new THREE.Vector3(0, 0, -6),
        scale: 1.6,
        color: 0x9370db,
        emissive: 0x4b0082
      },
      {
        name: 'Digital Dreams',
        description: 'Early digital art exploring the boundary between human and machine creativity.',
        type: 'hologram',
        position: new THREE.Vector3(6, 0, -6),
        scale: 1.3,
        color: 0x00ff00,
        emissive: 0x00ff00
      },
      {
        name: 'Minimalist Meditation',
        description: 'A study in simplicity, form, and the power of negative space.',
        type: 'sculpture',
        position: new THREE.Vector3(-6, 0, 6),
        scale: 1.2,
        color: 0x000000,
        emissive: 0x111111
      },
      {
        name: 'Pop Culture Icon',
        description: 'A commentary on consumerism and the democratization of art.',
        type: 'painting',
        position: new THREE.Vector3(6, 0, 6),
        rotation: new THREE.Euler(0, Math.PI, 0),
        color: 0xff6347,
        scale: 1.4
      },
      {
        name: 'Kinetic Energy',
        description: 'A mobile sculpture capturing movement and the passage of time.',
        type: 'sculpture',
        position: new THREE.Vector3(0, 0, 6),
        scale: 1.1,
        color: 0x40e0d0,
        emissive: 0x20706a
      }
    ]
  },

  future: {
    name: 'future',
    displayName: 'Future Visions',
    description: 'Peer into tomorrow - where art, technology, and humanity converge.',
    type: 'gallery',
    position: new THREE.Vector3(0, 0, -25),
    size: { width: 24, height: 7, depth: 24 },
    wallColor: 0x0a0a0a,
    floorColor: 0x000000,
    ceilingColor: 0x1a1a1a,
    ambientLightColor: 0x00ffff,
    ambientLightIntensity: 0.3,
    artifacts: [
      {
        name: 'Quantum Entanglement',
        description: 'A visualization of particles existing in multiple states simultaneously.',
        type: 'crystal',
        position: new THREE.Vector3(-6, 0, -6),
        scale: 1.8,
        color: 0x00ffff,
        emissive: 0x00cccc
      },
      {
        name: 'Neural Network',
        description: 'An artistic representation of artificial intelligence learning and evolving.',
        type: 'hologram',
        position: new THREE.Vector3(0, 0, -8),
        scale: 2.0,
        color: 0xff00ff,
        emissive: 0xff00ff
      },
      {
        name: 'Terraformed Mars',
        description: 'A glimpse of humanity\'s first interplanetary colony.',
        type: 'hologram',
        position: new THREE.Vector3(6, 0, -6),
        scale: 1.5,
        color: 0xff4500,
        emissive: 0xff4500
      },
      {
        name: 'Biotech Fusion',
        description: 'The merger of organic life and synthetic enhancement.',
        type: 'crystal',
        position: new THREE.Vector3(-6, 0, 0),
        scale: 1.4,
        color: 0x00ff00,
        emissive: 0x00aa00
      },
      {
        name: 'Singularity Core',
        description: 'The theoretical point where artificial intelligence surpasses human intelligence.',
        type: 'crystal',
        position: new THREE.Vector3(6, 0, 0),
        scale: 1.6,
        color: 0xffffff,
        emissive: 0xaaaaaa
      },
      {
        name: 'Dimensional Gateway',
        description: 'A portal concept for traversing parallel universes.',
        type: 'hologram',
        position: new THREE.Vector3(0, 0, 6),
        scale: 1.7,
        color: 0x8a2be2,
        emissive: 0x8a2be2
      },
      {
        name: 'Consciousness Upload',
        description: 'Digital immortality - the transfer of human consciousness to data.',
        type: 'hologram',
        position: new THREE.Vector3(-6, 0, 6),
        scale: 1.3,
        color: 0xffd700,
        emissive: 0xffd700
      },
      {
        name: 'Time Crystal',
        description: 'A state of matter that repeats in time, breaking temporal symmetry.',
        type: 'crystal',
        position: new THREE.Vector3(6, 0, 6),
        scale: 1.5,
        color: 0xff1493,
        emissive: 0xcc1073
      }
    ]
  }
};

export const ROOM_ORDER = ['entrance', 'ancient', 'renaissance', 'modern', 'future'];
