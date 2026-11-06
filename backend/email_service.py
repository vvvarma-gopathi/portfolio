import logging

import httpx
import resend
from config import get_settings
from resend.exceptions import ResendError

logger = logging.getLogger(__name__)
RECIPIENT_EMAIL = "vishnuvardhangopathi5@gmail.com"


class EmailConfigurationError(RuntimeError):
    """Raised when Resend credentials or sender configuration are invalid."""


class EmailDeliveryError(RuntimeError):
    """Raised when Resend cannot accept a connection notification."""


class EmailRateLimitError(EmailDeliveryError):
    """Raised when Resend rate-limits a connection notification."""


class EmailTimeoutError(EmailDeliveryError):
    """Raised when a Resend request times out."""


async def send_connection_email(
    name: str,
    email: str,
    reason: str | None,
) -> str:
    settings = get_settings()
    if not settings.resend_api_key or not settings.sender_email:
        raise EmailConfigurationError(
            "Connection email is not configured. Set RESEND_API_KEY and SENDER_EMAIL."
        )

    resend.api_key = settings.resend_api_key
    params: resend.Emails.SendParams = {
        "from": settings.sender_email,
        "to": [RECIPIENT_EMAIL],
        "reply_to": email,
        "subject": f"Portfolio connection request from {name}",
        "text": "\n".join(
            [
                "A visitor submitted a connection request through the portfolio assistant.",
                "",
                f"Name: {name}",
                f"Email: {email}",
                f"Reason: {reason or 'Not provided'}",
            ]
        ),
    }

    try:
        response = await resend.Emails.send_async(params)
    except httpx.TimeoutException as exc:
        logger.error("Resend email request timed out")
        raise EmailTimeoutError from exc
    except httpx.RequestError as exc:
        logger.error("Resend email request failed (%s)", type(exc).__name__)
        raise EmailDeliveryError from exc
    except ResendError as exc:
        code = str(exc.code)
        logger.error(
            "Resend rejected connection email (code=%s, type=%s)",
            code,
            exc.error_type,
        )
        if code == "429":
            raise EmailRateLimitError from exc
        if code in {"400", "401", "403", "422"}:
            raise EmailConfigurationError from exc
        raise EmailDeliveryError from exc

    return response["id"]
