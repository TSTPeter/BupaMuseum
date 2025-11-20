import { ApplicationInsights } from '@microsoft/applicationinsights-web';

export class AnalyticsManager {
  private appInsights: ApplicationInsights;
  private sessionStartTime: number;
  private currentRoom: string = 'entrance';
  private roomVisitTimes: Map<string, number> = new Map();
  private artifactInteractions: number = 0;

  constructor() {
    this.sessionStartTime = Date.now();

    // Initialize Azure Application Insights
    this.appInsights = new ApplicationInsights({
      config: {
        instrumentationKey: '9c82bbb2-4489-4887-a451-19997f30a3a2',
        enableAutoRouteTracking: true,
        enableCorsCorrelation: true,
        enableRequestHeaderTracking: true,
        enableResponseHeaderTracking: true,
        enableAjaxPerfTracking: true,
        maxAjaxCallsPerView: 500,
        disableFetchTracking: false,
        disableExceptionTracking: false,
        disableTelemetry: false,
        enableDebug: false,
        loggingLevelConsole: 0,
        loggingLevelTelemetry: 1
      }
    });

    this.appInsights.loadAppInsights();
    this.trackSessionStart();
  }

  // Track session start with device and browser info
  private trackSessionStart(): void {
    this.appInsights.trackEvent({
      name: 'MuseumSessionStart',
      properties: {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewportSize: `${window.innerWidth}x${window.innerHeight}`,
        devicePixelRatio: window.devicePixelRatio,
        platform: navigator.platform,
        language: navigator.language,
        online: navigator.onLine,
        cookiesEnabled: navigator.cookieEnabled
      }
    });

    this.appInsights.trackPageView({
      name: 'Museum3DExperience',
      properties: {
        entryPoint: 'main',
        sessionId: this.getSessionId()
      }
    });
  }

  // Track room entry
  trackRoomEntry(roomName: string, roomType: string): void {
    const previousRoom = this.currentRoom;
    const previousVisitTime = this.roomVisitTimes.get(previousRoom) || 0;
    const timeInPreviousRoom = Date.now() - previousVisitTime;

    // Track exit from previous room
    if (previousRoom !== roomName) {
      this.appInsights.trackEvent({
        name: 'RoomExit',
        properties: {
          roomName: previousRoom,
          timeSpent: timeInPreviousRoom,
          timestamp: new Date().toISOString()
        },
        measurements: {
          durationMs: timeInPreviousRoom
        }
      });
    }

    // Track entry to new room
    this.currentRoom = roomName;
    this.roomVisitTimes.set(roomName, Date.now());

    this.appInsights.trackEvent({
      name: 'RoomEntry',
      properties: {
        roomName: roomName,
        roomType: roomType,
        timestamp: new Date().toISOString(),
        previousRoom: previousRoom
      }
    });

    this.appInsights.trackPageView({
      name: `Room_${roomName}`,
      properties: {
        roomType: roomType
      }
    });
  }

  // Track artifact interaction
  trackArtifactInteraction(artifactName: string, artifactType: string, action: string, roomName: string): void {
    this.artifactInteractions++;

    this.appInsights.trackEvent({
      name: 'ArtifactInteraction',
      properties: {
        artifactName: artifactName,
        artifactType: artifactType,
        action: action,
        roomName: roomName,
        timestamp: new Date().toISOString(),
        totalInteractions: this.artifactInteractions
      }
    });

    this.appInsights.trackMetric({
      name: 'ArtifactInteractions',
      average: 1
    });
  }

  // Track user movement patterns
  trackMovement(position: { x: number; y: number; z: number }, velocity: number): void {
    // Sample movement data (don't track every frame)
    if (Math.random() < 0.01) { // Sample 1% of movements
      this.appInsights.trackEvent({
        name: 'UserMovement',
        properties: {
          roomName: this.currentRoom,
          positionX: position.x.toFixed(2),
          positionY: position.y.toFixed(2),
          positionZ: position.z.toFixed(2),
          timestamp: new Date().toISOString()
        },
        measurements: {
          velocity: velocity
        }
      });
    }
  }

  // Track camera view (what user is looking at)
  trackViewDirection(direction: { x: number; y: number; z: number }): void {
    // Sample view data
    if (Math.random() < 0.02) { // Sample 2% of views
      this.appInsights.trackEvent({
        name: 'ViewDirection',
        properties: {
          roomName: this.currentRoom,
          directionX: direction.x.toFixed(2),
          directionY: direction.y.toFixed(2),
          directionZ: direction.z.toFixed(2),
          timestamp: new Date().toISOString()
        }
      });
    }
  }

  // Track performance metrics
  trackPerformance(fps: number, renderTime: number, triangleCount: number): void {
    this.appInsights.trackMetric({
      name: 'FPS',
      average: fps
    });

    this.appInsights.trackMetric({
      name: 'RenderTime',
      average: renderTime
    });

    this.appInsights.trackEvent({
      name: 'PerformanceSnapshot',
      properties: {
        roomName: this.currentRoom,
        timestamp: new Date().toISOString()
      },
      measurements: {
        fps: fps,
        renderTimeMs: renderTime,
        triangles: triangleCount
      }
    });
  }

  // Track errors
  trackError(error: Error, context: string): void {
    this.appInsights.trackException({
      exception: error,
      properties: {
        context: context,
        roomName: this.currentRoom,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Track custom events
  trackCustomEvent(eventName: string, properties?: Record<string, any>, measurements?: Record<string, number>): void {
    this.appInsights.trackEvent({
      name: eventName,
      properties: {
        ...properties,
        roomName: this.currentRoom,
        timestamp: new Date().toISOString()
      },
      measurements: measurements
    });
  }

  // Track session end
  trackSessionEnd(): void {
    const sessionDuration = Date.now() - this.sessionStartTime;
    const roomsVisited = Array.from(this.roomVisitTimes.keys());

    this.appInsights.trackEvent({
      name: 'MuseumSessionEnd',
      properties: {
        timestamp: new Date().toISOString(),
        roomsVisited: roomsVisited.join(','),
        totalRooms: roomsVisited.length,
        artifactInteractions: this.artifactInteractions
      },
      measurements: {
        sessionDurationMs: sessionDuration,
        totalInteractions: this.artifactInteractions
      }
    });

    this.appInsights.flush();
  }

  // Get unique session ID
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('museumSessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('museumSessionId', sessionId);
    }
    return sessionId;
  }

  // Track user engagement
  trackEngagement(engagementType: string, duration: number): void {
    this.appInsights.trackEvent({
      name: 'UserEngagement',
      properties: {
        engagementType: engagementType,
        roomName: this.currentRoom,
        timestamp: new Date().toISOString()
      },
      measurements: {
        durationMs: duration
      }
    });
  }
}
