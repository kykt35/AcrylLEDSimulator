import React from "react";
import { render } from "@testing-library/react";
import { AcrylicStandMesh } from "@/components/simulator/AcrylicStandMesh";

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
        showSourceOverlay={true}
      />
    );

    expect(useTextureMock).toHaveBeenCalledWith("data:image/png;base64,abc");
  });

  it("falls back to a transparent pixel when no image is present", () => {
    render(<AcrylicStandMesh />);

    expect(useTextureMock).toHaveBeenCalledWith(expect.stringContaining("data:image/png;base64,"));
  });
});
