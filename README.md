# grab-tools-api

Run `wrangler types` to generate `worker-configuration.d.ts` for types completion.

# API

| Endpoint                                                | Description                          | Auth          |
| ------------------------------------------------------- | ------------------------------------ | ------------- |
| [`/get_access_token`](#post-get_access_token)           | Login with Meta for an access token  | Service token |
| [`/get_verification_code`](#post-get_verification_code) | Generate OTP verification code       | Access token  |
| [`/verify_account`](#post-verify_account)               | Verify and link GRAB account         | Access token  |
| `/sentry_proxy`                                         | Proxies Sentry events (Undocumented) | N/A           |

## POST `/get_access_token`

### Request

| Perameter       | Type     | Description        |
| --------------- | -------- | ------------------ |
| `service_token` | `String` | Meta service token |

### Response

| Perameter      | Type             | Description         |
| -------------- | ---------------- | ------------------- |
| `user_name`    | `String`         | Username            |
| `grab_id`      | `String \| null` | Linked GRAB user ID |
| `is_admin`     | `Boolean`        | Admin permissions   |
| `access_token` | `String`         | New access token    |

## POST `/get_verification_code`

### Request

| Perameter      | Type     | Description  |
| -------------- | -------- | ------------ |
| `access_token` | `String` | Access token |

### Response

| Perameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `code`    | `String` | OTP verification code |

## POST `/verify_account`

### Request

| Perameter      | Type     | Description       |
| -------------- | -------- | ----------------- |
| `access_token` | `String` | Access token      |
| `token`        | `String` | GRAB access token |
| `level_id`     | `String` | GRAB level ID     |

> Either `token` or `level_id` are required, not both.

### Response

| Perameter | Type     | Description         |
| --------- | -------- | ------------------- |
| `grab_id` | `String` | Linked GRAB user ID |
