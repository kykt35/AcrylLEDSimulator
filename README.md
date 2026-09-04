# Acryl LED Simulator

レーザー彫刻アクリル板向けの LED 導光シミュレーションを検証するための Next.js アプリです。

## Requirements

- Node.js 22.13.0 以上
- pnpm 11.5.1

## Scripts

- `pnpm dev`: 開発サーバーを起動
- `pnpm test`: Vitest を実行
- `pnpm typecheck`: TypeScript の型チェックを実行
- `pnpm build`: production build を生成

## Validation

GitHub Actions は pull request と `main` ブランチへの push でテスト、型チェック、production build を実行します。同じ検証をローカルで再現するには、次の順で実行してください。

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm build
```

## Specs

- 仕様入口: [docs/specs/README.md](docs/specs/README.md)
- 機能一覧: [docs/specs/feature-index.md](docs/specs/feature-index.md)
- 仕様更新ルール: [docs/specs/operations/spec-maintenance.md](docs/specs/operations/spec-maintenance.md)

実装の振る舞い、状態、エラー、保存/復元、書き出し結果が変わる場合は、同じ作業単位で該当する仕様も更新してください。

## Phase 1 Scope

- Canvas 表示と基本レイアウト
- 透過 PNG からグレースケールまたは階調の彫刻用画像を生成
- 発光表現とカメラ操作の検証
- 彫刻用 PNG / シミュレーション画像の書き出し確認
