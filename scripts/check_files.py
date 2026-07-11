import json

d = json.load(open('byline-code.json','r',encoding='utf-8'))
files = d['files']

checks = [
    'byline/src/app/components/dispatch/Hero.tsx',
    'byline/src/app/components/dispatch/DashboardSection.tsx',
    'byline/src/app/components/dispatch/dashboard/DashboardLayout.tsx',
    'byline/src/app/components/dispatch/dashboard/DeskTab.tsx',
    'byline/src/app/components/dispatch/dashboard/OverviewTab.tsx',
    'byline/src/app/components/dispatch/Navbar.tsx',
    'byline/src/app/components/dispatch/Footer.tsx',
    'byline/src/app/components/dispatch/VoiceProfileSection.tsx',
    'byline/src/app/components/dispatch/Logo.tsx',
    'byline/src/app/components/dispatch/Stamp.tsx',
    'byline/src/app/App.tsx',
    'index.html',
    'landing-v3.html',
    'cli.py',
    'apps/api/main.py',
    'packages/agents/graph.py',
    'packages/agents/state.py',
    'infra/postgres/init.sql',
    'infra/docker-compose.yml',
]

print("FILE STATUS CHECK (all must be present with full code):")
print("=" * 60)
all_good = True
for key in checks:
    val = files.get(key)
    if val is None:
        # try different paths
        for k in files:
            if key.split('/')[-1] in k:
                val = files[k]
                key = k
                break
    if val is None:
        print(f"  MISSING: {key}")
        all_good = False
    else:
        print(f"  OK ({len(val):,} chars): {key}")

print(f"\nAll files complete: {all_good}")
print(f"Total files in JSON: {len(files)}")
print(f"Total chars: {sum(len(v) for v in files.values()):,}")
