#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')
[ -z "$COMMAND" ] && exit 0

DANGEROUS=("rm -rf /" "rm -rf ~" "rm -rf \." "DROP TABLE" "DROP DATABASE" "TRUNCATE TABLE" "git push --force main" "git push --force master" "git push -f main" "git push -f master" "> /dev/sda" "mkfs" "dd if=" ":(){:|:&};:")
for p in "${DANGEROUS[@]}"; do
  if echo "$COMMAND" | grep -qi "$p"; then
    echo "BLOCKED: $COMMAND matches: $p" >&2
    exit 2
  fi
done

PROTECTED=("prisma/migrations" ".env" ".claude/settings.json")
for d in "${PROTECTED[@]}"; do
  if echo "$COMMAND" | grep -q "rm.*$d\|mv.*$d"; then
    echo "BLOCKED: protected path: $d" >&2
    exit 2
  fi
done
exit 0
