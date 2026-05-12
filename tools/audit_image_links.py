#!/usr/bin/env python3
"""Audit image links in the Orchidarc static site.

Run from the repository root:
    python tools/audit_image_links.py

The script scans HTML, CSS and JS files for local image references and reports
paths that do not exist in the repository. It is case-sensitive by default,
because GitHub Pages runs on a case-sensitive filesystem.
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif", ".ico"}
SCAN_EXTENSIONS = {".html", ".htm", ".css", ".js"}
SKIP_DIRS = {".git", "node_modules", ".venv", "venv", "__pycache__"}

PATTERNS = [
    re.compile(r"(?:src|href|poster|content)\s*=\s*['\"]([^'\"]+)['\"]", re.IGNORECASE),
    re.compile(r"url\(\s*['\"]?([^'\")]+)['\"]?\s*\)", re.IGNORECASE),
    re.compile(r"['\"]((?:/?images/|\.\.?/images/)[^'\"]+?)['\"]", re.IGNORECASE),
]


def is_probable_image_ref(value: str) -> bool:
    value = value.strip()
    if not value or value.startswith(("http://", "https://", "data:", "mailto:", "tel:", "#")):
        return False
    parsed = urlparse(value)
    path = unquote(parsed.path)
    ext = Path(path).suffix.lower()
    return ext in IMAGE_EXTENSIONS or "/images/" in path or path.startswith("images/")


def normalise_ref(ref: str, source_file: Path, root: Path) -> Path:
    parsed = urlparse(ref.strip())
    raw_path = unquote(parsed.path)

    # Absolute site path: /images/foo.jpg -> <root>/images/foo.jpg
    if raw_path.startswith("/"):
        return (root / raw_path.lstrip("/")).resolve()

    # Root-relative path without leading slash: images/foo.jpg
    if raw_path.startswith("images/"):
        return (root / raw_path).resolve()

    # Relative path from current file
    return (source_file.parent / raw_path).resolve()


def collect_existing(root: Path) -> tuple[set[Path], dict[str, list[Path]]]:
    existing: set[Path] = set()
    lower_index: dict[str, list[Path]] = {}
    for path in root.rglob("*"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.is_file():
            resolved = path.resolve()
            existing.add(resolved)
            lower_index.setdefault(str(resolved).lower(), []).append(resolved)
    return existing, lower_index


def iter_source_files(root: Path):
    for path in root.rglob("*"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.is_file() and path.suffix.lower() in SCAN_EXTENSIONS:
            yield path


def find_refs(text: str) -> set[str]:
    refs: set[str] = set()
    for pattern in PATTERNS:
        for match in pattern.finditer(text):
            value = match.group(1).strip()
            if is_probable_image_ref(value):
                refs.add(value)
    return refs


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit local image references in the static site.")
    parser.add_argument("root", nargs="?", default=".", help="Repository root. Defaults to current directory.")
    parser.add_argument("--show-ok", action="store_true", help="Also print valid image links.")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    if not root.exists():
        print(f"ERROR: root does not exist: {root}", file=sys.stderr)
        return 2

    existing, lower_index = collect_existing(root)
    missing: list[tuple[Path, str, Path, list[Path]]] = []
    ok_count = 0
    ref_count = 0

    for source in iter_source_files(root):
        try:
            text = source.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            text = source.read_text(encoding="utf-8", errors="ignore")

        for ref in sorted(find_refs(text)):
            ref_count += 1
            target = normalise_ref(ref, source, root)
            if target in existing:
                ok_count += 1
                if args.show_ok:
                    print(f"OK      {source.relative_to(root)} -> {ref}")
            else:
                suggestions = lower_index.get(str(target).lower(), [])
                missing.append((source, ref, target, suggestions))

    print("\nImage link audit")
    print("================")
    print(f"Repository: {root}")
    print(f"References checked: {ref_count}")
    print(f"Valid references:    {ok_count}")
    print(f"Missing references:  {len(missing)}")

    if missing:
        print("\nMissing image references")
        print("------------------------")
        for source, ref, target, suggestions in missing:
            print(f"\n{source.relative_to(root)}")
            print(f"  referenced: {ref}")
            try:
                print(f"  expected:   {target.relative_to(root)}")
            except ValueError:
                print(f"  expected:   {target}")
            if suggestions:
                print("  case-sensitive match candidate(s):")
                for suggestion in suggestions[:5]:
                    try:
                        print(f"    - {suggestion.relative_to(root)}")
                    except ValueError:
                        print(f"    - {suggestion}")
        return 1

    print("\nNo missing local image references found.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
