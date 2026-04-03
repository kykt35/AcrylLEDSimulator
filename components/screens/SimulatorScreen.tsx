"use client";

import Link from "next/link";
import React from "react";
import { PocWorkbench } from "@/components/simulator/PocWorkbench";

export function SimulatorScreen() {
  return (
    <main className="shell">
      <section className="simulator-header">
        <div>
          <p className="eyebrow">Simulator</p>
          <h1 className="page-title">LEDアクスタ シミュレーター</h1>
          <p className="page-description">
            画像の読み込み、見え方の調整、保存までを 1 画面で進めます。
          </p>
        </div>
        <div className="header-actions">
          <Link href="/" className="secondary-link">
            トップへ戻る
          </Link>
          <Link href="/result" className="ghost-link">
            保存結果を見る
          </Link>
        </div>
      </section>

      <PocWorkbench />
    </main>
  );
}
