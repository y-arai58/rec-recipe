#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
[ -z "$FILE_PATH" ] && exit 0

case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css)
    npx biome format --write "$FILE_PATH" 2>/dev/null
    npx biome check --fix "$FILE_PATH" 2>/dev/null
    ;;
esac
exit 0
