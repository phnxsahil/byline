import sys
import subprocess

try:
    import markdownify
except ImportError:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'markdownify'])
    import markdownify

with open(r'C:\Users\shanu\Downloads\htmlviewer.html.txt', 'r', encoding='utf-8') as f:
    html = f.read()

# Convert to Markdown
md = markdownify.markdownify(html, heading_style='ATX')

# Save to the project directory
with open(r'd:\Projects\dispatch\Mkaan_AI_Report_Full.md', 'w', encoding='utf-8') as f:
    f.write(md)

print("HTML converted to Markdown successfully.")
