# AGENTS.md

このファイルは、AIエージェントがこのリポジトリで作業する際の入口です。

## 基本ルール

- 既存のNext.js / React / Three.js構成とローカルの命名規則に合わせる。
- UI変更では `components/`、画像/書き出し/保存処理では `lib/` の既存境界を優先する。
- `.env` や秘密情報は編集・コミットしない。
- 実装変更後は影響範囲に応じて `pnpm test` または対象テストを実行する。
- ドキュメントのみの変更では、リンクと参照構造の確認を主な検証にしてよい。

## 仕様ドキュメント

- 仕様の入口は `specs/README.md`。
- 機能一覧は `specs/feature-index.md`。
- 機能の詳細は `specs/features/*.md` に記載する。
- 実装の振る舞いが変わる場合は、`specs/operations/spec-maintenance.md` と `.agents/implementation-change-rules.md` に従って仕様も更新する。
- 仕様更新を行う場合は、必要に応じて `.agents/skills/spec-update/SKILL.md` の手順を使う。

## よく使う確認

```bash
find specs -maxdepth 3 -type f | sort
rg "docs/(MVP_|acceptance|user-flow|screen-spec|component-design|state-design|data-model|api-spec|error-handling)"
pnpm test
```

## エージェント向けルール

- 仕様更新ルール: `.agents/implementation-change-rules.md`
- 仕様更新スキル: `.agents/skills/spec-update/SKILL.md`
- 実装計画とチェックリスト: `.docs/topics/`
