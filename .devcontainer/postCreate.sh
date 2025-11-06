#!/usr/bin/env bash

set -euo pipefail
npm i -g pnpm@9

[ -d app ] && (cd app && pnpm install)
[ -d legacy ] && (cd legacy && pnpm install || npm install)

cat > .env.local <<'EOF'
VITE_SOLR_URL=http://solr:8983/solr/splainer
VITE_ES_URL=http://elastic:9200
EOF
