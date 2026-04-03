import React from "react";
import { PocWorkbench } from "@/components/simulator/PocWorkbench";

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

        <PocWorkbench />
      </section>
    </main>
  );
}
