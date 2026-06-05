# Phase 0 Report

- Report Type: milestone-phase-breakdown
- Phase: Phase 0
- Topic: MVP planning and requirements
- Milestone: M1 要件確定
- Source Documents: `specs/product/milestones.md`, `specs/product/prd.md`
- Created: 2026-04-02

## Summary

Phase 0 は、MVP を短期間で公開するために対象範囲と成功条件を固定するフェーズである。以降の PoC や実装で判断がぶれないよう、PRD・MVP スコープ・技術方針・画面ラフを揃え、リスクを先に見える化することが主目的になる。

## Objective

- プロダクト目的を「完成イメージ確認に特化した MVP」として明文化する
- 対象ユーザーと主要ユースケースを整理する
- MVP で実装する機能と除外する機能を明確にする
- 技術検証に進めるだけの前提条件を揃える

## Execution Scope

- プロダクト目的と提供価値の確認
- 一般ユーザー、制作担当者、運営者のユースケース整理
- Must / Should / Could / Won't に基づく MVP 範囲の確定
- 画面構成のラフ整理
- 技術スタック候補の確定
- リスクと対応方針の洗い出し
- 初期スケジュールと体制案の確定

## Deliverables

- PRD
- MVP 要件一覧
- 技術選定資料
- 画面ラフ
- 開発計画書

## Completion Criteria

- PRD の目的、対象ユーザー、成功指標がレビュー可能な状態になっている
- MVP 対象機能と対象外機能が区別されている
- Phase 1 で検証すべき技術論点が明確になっている
- M1 の判定材料として、技術選定とスコープ判断が完了している

## Risks And Controls

- スコープ肥大化
- 対応: 注文、決済、管理機能は後続フェーズへ切り分ける
- 成功条件の曖昧さ
- 対応: 「物理的に正しいか」ではなく「意思決定に十分か」で判断する
- 期待値のずれ
- 対応: 実物保証ではなく見え方シミュレーターであることを初期から明示する

## Handoff To Next Phase

- Phase 1 では 3D 表現、発光表現、保存処理の成立性を優先検証する
- PoC の確認観点は、見た目の妥当性、実装難易度、パフォーマンス、画像書き出し可否に絞る
- Phase 0 で確定した MVP 範囲を超える提案はバックログ化し、PoC スコープへ混在させない
