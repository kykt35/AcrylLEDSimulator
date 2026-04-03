"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  clearEditorSnapshot,
  clearLatestResult,
  readLatestResult,
  type SavedSimulationResult
} from "@/lib/save/session";

export function ResultScreen() {
  const router = useRouter();
  const [result, setResult] = useState<SavedSimulationResult | null>(null);

  useEffect(() => {
    setResult(readLatestResult());
  }, []);

  if (!result) {
    return (
      <main className="shell">
        <section className="page-card">
          <p className="eyebrow">Result</p>
          <h1 className="page-title">保存結果が見つかりません</h1>
          <p className="page-description">
            先にシミュレーター画面から画像を保存してください。保存後の結果はこの画面に表示されます。
          </p>
          <div className="hero-actions">
            <Link href="/simulator" className="primary-link">
              シミュレーターへ移動
            </Link>
            <Link href="/" className="secondary-link">
              トップへ戻る
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="shell">
      <section className="result-layout">
        <div className="result-preview">
          <img className="result-image" src={result.resultImageUrl} alt="保存したシミュレーション結果" />
        </div>

        <div className="result-sidebar">
          <div className="page-card">
            <p className="eyebrow">Result</p>
            <h1 className="page-title">保存が完了しました</h1>
            <p className="page-description">
              {new Date(result.savedAt).toLocaleString("ja-JP")} に保存しました。出力画像を確認し、そのままダウンロードできます。
            </p>
          </div>

          <div className="panel-section">
            <p className="panel-label">保存内容</p>
            <p className="status-primary">{result.sourceImage.fileName}</p>
            <p className="status-secondary">LED: {result.simulation.ledColorId}</p>
            <p className="status-secondary">明るさ: {result.simulation.brightness.toFixed(1)}</p>
            <p className="status-secondary">背景: {result.simulation.backgroundId}</p>
            <p className="status-secondary">カメラ: {result.simulation.cameraPresetId}</p>
          </div>

          <div className="panel-section">
            <div className="control-group">
              <button
                type="button"
                className="primary-button"
                onClick={() => router.push("/simulator?resume=1")}
              >
                再編集する
              </button>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  clearEditorSnapshot();
                  clearLatestResult();
                  router.push("/simulator?reset=1");
                }}
              >
                新規作成する
              </button>
              <a className="secondary-button download-link" href={result.resultImageUrl} download="acryl-led-simulation.png">
                ダウンロード
              </a>
              <Link className="ghost-link" href="/">
                トップへ戻る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
