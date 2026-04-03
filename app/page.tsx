import React from "react";
import type { CSSProperties } from "react";
import { SimulatorCanvas } from "@/components/simulator/SimulatorCanvas";

const panelStyle: CSSProperties = {
  background: "var(--surface)",
  border: "1px solid var(--line)",
  borderRadius: "20px",
  padding: "20px",
  backdropFilter: "blur(18px)"
};

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px 24px 56px"
      }}
    >
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto"
        }}
      >
        <header
          style={{
            display: "grid",
            gap: "16px",
            marginBottom: "28px"
          }}
        >
          <p style={{ margin: 0, color: "var(--accent)", letterSpacing: "0.08em" }}>
            Phase 1 Proof of Concept
          </p>
          <div style={{ display: "grid", gap: "12px", maxWidth: "760px" }}>
            <h1 style={{ margin: 0, fontSize: "clamp(2.8rem, 6vw, 5.5rem)", lineHeight: 0.98 }}>
              LEDアクスタの見え方を
              <br />
              その場で検証する
            </h1>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.7 }}>
              MVP に必要な 3D 表現、発光表現、保存方式を見極めるための PoC シェルです。
              左側のプレビュー領域を主役にし、右側へ今後の操作パネルを組み込みます。
            </p>
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gap: "20px",
            gridTemplateColumns: "minmax(0, 1.8fr) minmax(300px, 0.9fr)"
          }}
        >
          <section style={panelStyle}>
            <div style={{ display: "grid", gap: "14px" }}>
              <div>
                <p style={{ margin: "0 0 8px", color: "var(--muted)" }}>3D Preview</p>
                <h2 style={{ margin: 0, fontSize: "1.4rem" }}>Canvas mount verification</h2>
              </div>
              <SimulatorCanvas />
            </div>
          </section>

          <aside style={panelStyle}>
            <div style={{ display: "grid", gap: "18px" }}>
              <section>
                <p style={{ margin: "0 0 8px", color: "var(--muted)" }}>Milestone</p>
                <strong>M2 PoC 完了</strong>
                <p style={{ margin: "8px 0 0", color: "var(--muted)", lineHeight: 1.7 }}>
                  透過 PNG、発光、カメラ、画像書き出しの成立性を順次確認します。
                </p>
              </section>

              <section>
                <p style={{ margin: "0 0 8px", color: "var(--muted)" }}>Scope</p>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "var(--text)", lineHeight: 1.8 }}>
                  <li>Canvas 表示とアプリ骨格の確認</li>
                  <li>アクリル板風の簡易表示</li>
                  <li>後続タスクで画像アップロードと発光表現を追加</li>
                </ul>
              </section>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
