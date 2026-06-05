# Acryl LED Simulator

レーザー彫刻アクリル板向けの LED 導光シミュレーションを検証するための Next.js アプリです。

## Scripts

- `pnpm dev`: 開発サーバーを起動
- `pnpm test`: Vitest を実行

## Specs

- 仕様入口: [specs/README.md](specs/README.md)
- 機能一覧: [specs/feature-index.md](specs/feature-index.md)
- 仕様更新ルール: [specs/operations/spec-maintenance.md](specs/operations/spec-maintenance.md)

実装の振る舞い、状態、エラー、保存/復元、書き出し結果が変わる場合は、同じ作業単位で該当する仕様も更新してください。

## Phase 1 Scope

- Canvas 表示と基本レイアウト
- 透過 PNG から彫刻用グレースケール画像を生成
- 発光表現とカメラ操作の検証
- 彫刻用 PNG / シミュレーション画像の書き出し確認
