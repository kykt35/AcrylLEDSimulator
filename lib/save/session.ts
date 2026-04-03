export type SimulationSnapshot = {
  ledColorId: string;
  brightness: number;
  backgroundId: string;
  cameraPresetId: string;
};

export type EditorSnapshot = {
  sourceImage: {
    fileName: string;
    src: string | null;
  };
  simulation: SimulationSnapshot;
};

export type SavedSimulationResult = {
  savedSimulationId: string;
  resultImageUrl: string;
  savedAt: string;
  sourceImage: {
    fileName: string;
    src: string | null;
  };
  simulation: SimulationSnapshot;
};

const RESULT_STORAGE_KEY = "acryl-led-simulator:result";
const EDITOR_STORAGE_KEY = "acryl-led-simulator:editor";
let latestResultMemory: SavedSimulationResult | null = null;
let editorSnapshotMemory: EditorSnapshot | null = null;

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function writeLatestResult(result: SavedSimulationResult): void {
  latestResultMemory = result;

  if (!canUseSessionStorage()) {
    return;
  }

  try {
    window.sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
  } catch {
    // Fall back to in-memory storage when browser quota is exceeded.
  }
}

export function readLatestResult(): SavedSimulationResult | null {
  if (!canUseSessionStorage()) {
    return latestResultMemory;
  }

  const rawValue = window.sessionStorage.getItem(RESULT_STORAGE_KEY);

  if (!rawValue) {
    return latestResultMemory;
  }

  try {
    return JSON.parse(rawValue) as SavedSimulationResult;
  } catch {
    return latestResultMemory;
  }
}

export function clearLatestResult(): void {
  latestResultMemory = null;

  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(RESULT_STORAGE_KEY);
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
