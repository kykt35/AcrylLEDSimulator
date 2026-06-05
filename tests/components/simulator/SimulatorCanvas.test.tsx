import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { SimulatorCanvas } from "@/components/simulator/SimulatorCanvas";
import { getAcrylicSizePreset } from "@/lib/simulator/acrylicSizePresets";

const simulatorCanvasMockState = vi.hoisted(() => ({
  throwOnRender: false
}));

vi.mock("@react-three/fiber", () => ({
  Canvas: ({
    children,
    gl,
    onCreated
  }: {
    children: React.ReactNode;
    gl?: { preserveDrawingBuffer?: boolean };
    onCreated?: (state: { gl: { domElement: HTMLCanvasElement } }) => void;
  }) => {
    if (simulatorCanvasMockState.throwOnRender) {
      throw new Error("WebGL blocked");
    }

    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

    React.useEffect(() => {
      if (canvasRef.current) {
        onCreated?.({ gl: { domElement: canvasRef.current } });
      }
    }, [onCreated]);

    return (
      <div data-testid="r3f-canvas" data-preserve-drawing-buffer={String(Boolean(gl?.preserveDrawingBuffer))}>
        <canvas ref={canvasRef} data-testid="webgl-dom-element" />
        {children}
      </div>
    );
  },
  useThree: () => ({
    camera: {
      position: { set: vi.fn() },
      lookAt: vi.fn()
    }
  })
}));

vi.mock("@/components/simulator/AcrylicStandMesh", () => ({
  AcrylicStandMesh: ({
    imageUrl,
    engravingImageUrl,
    isEngravingMode,
    sizePreset,
    heightAttenuation
  }: {
    imageUrl?: string | null;
    engravingImageUrl?: string | null;
    isEngravingMode?: boolean;
    sizePreset?: { id: string };
    heightAttenuation?: number;
  }) => (
    <div
      data-testid="acrylic-stand-mesh"
      data-image-url={imageUrl ?? ""}
      data-engraving-image-url={engravingImageUrl ?? ""}
      data-is-engraving-mode={String(Boolean(isEngravingMode))}
      data-size-preset={sizePreset?.id ?? ""}
      data-height-attenuation={heightAttenuation ?? ""}
    />
  )
}));

vi.mock("@/components/simulator/LedBaseMesh", () => ({
  LedBaseMesh: ({ sizePreset }: { sizePreset?: { id: string } }) => (
    <div data-testid="led-base-mesh" data-size-preset={sizePreset?.id ?? ""} />
  )
}));

vi.mock("@/components/simulator/SceneLighting", () => ({
  SceneLighting: () => <div data-testid="scene-lighting" />
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />
}));

describe("SimulatorCanvas", () => {
  beforeEach(() => {
    simulatorCanvasMockState.throwOnRender = false;
  });

  it("renders the canvas container and propagates the size preset", () => {
    render(
      <SimulatorCanvas
        imageUrl="data:image/png;base64,source"
        engravingImageUrl="data:image/png;base64,engraving"
        sizePreset={getAcrylicSizePreset("large")}
        heightAttenuation={0.45}
      />
    );

    expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("r3f-canvas")).toHaveAttribute("data-preserve-drawing-buffer", "true");
    expect(screen.getByTestId("acrylic-stand-mesh")).toBeInTheDocument();
    expect(screen.getByTestId("acrylic-stand-mesh")).toHaveAttribute(
      "data-engraving-image-url",
      "data:image/png;base64,engraving"
    );
    expect(screen.getByTestId("acrylic-stand-mesh")).toHaveAttribute("data-is-engraving-mode", "false");
    expect(screen.getByTestId("acrylic-stand-mesh")).toHaveAttribute("data-size-preset", "large");
    expect(screen.getByTestId("acrylic-stand-mesh")).toHaveAttribute("data-height-attenuation", "0.45");
    expect(screen.getByTestId("led-base-mesh")).toHaveAttribute("data-size-preset", "large");
  });

  it("shows a retry fallback when the WebGL context is lost", () => {
    render(<SimulatorCanvas imageUrl="data:image/png;base64,source" />);

    const webglCanvas = screen.getByTestId("webgl-dom-element");
    fireEvent(webglCanvas, new Event("webglcontextlost", { cancelable: true }));

    expect(screen.getByText("3D プレビューを表示できません")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3Dプレビューを再読み込み" })).toBeInTheDocument();
  });

  it("shows a retry fallback when the WebGL renderer cannot be created", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    simulatorCanvasMockState.throwOnRender = true;

    render(<SimulatorCanvas imageUrl="data:image/png;base64,source" />);

    expect(screen.getByText("3D プレビューを表示できません")).toBeInTheDocument();
    expect(screen.queryByTestId("r3f-canvas")).not.toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });
});
