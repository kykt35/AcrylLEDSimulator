import React from "react";
import { render } from "@testing-library/react";
import { AcrylicStandMesh } from "@/components/simulator/AcrylicStandMesh";
import { getAcrylicSizePreset } from "@/lib/simulator/acrylicSizePresets";

const useTextureMock = vi.fn((value?: string) => ({ value }));

vi.mock("@react-three/drei", () => ({
  useTexture: (value: string) => useTextureMock(value)
}));

vi.mock("@/components/simulator/EngravingGlowMaterial", () => ({
  EngravingGlowMaterial: () => <div data-testid="engraving-glow-material" />
}));

describe("AcrylicStandMesh", () => {
  beforeEach(() => {
    useTextureMock.mockClear();
  });

  it("loads the provided image texture when an image is present", () => {
    render(
      <AcrylicStandMesh
        imageUrl="data:image/png;base64,abc"
        engravingImageUrl="data:image/png;base64,engraving"
      />
    );

    expect(useTextureMock).toHaveBeenCalledWith("data:image/png;base64,abc");
  });

  it("falls back to a transparent pixel when no image is present", () => {
    render(<AcrylicStandMesh />);

    expect(useTextureMock).toHaveBeenCalledWith(expect.stringContaining("data:image/png;base64,"));
  });

  it("uses the selected size preset for the acrylic geometry", () => {
    const { container } = render(<AcrylicStandMesh sizePreset={getAcrylicSizePreset("large")} />);

    expect(container.querySelector("boxGeometry")).toHaveAttribute("args", "1.9,2.75,0.08");
    expect(container.querySelector("planeGeometry")).toHaveAttribute("args", "1.88,2.73");
  });
});
