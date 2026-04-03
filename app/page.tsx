import Link from "next/link";
import React from "react";
import { NoticeModal } from "@/components/modals/NoticeModal";

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">MVP Acrylic LED Simulator</p>
          <h1 className="hero-title">
            LEDアクスタの見え方を
            <br />
            保存前に確認する
          </h1>
          <p className="hero-description">
            PNG を読み込み、発光色や明るさ、背景、カメラを調整しながら仕上がりイメージをその場で確認できます。
            MVP では、アップロードから保存までの主要フローをデスクトップ中心で成立させます。
          </p>
          <div className="hero-actions">
            <Link href="/simulator" className="primary-link">
              試してみる
            </Link>
            <NoticeModal triggerLabel="注意事項を見る" />
          </div>
        </div>

        <div className="hero-card">
          <p className="card-label">できること</p>
          <ul className="feature-list">
            <li>透過 PNG を 3D プレビューへ即時反映</li>
            <li>LED 色と明るさをプリセット操作で調整</li>
            <li>背景切替とカメラ切替で見え方を比較</li>
            <li>現在の表示を画像として保存</li>
          </ul>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <p className="section-kicker">Flow</p>
          <h2>保存までの流れ</h2>
        </div>
        <div className="steps-grid">
          <article className="info-card">
            <p className="card-label">01 Upload</p>
            <h3>PNG を読み込む</h3>
            <p>透過 PNG をアップロードし、アクリル板へ即時反映します。</p>
          </article>
          <article className="info-card">
            <p className="card-label">02 Adjust</p>
            <h3>見え方を調整する</h3>
            <p>LED 色、明るさ、背景、カメラを切り替えてプレビューを確認します。</p>
          </article>
          <article className="info-card">
            <p className="card-label">03 Save</p>
            <h3>結果を保存する</h3>
            <p>現在のプレビューを画像として保存し、保存結果画面で確認します。</p>
          </article>
        </div>
      </section>
    </main>
  );
}
