export type LightingPreset = {
  id: string;
  label: string;
  glowColor: string;
  background: string;
};

export const lightingPresets: LightingPreset[] = [
  {
    id: "ice-blue",
    label: "Ice Blue",
    glowColor: "#7fe7ff",
    background: "#07111f"
  },
  {
    id: "sunset-pink",
    label: "Sunset Pink",
    glowColor: "#ff8ac2",
    background: "#170615"
  },
  {
    id: "lime",
    label: "Lime",
    glowColor: "#c6ff76",
    background: "#081307"
  }
];

export function getLightingPreset(id: string): LightingPreset {
  return lightingPresets.find((preset) => preset.id === id) ?? lightingPresets[0];
}
