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

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function writeLatestResult(result: SavedSimulationResult): void {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
}

export function readLatestResult(): SavedSimulationResult | null {
  if (!canUseSessionStorage()) {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(RESULT_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as SavedSimulationResult;
  } catch {
    return null;
  }
}

export function clearLatestResult(): void {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(RESULT_STORAGE_KEY);
}

export function writeEditorSnapshot(snapshot: EditorSnapshot): void {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(snapshot));
}

export function readEditorSnapshot(): EditorSnapshot | null {
  if (!canUseSessionStorage()) {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(EDITOR_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as EditorSnapshot;
  } catch {
    return null;
  }
}

export function clearEditorSnapshot(): void {
  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(EDITOR_STORAGE_KEY);
}
