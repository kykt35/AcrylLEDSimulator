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
            LEDアクスタの彫刻データと見え方を
            <br />
            まとめて確認する
          </h1>
          <p className="hero-description">
            PNG を読み込むと彫刻用グレースケール画像を生成し、LED の発光色や明るさ、背景、カメラを切り替えながら
            完成イメージを確認できます。MVP では、入力から彫刻用 PNG とシミュレーション画像の出力までを 1 画面で完結させます。
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
            <li>彫刻用グレースケール画像を自動生成して調整</li>
            <li>LED 色と明るさをプリセット操作で調整</li>
            <li>背景切替とカメラ切替で見え方を比較</li>
            <li>彫刻用 PNG と現在の表示をそれぞれダウンロード</li>
          </ul>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <p className="section-kicker">Flow</p>
          <h2>出力までの流れ</h2>
        </div>
        <div className="steps-grid">
          <article className="info-card">
            <p className="card-label">01 Upload</p>
            <h3>PNG を読み込む</h3>
            <p>透過 PNG をアップロードし、アクリル板へ即時反映します。</p>
          </article>
          <article className="info-card">
            <p className="card-label">02 Adjust</p>
            <h3>彫刻データを調整する</h3>
            <p>しきい値やコントラストを調整し、彫刻用グレースケール画像を確認します。</p>
          </article>
          <article className="info-card">
            <p className="card-label">03 Simulate</p>
            <h3>LED 導光の見え方を確認する</h3>
            <p>彫刻部がどのように光るかを 3D プレビューで確認し、必要に応じて画像を書き出します。</p>
          </article>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <p className="section-kicker">Before You Start</p>
          <h2>事前に確認しておくこと</h2>
        </div>
        <div className="steps-grid">
          <article className="info-card">
            <p className="card-label">PNG</p>
            <h3>透過画像を用意する</h3>
            <p>背景が透過された PNG だと彫刻対象が明確になり、アクリル板の見え方を確認しやすくなります。</p>
          </article>
          <article className="info-card">
            <p className="card-label">Engraving</p>
            <h3>白が強く光る前提で調整する</h3>
            <p>黒は未彫刻、白は強彫刻として扱うため、グレースケール preview を見ながら調整してください。</p>
          </article>
          <article className="info-card">
            <p className="card-label">Notice</p>
            <h3>実物との差異を読む</h3>
            <p>光り方や色味は実機と差が出るため、注意事項を合わせて確認します。</p>
          </article>
        </div>
      </section>
    </main>
  );
}
