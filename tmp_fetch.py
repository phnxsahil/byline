import sys, json, urllib.request
r = urllib.request.urlopen("http://localhost:8000/dispatches/a5ff12f7-0734-49b7-a8da-9782695d2d4d/drafts")
ds = json.load(r)
for d in ds:
    print(f"=== {d['platform'].upper()} ===")
    print(d['content'][:300])
    print(f"score: {d.get('critic_score')}/10")
    print("---")
