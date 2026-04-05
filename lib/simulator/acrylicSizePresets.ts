export type AcrylicSizePresetId = "small" | "medium" | "large";

export type AcrylicSizePreset = {
  id: AcrylicSizePresetId;
  label: string;
  width: number;
  height: number;
  thickness: number;
  baseWidth: number;
  baseDepth: number;
  baseHeight: number;
  ledBarWidth: number;
  pointLightY: number;
  pointLightZ: number;
  cameraDistanceMultiplier: number;
};

export const acrylicSizePresets: readonly AcrylicSizePreset[] = [
  {
    id: "small",
    label: "S (100 x 150 mm)",
    width: 1.3,
    height: 1.95,
    thickness: 0.08,
    baseWidth: 0.92,
    baseDepth: 1.02,
    baseHeight: 0.24,
    ledBarWidth: 0.94,
    pointLightY: -0.95,
    pointLightZ: 0.32,
    cameraDistanceMultiplier: 0.9
  },
  {
    id: "medium",
    label: "M (120 x 180 mm)",
    width: 1.6,
    height: 2.4,
    thickness: 0.08,
    baseWidth: 1.1,
    baseDepth: 1.1,
    baseHeight: 0.26,
    ledBarWidth: 1.1,
    pointLightY: -1.15,
    pointLightZ: 0.35,
    cameraDistanceMultiplier: 1
  },
  {
    id: "large",
    label: "L (150 x 200 mm)",
    width: 1.9,
    height: 2.75,
    thickness: 0.08,
    baseWidth: 1.28,
    baseDepth: 1.22,
    baseHeight: 0.28,
    ledBarWidth: 1.3,
    pointLightY: -1.34,
    pointLightZ: 0.38,
    cameraDistanceMultiplier: 1.12
  }
] as const;

export const defaultAcrylicSizePresetId: AcrylicSizePresetId = "medium";

export function getAcrylicSizePreset(id: string): AcrylicSizePreset {
  return acrylicSizePresets.find((preset) => preset.id === id) ?? acrylicSizePresets[1];
}
