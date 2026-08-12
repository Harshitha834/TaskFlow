"""Tests for the project creation endpoint."""


def test_create_project_requires_auth(client):
    response = client.post("/projects", json={"title": "New Project"})
    assert response.status_code == 401


def test_create_project_success(client, auth_headers):
    response = client.post(
        "/projects",
        json={"title": "Website Redesign", "description": "Revamp the homepage"},
        headers=auth_headers,
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Website Redesign"
    assert data["tasks"] == []


def test_list_projects_scoped_to_user(client, auth_headers):
    client.post("/projects", json={"title": "Project A"}, headers=auth_headers)
    client.post("/projects", json={"title": "Project B"}, headers=auth_headers)
    response = client.get("/projects", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 2
