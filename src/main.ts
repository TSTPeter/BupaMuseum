import { Museum } from './core/Museum';
import './style.css';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initializeMuseum();
});

async function initializeMuseum(): Promise<void> {
  const loadingScreen = document.getElementById('loading-screen');
  const loadingProgress = document.querySelector('.loading-progress') as HTMLElement;
  const canvasContainer = document.getElementById('canvas-container');

  if (!canvasContainer) {
    console.error('Canvas container not found');
    return;
  }

  try {
    // Simulate loading assets
    const loadingSteps = [
      'Loading 3D Engine...',
      'Initializing Analytics...',
      'Building Museum Rooms...',
      'Creating Artifacts...',
      'Setting Up Lighting...',
      'Preparing Experience...'
    ];

    for (let i = 0; i < loadingSteps.length; i++) {
      if (loadingProgress) {
        loadingProgress.textContent = loadingSteps[i];
      }
      await sleep(300);
    }

    // Initialize the museum
    const museum = new Museum(canvasContainer);

    // Update visitor count (simulated)
    const visitorCountEl = document.getElementById('visitor-count');
    if (visitorCountEl) {
      const count = Math.floor(Math.random() * 500) + 100;
      visitorCountEl.textContent = count.toString();
    }

    // Hide loading screen
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          loadingScreen.style.display = 'none';
        }, 500);
      }, 500);
    }

    // Show instructions after a delay
    setTimeout(() => {
      showInstructions();
    }, 2000);

  } catch (error) {
    console.error('Failed to initialize museum:', error);
    if (loadingProgress) {
      loadingProgress.textContent = 'Error loading museum. Please refresh.';
      loadingProgress.style.color = '#ff0000';
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function showInstructions(): void {
  // Check if user has seen instructions before
  const hasSeenInstructions = localStorage.getItem('museumInstructionsSeen');

  if (!hasSeenInstructions) {
    const controlsHint = document.getElementById('controls-hint');
    if (controlsHint) {
      controlsHint.style.animation = 'pulse 2s ease-in-out 3';
      localStorage.setItem('museumInstructionsSeen', 'true');
    }
  }
}

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0%, 100% {
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }
    50% {
      transform: translateX(-50%) scale(1.05);
      opacity: 0.9;
    }
  }
`;
document.head.appendChild(style);

// Handle visibility change to pause/resume tracking
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    console.log('Museum experience paused');
  } else {
    console.log('Museum experience resumed');
  }
});

// Export for potential external use
export { Museum };
