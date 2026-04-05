import React from "react";
import { render } from "@testing-library/react";
import { CameraController } from "@/components/simulator/CameraController";
import { getAcrylicSizePreset } from "@/lib/simulator/acrylicSizePresets";

const positionSet = vi.fn();
const lookAt = vi.fn();

vi.mock("@react-three/fiber", () => ({
  useThree: () => ({
    camera: {
      position: {
        set: positionSet
      },
      lookAt
    }
  })
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />
}));

describe("CameraController", () => {
  it("updates the camera when the preset changes", () => {
    const { rerender } = render(
      <CameraController preset="front" sizePreset={getAcrylicSizePreset("medium")} />
    );

    rerender(<CameraController preset="detail" sizePreset={getAcrylicSizePreset("large")} />);

    expect(positionSet).toHaveBeenCalledWith(0, 0.8, 4.6);
    expect(positionSet).toHaveBeenCalledWith(0.7, 0.25, 2.688);
    expect(lookAt).toHaveBeenCalledWith(0, -0.2, 0);
  });
});
