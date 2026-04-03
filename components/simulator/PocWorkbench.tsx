"use client";

import React, { useRef, useState } from "react";
import { ExportPreviewButton } from "@/components/actions/ExportPreviewButton";
import { LightingControls } from "@/components/controls/LightingControls";
import { SimulatorCanvas } from "@/components/simulator/SimulatorCanvas";
import { ImageUploader } from "@/components/upload/ImageUploader";
import { getLightingPreset, lightingPresets } from "@/lib/simulator/lightingPresets";

export function PocWorkbench() {
  const previewRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState("未選択");
  const [activePresetId, setActivePresetId] = useState(lightingPresets[0].id);
  const [brightness, setBrightness] = useState(1.2);
  const [cameraPreset, setCameraPreset] = useState("front");
  const [exportedImage, setExportedImage] = useState<string | null>(null);
  const activePreset = getLightingPreset(activePresetId);

  return (
    <div
      style={{
        display: "grid",
        gap: "20px",
        gridTemplateColumns: "minmax(0, 1.8fr) minmax(300px, 0.9fr)"
      }}
    >
      <section
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "20px",
          padding: "20px",
          backdropFilter: "blur(18px)"
        }}
      >
          <div style={{ display: "grid", gap: "14px" }}>
            <div>
              <p style={{ margin: "0 0 8px", color: "var(--muted)" }}>3D Preview</p>
              <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Canvas mount verification</h2>
            </div>
            <SimulatorCanvas
              imageUrl={imageUrl}
              glowColor={activePreset.glowColor}
              background={activePreset.background}
              brightness={brightness}
              cameraPreset={cameraPreset}
              containerRef={previewRef}
            />
        </div>
      </section>

      <aside
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: "20px",
          padding: "20px",
          backdropFilter: "blur(18px)"
        }}
      >
        <div style={{ display: "grid", gap: "18px" }}>
          <section>
            <p style={{ margin: "0 0 8px", color: "var(--muted)" }}>Milestone</p>
            <strong>M2 PoC 完了</strong>
            <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.7 }}>
              透過 PNG、発光、カメラ、画像書き出しの成立性を順次確認します。
            </p>
          </section>

          <ImageUploader
            onImageSelected={({ src, name }) => {
              setImageUrl(src);
              setFileName(name);
            }}
          />

          <LightingControls
            activePresetId={activePresetId}
            brightness={brightness}
            activeCameraPreset={cameraPreset}
            onPresetChange={setActivePresetId}
            onBrightnessChange={setBrightness}
            onCameraPresetChange={setCameraPreset}
          />

          <ExportPreviewButton previewRoot={previewRef.current} onExported={setExportedImage} />

          <section>
            <p style={{ margin: "0 0 8px", color: "var(--muted)" }}>現在の入力</p>
            <p style={{ margin: "0 0 6px" }}>{fileName}</p>
            <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.7 }}>
              透過 PNG の反映可否と、発光プリセットごとの差を PoC として確認します。
            </p>
          </section>

          {exportedImage ? (
            <section style={{ display: "grid", gap: "8px" }}>
              <p style={{ margin: "0 0 4px", color: "var(--muted)" }}>直近の書き出し</p>
              <img
                src={exportedImage}
                alt="書き出したプレビュー"
                style={{ width: "100%", borderRadius: "14px", border: "1px solid var(--line)" }}
              />
            </section>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
