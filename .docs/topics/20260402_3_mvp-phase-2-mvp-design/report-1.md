# Phase 2 Report

- Report Type: milestone-phase-breakdown
- Phase: Phase 2
- Topic: MVP design and implementation preparation
- Milestone: M3 MVP設計完了
- Source Documents: `specs/product/milestones.md`, `specs/product/prd.md`
- Created: 2026-04-02

## Summary

Phase 2 は、PoC で確認した成立条件をプロダクト実装へ変換する設計フェーズである。画面仕様、状態管理、API、保存データ、受入条件を先に決め、Phase 3 の実装をタスク単位で迷いなく進められる状態にする。

## Objective

- 主要画面と操作パネルの仕様を確定する
- コンポーネント責務とディレクトリ構成を整理する
- 状態管理方針とデータの流れを明確にする
- 保存処理とエラー処理の扱いを設計する
- 受入基準を定義し、実装と QA の判断軸を揃える

## Execution Scope

- 画面仕様整理
- コンポーネント設計
- 状態管理設計
- API 設計
- 保存データ設計
- エラーパターン整理
- 受入基準定義
- 実装タスク分解

## Deliverables

- 画面仕様
- ディレクトリ構成案
- 状態管理方針
- API 仕様
- 受入条件一覧

## Completion Criteria

- メイン画面と操作パネルの UI 仕様が固まっている
- 画像アップロード、色変更、背景切替、保存のデータフローが説明できる
- 実装カテゴリごとのタスクが着手可能な粒度まで分解されている
- M3 の判定として、実装優先順位と受入条件が明文化されている

## Risks And Controls

- 設計で過剰に将来拡張を織り込み、MVP が重くなる
- 対応: 注文導線や共有 URL などは拡張余地だけ残し、今回の実装対象から外す
- 受入条件が曖昧で QA が属人化する
- 対応: 主要ユースケースごとに観点を先に定義する
- UI と 3D 実装の責務が混ざる
- 対応: 表示、操作、保存、エラー処理を明確に分離する

## Handoff To Next Phase

- Phase 3 は、基盤実装、シミュレーター実装、画像処理、保存、補助 UI の順で進める
- Must 機能を先に通し、Should 機能は公開品質に必要な範囲へ限定する
- 設計上の未確定事項は、実装中に再設計せずチケット化して管理する
