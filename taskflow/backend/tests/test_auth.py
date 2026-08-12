"""Tests for the register and login endpoints."""


def test_register_success(client):
    response = client.post(
        "/register",
        json={"full_name": "Alice Doe", "email": "alice@example.com", "password": "password123"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "alice@example.com"
    assert "hashed_password" not in data


def test_register_duplicate_email(client):
    payload = {"full_name": "Alice Doe", "email": "alice@example.com", "password": "password123"}
    client.post("/register", json=payload)
    response = client.post("/register", json=payload)
    assert response.status_code == 400


def test_login_success(client):
    client.post(
        "/register",
        json={"full_name": "Bob Smith", "email": "bob@example.com", "password": "password123"},
    )
    response = client.post(
        "/login", json={"email": "bob@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert body["user"]["email"] == "bob@example.com"


def test_login_wrong_password(client):
    client.post(
        "/register",
        json={"full_name": "Bob Smith", "email": "bob@example.com", "password": "password123"},
    )
    response = client.post(
        "/login", json={"email": "bob@example.com", "password": "wrongpass"}
    )
    assert response.status_code == 401
