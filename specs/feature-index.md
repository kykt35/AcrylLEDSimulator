# 機能一覧インデックス

この文書は、仕様確認の入口です。機能の一覧と詳細仕様へのリンクだけを置き、具体的な振る舞い、例外、関連実装、関連テストは詳細仕様ファイルに記載します。

## 機能一覧

| カテゴリ | 機能 | 詳細仕様 |
|---|---|---|
| シミュレーター | 3Dプレビュー表示 | [features/simulator.md](features/simulator.md) |
| シミュレーター | アクリル板とLED台座の表示 | [features/simulator.md](features/simulator.md), [features/display-controls.md](features/display-controls.md) |
| 画像入力 | PNGアップロード/ドラッグ&ドロップ | [features/image-input.md](features/image-input.md) |
| 画像入力 | 画像配置調整 | [features/image-input.md](features/image-input.md) |
| 彫刻 | 彫刻用グレースケール生成 | [features/engraving-map.md](features/engraving-map.md) |
| 彫刻 | 彫刻プレビュー切替/彫刻画像ダウンロード | [features/engraving-map.md](features/engraving-map.md), [features/export-save.md](features/export-save.md) |
| 発光設定 | LED色、明るさ、高さ減衰 | [features/lighting-controls.md](features/lighting-controls.md) |
| 表示設定 | 背景、カメラ、ビューリセット | [features/display-controls.md](features/display-controls.md) |
| 書き出し/保存 | PNG/JPG書き出し | [features/export-save.md](features/export-save.md) |
| 書き出し/保存 | クロップ範囲指定 | [features/export-save.md](features/export-save.md) |
| 書き出し/保存 | セッション保存/復元 | [features/export-save.md](features/export-save.md) |
| API | PNGアップロード検証API | [architecture/api.md](architecture/api.md), [features/image-input.md](features/image-input.md) |
| 仕様運用 | 実装変更時の仕様更新ルール | [operations/spec-maintenance.md](operations/spec-maintenance.md), [../.agents/implementation-change-rules.md](../.agents/implementation-change-rules.md) |

## 次の詳細化候補

| 候補 | 元になる詳細仕様 |
|---|---|
| `export-crop.md` | [features/export-save.md](features/export-save.md) |
| `camera-controls.md` | [features/display-controls.md](features/display-controls.md) |
| `acrylic-size-presets.md` | [features/display-controls.md](features/display-controls.md) |
| `session-restore.md` | [features/export-save.md](features/export-save.md) |
