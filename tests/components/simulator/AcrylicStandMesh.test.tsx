import React from "react";
import { render, screen } from "@testing-library/react";
import { AcrylicStandMesh } from "@/components/simulator/AcrylicStandMesh";

vi.mock("@react-three/drei", () => ({
  useTexture: () => ({})
}));

describe("AcrylicStandMesh", () => {
  it("marks the mesh as loaded when an image is present", () => {
    render(<AcrylicStandMesh imageUrl="data:image/png;base64,abc" />);

    expect(screen.getByTestId("acrylic-stand-mesh")).toHaveAttribute("data-image-loaded", "true");
  });
});
