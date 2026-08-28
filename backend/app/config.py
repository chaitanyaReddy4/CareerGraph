import os

from dotenv import load_dotenv

load_dotenv()


COGNODB_URI = os.getenv("COGNODB_URI")
COGNODB_USERNAME = os.getenv("COGNODB_USERNAME", "cognodb")
COGNODB_PASSWORD = os.getenv("COGNODB_PASSWORD")


if not COGNODB_URI:
    raise RuntimeError("COGNODB_URI is not configured")

if not COGNODB_PASSWORD:
    raise RuntimeError("COGNODB_PASSWORD is not configured")