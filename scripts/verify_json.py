import json
d = json.load(open('byline-code.json','r',encoding='utf-8'))
files = d['files']
total_chars = sum(len(v) for v in files.values())
samples = ['cli.py', 'packages/agents/nodes/strategist.py', 'apps/api/main.py']
print("Total files:", len(files))
print("Total code chars:", total_chars)
for s in samples:
    val = files.get(s, '')
    print(f"\n{s}: {len(val)} chars")
    print("  start:", repr(val[:80]))
    print("  end:", repr(val[-60:]))
