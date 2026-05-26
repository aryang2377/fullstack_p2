# DecodeLabs – Project 2: Backend API

A RESTful API built with **Node.js + Express** covering all Project 2 requirements:
GET/POST endpoints, input handling, data validation, and correct HTTP status codes.

---

## Setup

```bash
npm install
node server.js
# Server runs on http://localhost:3000
```

---

## Endpoints

### GET `/`
Health check — lists all available routes.

**Response `200`**
```json
{ "status": "ok", "message": "DecodeLabs Project 2 API is running ", "endpoints": { ... } }
```

---

### GET `/users`
Returns all users.

**Response `200`**
```json
{ "success": true, "count": 2, "data": [ { "id": 1, "name": "Alice", ... } ] }
```

---

### GET `/users/:id`
Returns a single user by ID.

**Response `200`** — user found  
**Response `404`** — user not found
```json
{ "success": false, "error": "User with id 99 not found." }
```

---

### POST `/users`
Creates a new user. Validates input before saving.

**Request Body**
```json
{ "name": "Charlie Dev", "email": "charlie@example.com", "role": "moderator" }
```

**Response `201`** — created successfully  
**Response `400`** — validation failed
```json
{ "success": false, "errors": ["'email' must be a valid email address."] }
```

**Validation Rules**
- `name` — required, non-empty string
- `email` — required, valid email format, must be unique
- `role` — optional, must be one of: `admin`, `user`, `moderator`

---

### PUT `/users/:id`
Updates an existing user. Same validation as POST.

**Response `200`** — updated  
**Response `400`** — validation error  
**Response `404`** — not found

---

### DELETE `/users/:id`
Removes a user.

**Response `204`** — deleted (no body)  
**Response `404`** — not found

---

## HTTP Status Codes Used

| Code | Meaning        | When used                        |
|------|----------------|----------------------------------|
| 200  | OK             | Successful GET / PUT             |
| 201  | Created        | Successful POST                  |
| 204  | No Content     | Successful DELETE                |
| 400  | Bad Request    | Validation failed                |
| 404  | Not Found      | Resource doesn't exist           |
| 500  | Internal Error | Unexpected server crash          |

---

## Architecture

```
Request → Express Router → Validation (Gatekeeper) → Business Logic → JSON Response
```

- **Stateless** — no sessions; each request is self-contained
- **RESTful naming** — resources are nouns (`/users`), methods are verbs (GET/POST/PUT/DELETE)
- **Two-layer validation** — syntactic (format check) + semantic (logic check)
- **Consistent JSON** — every response has a `success` boolean and either `data` or `errors`
