---
name: figma-sync
description: コードとFigmaの双方向同期。to-figma / from-figma {url} / review の3モード。
---

# Figma Sync: $ARGUMENTS

> Reference: https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/

## Modes
- `/figma-sync to-figma` — コード→Figma (generate_figma_design)
- `/figma-sync from-figma {url}` — Figma→コード (get_design_context → Tailwindクラス変換)
- `/figma-sync review` — 差分確認 (get_screenshot)

コードがマスター。Figmaはビューアー+レビューツール。
Figmaの値を直接ハードコードしない。必ずトークンに変換。
