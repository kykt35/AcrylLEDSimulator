export type BackgroundPreset = {
  id: string;
  label: string;
  background: string;
};

export const backgroundPresets: BackgroundPreset[] = [
  {
    id: "night",
    label: "Night Studio",
    background: "#07111f"
  },
  {
    id: "rose",
    label: "Rose Glow",
    background: "#170615"
  },
  {
    id: "forest",
    label: "Forest Green",
    background: "#081307"
  }
];

export const cameraOptions = [
  { id: "front", label: "正面" },
  { id: "tilt", label: "俯瞰" },
  { id: "detail", label: "接写" }
] as const;

export type CameraPresetId = (typeof cameraOptions)[number]["id"];

export function getBackgroundPreset(id: string): BackgroundPreset {
  return backgroundPresets.find((preset) => preset.id === id) ?? backgroundPresets[0];
}
