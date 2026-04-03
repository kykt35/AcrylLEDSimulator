import Link from "next/link";
import React from "react";

export default function ResultPage() {
  return (
    <main className="shell">
      <section className="page-card">
        <p className="eyebrow">Result</p>
        <h1 className="page-title">保存結果</h1>
        <p className="page-description">
          Phase 3 で保存完了後のプレビューと再編集導線をここへ集約します。
        </p>
        <div className="hero-actions">
          <Link href="/simulator" className="primary-link">
            シミュレーターへ戻る
          </Link>
          <Link href="/" className="secondary-link">
            トップへ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
