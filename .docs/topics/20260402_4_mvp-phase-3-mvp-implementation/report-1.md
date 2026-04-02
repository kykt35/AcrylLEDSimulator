# Phase 3 Report

- Report Type: milestone-phase-breakdown
- Phase: Phase 3
- Topic: MVP implementation
- Milestone: M4 MVP実装完了
- Source Documents: `docs/MVP_milestone.md`, `docs/MVP_PRD.md`
- Created: 2026-04-02

## Summary

Phase 3 は、MVP として公開可能な機能一式を作り切る実装フェーズである。実装対象は、画像アップロード、3D プレビュー、LED 色変更、背景切替、カメラ操作、保存を中心に据え、運用に必要な補助 UI まで含めてステージングに載せる。

## Objective

- ユーザーが完成イメージを確認できる一連の操作を成立させる
- PRD で定義した Must 機能を実装する
- ステージング環境での通し確認ができる状態にする

## Execution Scope

- 基盤実装
- Next.js プロジェクト構成
- レイアウト
- UI 基盤
- 状態管理
- ルーティング
- シミュレーター実装
- 3D Canvas
- アクリル板表示
- 台座表示
- LED 色変更
- 明るさ変更
- 背景切替
- カメラ制御
- 画像処理
- PNG アップロード
- 透過画像反映
- 画像差し替え
- エラー処理
- 保存
- 現在表示の画像書き出し
- 設定値保持
- 補助 UI
- 操作パネル
- リセット
- ローディング表示
- エラーメッセージ

## Deliverables

- MVP 実装版
- ステージング環境

## Completion Criteria

- 画像アップロードから保存まで主要フローが通る
- LED 色、背景、カメラ操作が UI から制御できる
- 致命的な表示崩れや操作不能が解消されている
- ステージングで関係者レビュー可能な状態になっている

## Risks And Controls

- 実装途中で対象外機能が混入する
- 対応: Must を優先し、Could は実装完了判定に入れない
- 3D 表現の微調整が長引く
- 対応: Phase 1 の PoC で確認済みの表現を基準にし、過剰調整を避ける
- UI と保存処理の結合が強くなる
- 対応: シミュレーション状態と出力処理を疎結合に保つ

## Handoff To Next Phase

- Phase 4 へは、主要フローが動くビルド、既知不具合一覧、受入観点メモを引き継ぐ
- QA では見た目品質と操作導線の確認を優先し、機能追加は止める
- M4 の時点で未完の改善要望はリリース条件から外し、バックログへ送る
