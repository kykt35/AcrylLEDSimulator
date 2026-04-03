export type AcrylicMaterialPreset = {
  color: string;
  emissive: string;
  emissiveIntensity: number;
  opacity: number;
  roughness: number;
  metalness: number;
};

export function getAcrylicMaterialPreset(hasTexture: boolean): AcrylicMaterialPreset {
  if (hasTexture) {
    return {
      color: "#f3fbff",
      emissive: "#7fe7ff",
      emissiveIntensity: 0.28,
      opacity: 0.88,
      roughness: 0.14,
      metalness: 0.08
    };
  }

  return {
    color: "#8fe9ff",
    emissive: "#44d8ff",
    emissiveIntensity: 0.18,
    opacity: 0.58,
    roughness: 0.18,
    metalness: 0.06
  };
}
