import logging

from email_validator import EmailNotValidError, validate_email
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.genai.errors import APIError
from chromadb.errors import ChromaError
from pydantic import BaseModel, Field, field_validator

from config import get_settings
from email_service import (
    EmailConfigurationError,
    EmailDeliveryError,
    EmailRateLimitError,
    EmailTimeoutError,
    send_connection_email,
)
from rag import AssistantConfigurationError, generate_answer

logger = logging.getLogger(__name__)
app = FastAPI(title="Portfolio Assistant API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://portfolio-ten-kohl-85.vercel.app",
        "https://varmadev.in",
        "https://www.varmadev.in"
    ],
    allow_methods=["POST"],
    allow_headers=["Content-Type"],
)


class AssistantRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)

    @field_validator("message")
    @classmethod
    def strip_message(cls, message: str) -> str:
        message = message.strip()
        if not message:
            raise ValueError("Message must not be blank.")
        return message


class AssistantResponse(BaseModel):
    answer: str
    sources: list[str]


class ConnectionRequest(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: str = Field(min_length=3, max_length=254)
    reason: str | None = Field(default=None, max_length=1000)
    consent: bool

    @field_validator("name")
    @classmethod
    def validate_name(cls, name: str) -> str:
        name = name.strip()
        if not name:
            raise ValueError("Name must not be blank.")
        return name

    @field_validator("email")
    @classmethod
    def validate_email_address(cls, email: str) -> str:
        try:
            return validate_email(email.strip(), check_deliverability=False).normalized
        except EmailNotValidError as exc:
            raise ValueError("Enter a valid email address.") from exc

    @field_validator("reason")
    @classmethod
    def normalize_reason(cls, reason: str | None) -> str | None:
        if reason is None:
            return None
        reason = reason.strip()
        return reason or None

    @field_validator("consent")
    @classmethod
    def require_consent(cls, consent: bool) -> bool:
        if not consent:
            raise ValueError("Consent is required to send this connection request.")
        return consent


class ConnectionResponse(BaseModel):
    message: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/connect", response_model=ConnectionResponse)
async def connect(request: ConnectionRequest) -> ConnectionResponse:
    try:
        await send_connection_email(
            request.name,
            request.email,
            request.reason,
        )
    except EmailConfigurationError as exc:
        logger.error("Connection email configuration is invalid or incomplete")
        raise HTTPException(
            status_code=503,
            detail="Connection requests are temporarily unavailable.",
        ) from exc
    except EmailRateLimitError as exc:
        logger.warning("Resend rate-limited a connection email")
        raise HTTPException(
            status_code=429,
            detail="Connection requests are temporarily unavailable. Please try again later.",
        ) from exc
    except EmailTimeoutError as exc:
        raise HTTPException(
            status_code=504,
            detail="The connection request could not be sent. Please try again later.",
        ) from exc
    except EmailDeliveryError as exc:
        logger.error("Failed to send portfolio connection email")
        raise HTTPException(
            status_code=502,
            detail="The connection request could not be sent. Please try again later.",
        ) from exc

    return ConnectionResponse(message="Your connection request was submitted.")


@app.post("/assistant", response_model=AssistantResponse)
def assistant(request: AssistantRequest) -> AssistantResponse:
    if not get_settings().gemini_api_key:
        raise HTTPException(
            status_code=503,
            detail="The assistant is not configured. Set GEMINI_API_KEY.",
        )

    try:
        answer, sources = generate_answer(request.message)
    except AssistantConfigurationError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except APIError as exc:
        logger.exception("Gemini request failed")
        raise HTTPException(
            status_code=502,
            detail="The Gemini assistant service could not complete the request.",
        ) from exc
    except ChromaError as exc:
        logger.exception("ChromaDB request failed")
        raise HTTPException(
            status_code=503,
            detail="The assistant knowledge base is unavailable.",
        ) from exc

    return AssistantResponse(answer=answer, sources=sources)
