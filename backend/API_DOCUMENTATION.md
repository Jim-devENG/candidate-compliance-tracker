# API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
Currently, authentication is optional. In production, use Laravel Sanctum tokens.

## Endpoints

### Health Check

**GET** `/api/health`

Check API health status.

**Response:**
```json
{
  "status": "ok"
}
```

---

### List Credentials

**GET** `/api/credentials`

Get all credentials with optional filtering.

**Query Parameters:**
- `name` (string, optional) - Filter by candidate name (partial match)
- `type` (string, optional) - Filter by credential type (partial match)

**Example:**
```
GET /api/credentials?name=John&type=License
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "user": {
        "id": 1,
        "name": "Recruiter User",
        "email": "recruiter@example.com"
      },
      "candidate_name": "John Doe",
      "position": "Software Engineer",
      "credential_type": "Professional License",
      "issue_date": "2024-01-15",
      "expiry_date": "2025-01-15",
      "email": "john@example.com",
      "status": "active",
      "status_color": "green",
      "created_at": "2024-11-07T22:00:00.000000Z",
      "updated_at": "2024-11-07T22:00:00.000000Z"
    }
  ],
  "count": 1
}
```

**Status Values:**
- `active` - Expiry > 30 days (green)
- `expiring_soon` - Expiry ≤ 30 days (yellow)
- `expired` - Expiry ≤ today (red)
- `pending` - No expiry date (gray)

---

### Get Single Credential

**GET** `/api/credentials/{id}`

Get a single credential by ID.

**Response:**
```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "user": {
      "id": 1,
      "name": "Recruiter User",
      "email": "recruiter@example.com"
    },
    "candidate_name": "John Doe",
    "position": "Software Engineer",
    "credential_type": "Professional License",
    "issue_date": "2024-01-15",
    "expiry_date": "2025-01-15",
    "email": "john@example.com",
    "status": "active",
    "status_color": "green",
    "created_at": "2024-11-07T22:00:00.000000Z",
    "updated_at": "2024-11-07T22:00:00.000000Z"
  }
}
```

---

### Create Credential

**POST** `/api/credentials`

Create a new credential.

**Request Body:**
```json
{
  "candidate_name": "Jane Doe",
  "position": "Nurse",
  "credential_type": "Professional License",
  "issue_date": "2024-01-01",
  "expiry_date": "2025-01-01",
  "email": "jane@example.com"
}
```

**Validation Rules:**
- `candidate_name` - required, string, max 255
- `position` - required, string, max 255
- `credential_type` - required, string, max 255
- `issue_date` - required, date
- `expiry_date` - required, date, must be after issue_date
- `email` - required, email, max 255

**Response:**
```json
{
  "data": {
    "id": 2,
    "user_id": 1,
    "candidate_name": "Jane Doe",
    "position": "Nurse",
    "credential_type": "Professional License",
    "issue_date": "2024-01-01",
    "expiry_date": "2025-01-01",
    "email": "jane@example.com",
    "status": "active",
    "status_color": "green",
    "created_at": "2024-11-07T22:00:00.000000Z",
    "updated_at": "2024-11-07T22:00:00.000000Z"
  },
  "message": "Credential created successfully"
}
```

**Status Code:** 201 Created

---

### Update Credential

**PUT** `/api/credentials/{id}`

Update an existing credential. All fields are optional.

**Request Body:**
```json
{
  "candidate_name": "Jane Doe Updated",
  "expiry_date": "2026-01-01"
}
```

**Validation Rules:**
- All fields same as create, but all optional
- `expiry_date` must be after `issue_date` if both are provided

**Response:**
```json
{
  "data": {
    "id": 2,
    "user_id": 1,
    "candidate_name": "Jane Doe Updated",
    "position": "Nurse",
    "credential_type": "Professional License",
    "issue_date": "2024-01-01",
    "expiry_date": "2026-01-01",
    "email": "jane@example.com",
    "status": "active",
    "status_color": "green",
    "created_at": "2024-11-07T22:00:00.000000Z",
    "updated_at": "2024-11-07T22:30:00.000000Z"
  },
  "message": "Credential updated successfully"
}
```

---

### Delete Credential

**DELETE** `/api/credentials/{id}`

Delete a credential.

**Response:**
```json
{
  "message": "Credential deleted successfully"
}
```

**Status Code:** 200 OK

---

## Error Responses

### Validation Error (422)

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "candidate_name": [
      "The candidate name field is required."
    ],
    "expiry_date": [
      "The expiry date must be a date after issue date."
    ]
  }
}
```

### Not Found (404)

```json
{
  "message": "No query results for model [App\\Models\\Credential] 999"
}
```

### Server Error (500)

```json
{
  "message": "Server Error"
}
```

---

## Status Calculation Logic

Status is automatically calculated based on expiry date:

- **Active** (green): Expiry date > 30 days from today
- **Expiring Soon** (yellow): Expiry date ≤ 30 days from today
- **Expired** (red): Expiry date ≤ today
- **Pending** (gray): No expiry date set

The status is recalculated on every API request, so it's always up-to-date.

---

## Example cURL Requests

### List Credentials
```bash
curl -X GET "http://localhost:8000/api/credentials" \
  -H "Accept: application/json"
```

### Create Credential
```bash
curl -X POST "http://localhost:8000/api/credentials" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "candidate_name": "John Doe",
    "position": "Software Engineer",
    "credential_type": "Professional License",
    "issue_date": "2024-01-01",
    "expiry_date": "2025-01-01",
    "email": "john@example.com"
  }'
```

### Update Credential
```bash
curl -X PUT "http://localhost:8000/api/credentials/1" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "expiry_date": "2026-01-01"
  }'
```

### Delete Credential
```bash
curl -X DELETE "http://localhost:8000/api/credentials/1" \
  -H "Accept: application/json"
```

