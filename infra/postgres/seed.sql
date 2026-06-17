INSERT INTO narrative_arcs (name, description, is_active)
SELECT * FROM (
  VALUES
    ('Building Byline in public', 'Feature-by-feature build log for Byline itself.', TRUE),
    ('Job search 2026', 'Narrative arc around shipping, visibility, and job search leverage.', TRUE),
    ('Weekly shipping', 'A running weekly cadence of product work across projects.', TRUE)
) AS seed(name, description, is_active)
WHERE NOT EXISTS (SELECT 1 FROM narrative_arcs);

INSERT INTO projects (name, slug, description, stack, status, repo_url)
SELECT * FROM (
  VALUES
    ('fltrd.tech', 'fltrd-tech', 'AI-powered content filtering with semantic search using pgvector and RAG pipelines', ARRAY['Next.js','FastAPI','pgvector','PostgreSQL','OpenAI'], 'active', 'https://github.com/sahil/fltrd'),
    ('Miryn', 'miryn', 'Miryn — AI project', ARRAY['React','FastAPI'], 'active', NULL),
    ('Stash', 'stash', 'Stash — productivity tool', ARRAY['Next.js','PostgreSQL'], 'active', NULL),
    ('ChaiPaani', 'chaipaani', 'ChaiPaani — community project', ARRAY['React Native','FastAPI'], 'active', NULL),
    ('Byline', 'byline', 'Open-source multi-agent content engine for developer-founders', ARRAY['Next.js','FastAPI','pgvector','LangGraph','Anthropic'], 'active', 'https://github.com/phnxsahil/byline')
) AS seed(name, slug, description, stack, status, repo_url)
WHERE NOT EXISTS (SELECT 1 FROM projects);

