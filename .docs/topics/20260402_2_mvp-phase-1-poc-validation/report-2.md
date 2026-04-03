# Phase 1 PoC Evaluation

- Report Type: implementation-check
- Phase: Phase 1
- Topic: MVP PoC validation
- Related Plan: `plan-1.md`
- Created: 2026-04-03

## Summary

Phase 1 PoC では、Next.js 上で 3D プレビューシェルを立ち上げ、透過 PNG の取り込み、アクリル板風表示、発光プリセット切替、カメラプリセット、Canvas 画像書き出しまでを通しで確認できる状態にした。MVP の成立性確認として必要な論点は一通り触れられる。

## Findings

- Canvas と UI パネルを同一画面で統合する構成は問題なく成立する
- 透過 PNG は data URL として読み込み、PoC 段階ではそのまま 3D マテリアルへ載せられる
- 発光表現は色プリセットと明るさ係数で十分に比較用の差を作れる
- カメラ操作は OrbitControls とプリセット位置の併用で MVP 初期要件を満たせる
- 画像書き出しは canvas の `toDataURL("image/png")` で成立する

## Constraints

- 現状の発光表現は bloom やシェーダー最適化前の簡易版であり、見た目精度は今後の調整余地がある
- 透過 PNG の品質は元画像解像度に依存するため、Phase 2 では推奨サイズとリサイズ方針を明確にする必要がある
- エクスポートはクライアント側 canvas 前提のため、共有用途では別途永続化方式を設計する必要がある

## Go Or No-Go

- 判断: Go
- 理由: MVP に必要なコア体験である「画像を読み込み、光り方と視点を変え、保存可能かを見る」は PoC で成立した
- 次フェーズ条件: Phase 2 では画面仕様、状態管理、受入条件、エラー設計を具体化する
