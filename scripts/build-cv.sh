#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
cv_build_dir=$(mktemp -d)
trap 'rm -rf "$cv_build_dir"' EXIT
# Add Unicode µ support via a wrapper, without editing the public CV source.
printf '%s\n' '\RequirePackage[utf8]{inputenc}\DeclareUnicodeCharacter{00B5}{\ensuremath{\mu}}\input{docs/cv-public.tex}' > "$cv_build_dir/cv.tex"
pdflatex -interaction=nonstopmode -halt-on-error -output-directory="$cv_build_dir" "$cv_build_dir/cv.tex"
pdflatex -interaction=nonstopmode -halt-on-error -output-directory="$cv_build_dir" "$cv_build_dir/cv.tex"
mkdir -p public/cv
cp "$cv_build_dir/cv.pdf" public/cv/michael-saxer-cv.pdf
