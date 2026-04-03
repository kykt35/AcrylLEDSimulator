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
  AcrylicStandMesh: () => <div data-testid="acrylic-stand-mesh" />
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />
}));

describe("SimulatorCanvas", () => {
  it("renders the canvas container", () => {
    render(<SimulatorCanvas />);

    expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
    expect(screen.getByTestId("r3f-canvas")).toHaveAttribute("data-preserve-drawing-buffer", "true");
    expect(screen.getByTestId("acrylic-stand-mesh")).toBeInTheDocument();
  });
});
