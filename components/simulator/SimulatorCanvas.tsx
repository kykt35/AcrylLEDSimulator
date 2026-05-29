"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { AcrylicStandMesh } from "@/components/simulator/AcrylicStandMesh";
import { CameraController } from "@/components/simulator/CameraController";
import { LedBaseMesh } from "@/components/simulator/LedBaseMesh";
import { SceneLighting } from "@/components/simulator/SceneLighting";
import {
  getAcrylicSizePreset,
  type AcrylicSizePreset
} from "@/lib/simulator/acrylicSizePresets";

type SimulatorCanvasProps = {
  imageUrl?: string | null;
  engravingImageUrl?: string | null;
  sizePreset?: AcrylicSizePreset;
  showSourceOverlay?: boolean;
  glowColor?: string;
  brightness?: number;
  heightAttenuation?: number;
  background?: string;
  cameraPreset?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

type WebGLBoundaryProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
  resetKey: number;
};

type WebGLBoundaryState = {
  hasError: boolean;
};

class WebGLBoundary extends React.Component<WebGLBoundaryProps, WebGLBoundaryState> {
  state: WebGLBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(): WebGLBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(previousProps: WebGLBoundaryProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

type WebGLFallbackProps = {
  onRetry: () => void;
};

function WebGLFallback({ onRetry }: WebGLFallbackProps) {
  return (
    <div className="webgl-fallback" role="status">
      <p className="status-title">3D プレビューを表示できません</p>
      <p className="status-secondary">
        ブラウザが 3D 表示を一時停止しました。再読み込みして 3D プレビューの復旧を試してください。
      </p>
      <button type="button" className="secondary-button compact" onClick={onRetry}>
        3Dプレビューを再読み込み
      </button>
    </div>
  );
}

export function SimulatorCanvas({
  imageUrl,
  engravingImageUrl,
  sizePreset = getAcrylicSizePreset("medium"),
  showSourceOverlay = false,
  glowColor = "#7fe7ff",
  brightness = 1,
  heightAttenuation = 0.3,
  background = "#07111f",
  cameraPreset = "front",
  containerRef
}: SimulatorCanvasProps) {
  const [canvasResetKey, setCanvasResetKey] = React.useState(0);
  const [isContextLost, setIsContextLost] = React.useState(false);

  const retryWebGLPreview = React.useCallback(() => {
    setIsContextLost(false);
    setCanvasResetKey((currentKey) => currentKey + 1);
  }, []);

  const handleCanvasCreated = React.useCallback(
    ({ gl }: { gl: { domElement?: HTMLCanvasElement } }) => {
      setIsContextLost(false);
      gl.domElement?.addEventListener(
        "webglcontextlost",
        (event) => {
          event.preventDefault();
          setIsContextLost(true);
        },
        { once: true }
      );
    },
    []
  );

  const fallback = <WebGLFallback onRetry={retryWebGLPreview} />;

  return (
    <div ref={containerRef} className="simulator-canvas-host">
      {isContextLost ? (
        fallback
      ) : (
        <WebGLBoundary fallback={fallback} resetKey={canvasResetKey}>
          <Canvas
            key={canvasResetKey}
            camera={{ position: [0, 0.8, 4.6], fov: 36 }}
            gl={{ preserveDrawingBuffer: true }}
            onCreated={handleCanvasCreated}
          >
            <SceneLighting background={background} glowColor={glowColor} brightness={brightness} />
            <AcrylicStandMesh
              imageUrl={imageUrl}
              engravingImageUrl={engravingImageUrl}
              sizePreset={sizePreset}
              showSourceOverlay={showSourceOverlay}
              glowColor={glowColor}
              brightness={brightness}
              heightAttenuation={heightAttenuation}
            />
            <LedBaseMesh sizePreset={sizePreset} glowColor={glowColor} brightness={brightness} />
            <CameraController preset={cameraPreset} sizePreset={sizePreset} />
          </Canvas>
        </WebGLBoundary>
      )}
    </div>
  );
}
