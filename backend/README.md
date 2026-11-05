# Portfolio Assistant API

## Configuration

Copy `.env.example` to the repository root `.env` and set `GEMINI_API_KEY`.
The backend also accepts the existing `GeminiApiKey` environment variable.
Never commit an API key.

## Connection request email

Configure SMTP in the repository root `.env` to enable the assistant's
connection-request form. For Gmail, use a Google App Password (not your account
password) for `SMTP_PASSWORD`. Connection requests are sent only after the
visitor submits the form and consents. The recipient is fixed to
`vishnuvardhangopathi@gmail.com`; the visitor's email is set as Reply-To.

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-sender@gmail.com
SMTP_PASSWORD=your-google-app-password
SMTP_SENDER_EMAIL=your-sender@gmail.com
```

## Run

From the `backend` directory, install the project dependencies and run:

```powershell
uv sync
uv run uvicorn main:app --reload
```

Send a question to `POST /assistant`:

```json
{"message": "What projects has Varma built?"}
```

The response contains an `answer` and the retrieved document `sources`.

## Add knowledge to ChromaDB

Call `add_document_chunks` from `rag.py` with pre-split text chunks and a
descriptive source name. It embeds the chunks with Gemini and stores them in
the persistent ChromaDB collection:

```python
from rag import add_document_chunks

add_document_chunks(
    ["Varma built an AI research platform using Python and FastAPI."],
    source="projects",
)
```