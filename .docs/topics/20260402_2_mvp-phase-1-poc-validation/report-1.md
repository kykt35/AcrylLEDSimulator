# Phase 1 Report

- Report Type: milestone-phase-breakdown
- Phase: Phase 1
- Topic: MVP PoC validation
- Milestone: M2 PoC完了
- Source Documents: `specs/product/milestones.md`, `specs/product/prd.md`
- Created: 2026-04-02

## Summary

Phase 1 は、MVP の中核価値である「それっぽく見える 3D シミュレーション」が成立するかを確認する技術検証フェーズである。PoC を通じて、表現品質と実装コストの上限を把握し、Phase 2 で現実的な設計に落とし込める状態を作る。

## Objective

- Next.js と R3F を前提とした基本表示を成立させる
- 透過 PNG を 3D 表示へ載せる方法を固める
- アクリル感と LED 発光感の最低限の表現を確認する
- 画像保存やカメラ操作を含め、MVP 実現性を判断する

## Execution Scope

- Next.js + R3F の初期構築
- Canvas の描画確認
- 透過 PNG の読み込みと反映
- アクリル板風の簡易表現
- LED 発光と bloom 相当の見え方検証
- カメラ操作確認
- 画像書き出し方式の検証
- 技術課題の記録と、継続実装の Go / No-Go 判断

## Deliverables

- PoC 版プロトタイプ
- 技術課題一覧
- 実装方針の確定

## Completion Criteria

- LED 色変更と基本的な発光表現が視覚的に確認できる
- カメラ操作や描画性能がデスクトップ利用で許容範囲にある
- 画像書き出しの実現方法が見えている
- 実装を進めるうえでの主要制約と妥協点が整理されている

## Risks And Controls

- 見た目調整に工数がかかりすぎる
- 対応: PoC では高精度再現を狙わず、十分それっぽいラインで停止基準を置く
- ブラウザ性能差が大きい
- 対応: デスクトップ優先、対応ブラウザ限定で性能確認する
- 保存処理が不安定
- 対応: 画像出力の方式を早期に固定し、代替案も併記する

## Handoff To Next Phase

- Phase 2 では PoC で成立した表現だけを前提に画面仕様とコンポーネント設計へ落とす
- 性能面で重い案や品質差の大きい案は、設計時点で対象外またはオプション扱いにする
- M2 の完了条件は「完璧さ」ではなく「MVP を成立させる現実的な実装案が見えたか」で判定する
