import { Suspense, lazy, Component, type ReactNode, type ErrorInfo } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

// ── ERROR BOUNDARY ──────────────────────────────────────────────────────────
class SplineErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Spline Scene Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-slate-950/50 backdrop-blur-sm border border-electric-blue-500/20 rounded-xl">
          <div className="flex flex-col items-center gap-2 text-electric-blue-400/60 font-mono text-sm">
            <span className="opacity-50">[ ERROR_INITIALIZING_3D_CORE ]</span>
            <span className="text-[10px] uppercase tracking-widest">Graphics context unavailable</span>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <SplineErrorBoundary>
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-8 h-8 border-2 border-electric-blue-500/30 border-t-electric-blue-400 rounded-full animate-spin"
              />
              <span className="terminal-label">LOADING_SCENE</span>
            </div>
          </div>
        }
      >
        <Spline scene={scene} className={className} />
      </Suspense>
    </SplineErrorBoundary>
  );
}
