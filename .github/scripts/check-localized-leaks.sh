#!/usr/bin/env bash
# The CV generator flips individual fields between a plain string and a
# {de,en,hu} map. When the layout renders such a field directly, Liquid
# prints the Ruby hash literal straight into the page. That is invisible to
# the build, so fail here instead of shipping it.
# The pattern has to stay agnostic about two things: Ruby 3.4 changed
# Hash#inspect to put spaces around the rocket ({"de" => "…"} vs {"de"=>"…"}),
# and a field passed through `| escape` arrives as {&quot;de&quot; =&gt; …}.
#
# Usage: .github/scripts/check-localized-leaks.sh [site_dir]
set -euo pipefail

SITE_DIR="${1:-_site}"
LEAK_PAT='(&quot;|")[a-z]{2}(&quot;|")[[:space:]]*(=>|=&gt;)'
leaks=$(grep -rIlE "$LEAK_PAT" "$SITE_DIR" --include='*.html' || true)

if [ -n "$leaks" ]; then
  echo "::error::Unresolved localized field rendered as a Ruby hash literal."
  while read -r f; do
    echo "--- $f"
    grep -oE "$LEAK_PAT"'[^}]{0,120}' "$f" | sort -u | head -5
  done <<< "$leaks"
  echo "Fix: render the field as \`x[lang] | default: x.en | default: x\` in _layouts/default.html"
  exit 1
fi
echo "No unresolved localized fields."
