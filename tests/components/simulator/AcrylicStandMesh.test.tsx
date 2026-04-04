import React from "react";
import { render } from "@testing-library/react";
import { AcrylicStandMesh } from "@/components/simulator/AcrylicStandMesh";

const textureState = {
  image: {
    width: 1200,
    height: 800
  },
  repeat: {
    set: vi.fn()
  },
  offset: {
    set: vi.fn()
  },
  needsUpdate: false,
  wrapS: 0,
  wrapT: 0
};
const useTextureMock = vi.fn((value?: string) => ({ ...textureState, value }));

vi.mock("@react-three/drei", () => ({
  useTexture: (value: string) => useTextureMock(value)
}));

vi.mock("@/components/simulator/EngravingGlowMaterial", () => ({
  EngravingGlowMaterial: () => <div data-testid="engraving-glow-material" />
}));

describe("AcrylicStandMesh", () => {
  beforeEach(() => {
    useTextureMock.mockClear();
    textureState.repeat.set.mockClear();
    textureState.offset.set.mockClear();
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

  it("applies cover layout transforms to the overlay texture", () => {
    render(
      <AcrylicStandMesh
        imageUrl="data:image/png;base64,abc"
        imageLayout={{
          contentFit: "cover",
          scale: 1.2,
          offsetX: 20,
          offsetY: -10
        }}
      />
    );

    expect(textureState.repeat.set).toHaveBeenCalled();
    expect(textureState.offset.set).toHaveBeenCalled();
  });
});
