from neo4j import GraphDatabase

from app.config import (
    COGNODB_PASSWORD,
    COGNODB_URI,
    COGNODB_USERNAME,
)


driver = GraphDatabase.driver(
    COGNODB_URI,
    auth=(COGNODB_USERNAME, COGNODB_PASSWORD),
    connection_timeout=5,
)


def verify_connection() -> bool:
    try:
        driver.verify_connectivity()
        return True
    except Exception:
        return False
