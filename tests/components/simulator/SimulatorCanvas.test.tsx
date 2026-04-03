import React from "react";
import { render, screen } from "@testing-library/react";
import { SimulatorCanvas } from "@/components/simulator/SimulatorCanvas";

vi.mock("@react-three/fiber", () => ({
  Canvas: ({
    children,
    gl
  }: {
    children: React.ReactNode;
    gl?: { preserveDrawingBuffer?: boolean };
  }) => <div data-testid="r3f-canvas" data-preserve-drawing-buffer={String(Boolean(gl?.preserveDrawingBuffer))}>{children}</div>,
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
    engravingImageUrl
  }: {
    imageUrl?: string | null;
    engravingImageUrl?: string | null;
  }) => (
    <div
      data-testid="acrylic-stand-mesh"
      data-image-url={imageUrl ?? ""}
      data-engraving-image-url={engravingImageUrl ?? ""}
    />
  )
}));

vi.mock("@/components/simulator/LedBaseMesh", () => ({
  LedBaseMesh: () => <div data-testid="led-base-mesh" />
}));

vi.mock("@/components/simulator/SceneLighting", () => ({
  SceneLighting: () => <div data-testid="scene-lighting" />
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />
}));

describe("SimulatorCanvas", () => {
  it("renders the canvas container", () => {
    render(
      <SimulatorCanvas
        imageUrl="data:image/png;base64,source"
        engravingImageUrl="data:image/png;base64,engraving"
      />
    );

    expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("r3f-canvas")).toHaveAttribute("data-preserve-drawing-buffer", "true");
    expect(screen.getByTestId("acrylic-stand-mesh")).toBeInTheDocument();
    expect(screen.getByTestId("acrylic-stand-mesh")).toHaveAttribute(
      "data-engraving-image-url",
      "data:image/png;base64,engraving"
    );
  });
});
