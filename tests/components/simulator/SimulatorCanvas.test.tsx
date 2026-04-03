import React from "react";
import { render, screen } from "@testing-library/react";
import { SimulatorCanvas } from "@/components/simulator/SimulatorCanvas";

vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="r3f-canvas">{children}</div>
  )
}));

describe("SimulatorCanvas", () => {
  it("renders the canvas container", () => {
    render(<SimulatorCanvas />);

    expect(screen.getByTestId("r3f-canvas")).toBeInTheDocument();
  });
});
