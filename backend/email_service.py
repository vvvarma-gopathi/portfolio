import smtplib
from email.message import EmailMessage

from config import get_settings

RECIPIENT_EMAIL = "vishnuvardhangopathi@gmail.com"


class EmailConfigurationError(RuntimeError):
    """Raised when SMTP credentials have not been configured."""


def send_connection_email(name: str, email: str, reason: str | None) -> None:
    settings = get_settings()
    sender_email = settings.smtp_sender_email or settings.smtp_username
    if not settings.smtp_username or not settings.smtp_password or not sender_email:
        raise EmailConfigurationError(
            "Connection email is not configured. Set SMTP_USERNAME and SMTP_PASSWORD."
        )

    message = EmailMessage()
    message["Subject"] = f"Portfolio connection request from {name}"
    message["From"] = sender_email
    message["To"] = RECIPIENT_EMAIL
    message["Reply-To"] = email
    message.set_content(
        "\n".join(
            [
                "A visitor submitted a connection request through the portfolio assistant.",
                "",
                f"Name: {name}",
                f"Email: {email}",
                f"Reason: {reason or 'Not provided'}",
            ]
        )
    )

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=15) as smtp:
        smtp.ehlo()
        smtp.starttls()
        smtp.ehlo()
        smtp.login(settings.smtp_username, settings.smtp_password)
        smtp.send_message(message)
