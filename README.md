# Museum of the Future - 3D Interactive Experience

An ultra-modern, immersive 3D web museum experience featuring WebGL graphics, multiple galleries, complex artifacts, and comprehensive user analytics powered by Azure Application Insights.

## Features

### 🎨 Immersive 3D Experience
- **Five Distinct Galleries**: Journey through Entrance Hall, Ancient Civilizations, Renaissance Gallery, Modern Art Wing, and Future Visions
- **20+ Interactive Artifacts**: Sculptures, paintings, relics, crystals, and holograms with unique designs
- **Advanced WebGL Graphics**: Powered by Three.js with realistic lighting, shadows, and post-processing effects
- **Smooth Navigation**: First-person controls with WASD movement, mouse look, and sprint functionality
- **Dynamic Particle System**: 1000+ particles creating an atmospheric environment

### 📊 Comprehensive Analytics
Integrated with Azure Application Insights for rich user tracking:
- Session tracking (start, duration, end)
- Room entry/exit with time spent
- Artifact interactions (hover, click)
- User movement patterns and velocity
- Camera view direction sampling
- Performance metrics (FPS, render time, triangle count)
- Error tracking with context
- Custom events and measurements
- Device and browser information
- User engagement metrics

### 🎯 User Experience
- **Responsive Design**: Optimized for desktop and mobile devices
- **Futuristic UI**: Cyberpunk-inspired interface with neon accents
- **Interactive Artifacts**: Hover effects, animations, and detailed descriptions
- **Room Navigation**: Quick travel between galleries with smooth camera transitions
- **Loading Experience**: Elegant loading screen with progress updates
- **Accessibility**: Keyboard navigation, high contrast mode support, reduced motion options

### 🚀 Technical Stack
- **TypeScript**: Type-safe development
- **Three.js**: 3D graphics rendering
- **Vite**: Fast build tool and dev server
- **GSAP**: Smooth animations
- **Azure Application Insights**: Comprehensive analytics
- **Azure Static Web Apps**: Hosting and deployment

## Project Structure

```
BupaMuseum/
├── src/
│   ├── analytics/
│   │   └── insights.ts          # Azure Application Insights integration
│   ├── config/
│   │   └── rooms.ts              # Room configurations and artifacts
│   ├── core/
│   │   ├── Artifact.ts           # Artifact class with 3D models
│   │   ├── Museum.ts             # Main museum controller
│   │   └── Room.ts               # Room class with lighting
│   ├── utils/
│   │   └── Controls.ts           # First-person controls
│   ├── main.ts                   # Application entry point
│   └── style.css                 # Additional styles
├── index.html                    # Main HTML file with UI
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
├── staticwebapp.config.json      # Azure Static Web Apps config
└── README.md                     # This file
```

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BupaMuseum
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Azure Deployment

### Azure Static Web Apps

This project is configured for deployment to Azure Static Web Apps.

1. **Create an Azure Static Web App**:
   - Go to Azure Portal
   - Create a new Static Web App resource
   - Connect to your GitHub repository

2. **Configure Secrets**:
   - Add `AZURE_STATIC_WEB_APPS_API_TOKEN` to your GitHub repository secrets

3. **Deploy**:
   - Push to the `main` branch or create a pull request
   - GitHub Actions will automatically build and deploy

### Azure Application Insights

The application is pre-configured with Azure Application Insights:
- **Instrumentation Key**: `9c82bbb2-4489-4887-a451-19997f30a3a2`
- **Region**: West Europe
- **Application ID**: `6850bd57-7061-4e4b-991a-58a3cc5211ed`

To view analytics:
1. Go to Azure Portal
2. Navigate to Application Insights
3. View metrics, logs, and user behavior data

## Controls

- **WASD / Arrow Keys**: Move around
- **Mouse**: Look around (click to lock pointer)
- **Shift**: Sprint
- **Space**: Jump
- **Click**: Interact with artifacts
- **Navigation Menu**: Quickly travel between rooms

## Galleries

### 1. Entrance Hall
Welcome to the museum with introductory artifacts including the Welcome Crystal, Temporal Hologram, and Guardian Sculpture.

### 2. Ancient Civilizations
Explore artifacts from humanity's earliest cultures including the Pharaoh's Crown, Mesopotamian Tablet, Greek Amphora, Mayan Calendar Stone, and Chinese Oracle Bone.

### 3. Renaissance Gallery
Experience the rebirth of art and science with works including Portrait of a Scholar, The Mechanical Lion, Celestial Sphere, and more.

### 4. Modern Art Wing
Bold expressions of the 20th and 21st centuries featuring Chromatic Explosion, Deconstructed Reality, Digital Dreams, and contemporary masterpieces.

### 5. Future Visions
Peer into tomorrow with cutting-edge concepts including Quantum Entanglement, Neural Network, Terraformed Mars, Singularity Core, and other futuristic wonders.

## Analytics Tracked

The following user interactions and metrics are tracked:

### Session Tracking
- Session start/end with duration
- Device information (user agent, screen resolution, viewport)
- Browser capabilities
- Total rooms visited
- Total artifact interactions

### Room Analytics
- Entry/exit events for each room
- Time spent in each room
- Navigation patterns between rooms
- Room type and characteristics

### Artifact Interactions
- Hover events (when user looks at artifacts)
- Click events (when user interacts)
- Artifact type and name
- Room context for each interaction

### Movement & View
- User position and velocity (sampled)
- Camera view direction (sampled)
- Movement patterns

### Performance
- FPS (frames per second)
- Render time
- Triangle count
- Performance snapshots

### Custom Events
- Window resize
- Room navigation
- User engagement duration
- Error tracking with context

## Performance Optimizations

- Dynamic level of detail (LOD)
- Efficient shadow mapping
- Optimized particle systems
- Asset chunking and lazy loading
- WebGL renderer optimizations
- Sampling of analytics data (to reduce overhead)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires WebGL 2.0 support.

## Accessibility

- Keyboard navigation support
- High contrast mode compatibility
- Reduced motion preferences respected
- ARIA labels for UI elements
- Screen reader friendly navigation menu

## Development

### Code Structure

The codebase follows object-oriented principles:

- **Museum**: Main controller managing scene, renderer, and rooms
- **Room**: Individual gallery with walls, floor, ceiling, lighting, and artifacts
- **Artifact**: 3D objects with interactions, animations, and metadata
- **Controls**: First-person camera controls
- **Analytics**: Comprehensive tracking integration

### Adding New Rooms

Edit `src/config/rooms.ts` and add a new room configuration:

```typescript
{
  name: 'myroom',
  displayName: 'My Custom Room',
  description: 'Description of my room',
  type: 'gallery',
  position: new THREE.Vector3(0, 0, 50),
  size: { width: 20, height: 5, depth: 20 },
  wallColor: 0x1a1a2e,
  floorColor: 0x0f0f1e,
  ceilingColor: 0x16213e,
  ambientLightColor: 0x4a5568,
  ambientLightIntensity: 0.4,
  artifacts: [/* artifact configs */]
}
```

### Adding New Artifacts

Add artifact configurations to a room's `artifacts` array:

```typescript
{
  name: 'My Artifact',
  description: 'Description of the artifact',
  type: 'crystal', // or 'sculpture', 'painting', 'relic', 'hologram'
  position: new THREE.Vector3(0, 0, 0),
  scale: 1.0,
  color: 0x00ffff,
  emissive: 0x003333
}
```

## License

This project is licensed under the MIT License.

## Credits

- **Three.js**: 3D graphics library
- **GSAP**: Animation library
- **Azure Application Insights**: Analytics platform
- **Google Fonts**: Orbitron and Space Grotesk fonts

## Support

For issues, questions, or contributions, please open an issue or pull request on GitHub.

---

**Experience the Museum of the Future** - Where art, technology, and analytics converge in an immersive 3D journey through time.
