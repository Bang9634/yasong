#!/usr/bin/env python3
"""Find missing local imports, including unused ones Vite can tree-shake away."""
from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parent.parent / 'frontend/src'
missing = []
pattern = re.compile(r'''(?:from\s+|import\s*\(?\s*)["']([^"']+)["']''')
for source in root.rglob('*'):
    if source.suffix not in {'.ts', '.tsx'}:
        continue
    for match in pattern.finditer(source.read_text()):
        name = match.group(1).split('?', 1)[0]
        if name.startswith('@/'):
            target = root / name[2:]
        elif name.startswith('.'):
            target = source.parent / name
        else:
            continue
        candidates = [target, target / 'index.ts', target / 'index.tsx']
        candidates.extend(Path(str(target) + suffix) for suffix in ['.ts', '.tsx', '.js', '.jsx', '.json', '.css'])
        if not any(candidate.is_file() for candidate in candidates):
            missing.append(f'{source.relative_to(root)}: {name}')
if missing:
    raise SystemExit('Missing frontend modules:\n' + '\n'.join(missing))
print('Verified frontend local imports')
