import os, re
results = {}
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith('.tsx'):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8', errors='ignore') as fp:
                for idx, line in enumerate(fp):
                    stripped = line.strip()
                    if stripped.startswith('//') or stripped.startswith('/*') or stripped.startswith('*'):
                        continue
                    if 'language ===' in line or 'language !==' in line or 't(' in line:
                        continue
                    if re.search(r'[áéíóúÁÉÍÓÚñÑ¿¡]', line):
                        results.setdefault(path, []).append((idx + 1, stripped))

for p in sorted(results.keys()):
    print(f'{p}: {len(results[p])} occurrences')
