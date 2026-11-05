from pathlib import Path

from rag import add_document_chunks

path = Path("C:\\Users\\shiva\\Downloads\\project_knowledge_base.md")
text = path.read_text(encoding="utf-8")

chunk_size = 1000
overlap = 150
chunks = [
    text[start : start + chunk_size].strip()
    for start in range(0, len(text), chunk_size - overlap)
]
chunks = [chunk for chunk in chunks if chunk]

count = add_document_chunks(chunks, source=path.name)
print(f"Added {count} chunks from {path.name}")