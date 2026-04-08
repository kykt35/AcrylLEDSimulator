export type LightingPreset = {
  id: string;
  label: string;
  glowColor: string;
};

export const lightingPresets: LightingPreset[] = [
  {
    id: "ice-blue",
    label: "Ice Blue",
    glowColor: "#7fe7ff"
  },
  {
    id: "sunset-pink",
    label: "Sunset Pink",
    glowColor: "#ff8ac2"
  },
  {
    id: "lime",
    label: "Lime",
    glowColor: "#c6ff76"
  },
  {
    id: "warm-white",
    label: "Warm White",
    glowColor: "#ffe6b7"
  },
  {
    id: "cool-white",
    label: "Cool White",
    glowColor: "#dff4ff"
  }
];

export function getLightingPreset(id: string): LightingPreset {
  return lightingPresets.find((preset) => preset.id === id) ?? lightingPresets[0];
}
