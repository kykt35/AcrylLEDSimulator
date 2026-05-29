import Link from "next/link";
import React from "react";
import { NoticeModal } from "@/components/modals/NoticeModal";

const usageSteps = [
  {
    label: "01 Upload",
    title: "PNG を追加する",
    description: "3D プレビューエリアへ透過 PNG をドラッグするか、クリックしてファイルを選択します。"
  },
  {
    label: "02 Adjust",
    title: "彫刻とライトを調整する",
    description: "彫刻用グレースケール、LED の色と明るさ、背景、カメラを切り替えて見え方を確認します。"
  },
  {
    label: "03 Export",
    title: "画像を書き出す",
    description: "彫刻用 PNG または現在のシミュレーション画像をダウンロードします。"
  }
];

const preparationItems = [
  {
    label: "PNG",
    title: "透過 PNG を用意する",
    description: "背景が透過された PNG を使うと、彫刻対象とアクリル板の見え方を確認しやすくなります。"
  },
  {
    label: "Preview",
    title: "白く残した部分が強く光る",
    description: "彫刻プレビューでは黒を未彫刻、白を強彫刻として扱います。しきい値やコントラストを見ながら調整します。"
  },
  {
    label: "Check",
    title: "実物との差異を確認する",
    description: "画面上の発光や色味は実機と差が出るため、注意事項も合わせて確認してください。"
  }
];

export default function UsagePage() {
  return (
    <main className="shell">
      <section className="page-card usage-hero">
        <div>
          <p className="eyebrow">How to Use</p>
          <h1 className="page-title">使い方</h1>
          <p className="page-description">
            PNG の読み込みから見え方の調整、書き出しまでの基本手順をまとめています。
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/" className="primary-link">
            シミュレーターへ戻る
          </Link>
          <NoticeModal triggerLabel="注意事項を見る" />
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <p className="section-kicker">Flow</p>
          <h2>シミュレーションの流れ</h2>
        </div>
        <ol className="steps-grid usage-steps">
          {usageSteps.map((step) => (
            <li className="info-card" key={step.label}>
              <p className="card-label">{step.label}</p>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <p className="section-kicker">Before You Start</p>
          <h2>事前に確認すること</h2>
        </div>
        <div className="steps-grid">
          {preparationItems.map((item) => (
            <article className="info-card" key={item.label}>
              <p className="card-label">{item.label}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
