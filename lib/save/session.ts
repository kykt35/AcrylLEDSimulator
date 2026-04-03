export type SimulationSnapshot = {
  ledColorId: string;
  brightness: number;
  backgroundId: string;
  cameraPresetId: string;
  showSourceOverlay: boolean;
};

export type EngravingSnapshot = {
  src: string | null;
  adjustments: {
    contrast: number;
    gamma: number;
    threshold: number;
    invert: boolean;
    edgeWeight: number;
  };
  averageStrength: number | null;
};

export type EditorSnapshot = {
  sourceImage: {
    fileName: string;
    src: string | null;
  };
  engraving: EngravingSnapshot;
  simulation: SimulationSnapshot;
};

const EDITOR_STORAGE_KEY = "acryl-led-simulator:editor";
let editorSnapshotMemory: EditorSnapshot | null = null;

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function writeEditorSnapshot(snapshot: EditorSnapshot): void {
  editorSnapshotMemory = snapshot;

  if (!canUseSessionStorage()) {
    return;
  }

  try {
    window.sessionStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Fall back to in-memory storage when browser quota is exceeded.
  }
}

export function readEditorSnapshot(): EditorSnapshot | null {
  if (!canUseSessionStorage()) {
    return editorSnapshotMemory;
  }

  const rawValue = window.sessionStorage.getItem(EDITOR_STORAGE_KEY);

  if (!rawValue) {
    return editorSnapshotMemory;
  }

  try {
    return JSON.parse(rawValue) as EditorSnapshot;
  } catch {
    return editorSnapshotMemory;
  }
}

export function clearEditorSnapshot(): void {
  editorSnapshotMemory = null;

  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(EDITOR_STORAGE_KEY);
}
