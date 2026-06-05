import {
  defaultAcrylicSizePresetId,
  type AcrylicSizePresetId
} from "@/lib/simulator/acrylicSizePresets";
import { defaultEngravingAdjustments } from "@/lib/image/engravingFilters";

export type SimulationSnapshot = {
  ledColorId: string;
  brightness: number;
  heightAttenuation?: number;
  backgroundId: string;
  cameraPresetId: string;
  acrylicSizeId: AcrylicSizePresetId;
  showSourceOverlay: boolean;
  imageLayout: {
    contentFit: "contain" | "cover" | "fill";
    scale: number;
    offsetX: number;
    offsetY: number;
  };
};

export type EngravingSnapshot = {
  src: string | null;
  adjustments: {
    contrast: number;
    gamma: number;
    threshold: number;
    invert: boolean;
    edgeWeight: number;
    toneLevels: number;
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

function normalizeEditorSnapshot(snapshot: EditorSnapshot): EditorSnapshot {
  return {
    ...snapshot,
    engraving: {
      ...snapshot.engraving,
      adjustments: {
        ...defaultEngravingAdjustments,
        ...snapshot.engraving.adjustments
      }
    },
    simulation: {
      ...snapshot.simulation,
      heightAttenuation: snapshot.simulation.heightAttenuation ?? 0.3,
      acrylicSizeId: snapshot.simulation.acrylicSizeId ?? defaultAcrylicSizePresetId
    }
  };
}

export function readEditorSnapshot(): EditorSnapshot | null {
  if (!canUseSessionStorage()) {
    return editorSnapshotMemory ? normalizeEditorSnapshot(editorSnapshotMemory) : null;
  }

  const rawValue = window.sessionStorage.getItem(EDITOR_STORAGE_KEY);

  if (!rawValue) {
    return editorSnapshotMemory ? normalizeEditorSnapshot(editorSnapshotMemory) : null;
  }

  try {
    return normalizeEditorSnapshot(JSON.parse(rawValue) as EditorSnapshot);
  } catch {
    return editorSnapshotMemory ? normalizeEditorSnapshot(editorSnapshotMemory) : null;
  }
}

export function clearEditorSnapshot(): void {
  editorSnapshotMemory = null;

  if (!canUseSessionStorage()) {
    return;
  }

  window.sessionStorage.removeItem(EDITOR_STORAGE_KEY);
}
