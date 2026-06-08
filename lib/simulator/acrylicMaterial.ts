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
      emissiveIntensity: 0.14,
      opacity: 1.0,
      roughness: 0.12,
      metalness: 0.08
    };
  }

  return {
    color: "#8fe9ff",
    emissive: "#44d8ff",
    emissiveIntensity: 0.1,
    opacity: 0.42,
    roughness: 0.18,
    metalness: 0.06
  };
}
