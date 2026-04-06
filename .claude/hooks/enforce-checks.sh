#!/bin/bash
INPUT=$(cat)
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
[ "$STOP_HOOK_ACTIVE" = "true" ] && exit 0
[ ! -f "tsconfig.json" ] && exit 0

TSC_OUTPUT=$(npx tsc --noEmit 2>&1)
if [ $? -ne 0 ]; then
  echo "TypeScript errors found. Fix before completing:" >&2
  echo "$TSC_OUTPUT" >&2
  exit 2
fi

BIOME_OUTPUT=$(npx biome check . 2>&1)
if [ $? -ne 0 ]; then
  echo "Biome errors found. Fix before completing:" >&2
  echo "$BIOME_OUTPUT" >&2
  exit 2
fi
exit 0
