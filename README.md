# grab-tools-api

Run `wrangler types` to generate `worker-configuration.d.ts` for types completion.

# API

| Endpoint                                           | Description                          | Auth          |
| -------------------------------------------------- | ------------------------------------ | ------------- |
| [`/get_access_token`](#get_access_token)           | Login with Meta for an access token  | Service token |
| [`/get_verification_code`](#get_verification_code) | Generate OTP verification code       | Access token  |
| [`/verify_account`](#verify_account)               | Verify and link GRAB account         | Access token  |
| [`/add_hardest_level`](#add_hardest_level)         | Add or move a level on the GHL       | Access token  |
| [`/remove_hardest_level`](#remove_hardest_level)   | Remove a level from the GHL          | Access token  |
| [`/get_hardest_levels`](#get_hardest_levels)       | Get the GHL                          | None          |
| `/sentry_proxy`                                    | Proxies Sentry events (Undocumented) | N/A           |

## `/get_access_token`

### Request

| Parameter       | Type     | Description        |
| --------------- | -------- | ------------------ |
| `service_token` | `String` | Meta service token |

### Response

| Parameter      | Type             | Description         |
| -------------- | ---------------- | ------------------- |
| `user_name`    | `String`         | Username            |
| `grab_id`      | `String \| null` | Linked GRAB user ID |
| `is_admin`     | `Boolean`        | Admin permissions   |
| `access_token` | `String`         | New access token    |

## `/get_verification_code`

### Request

| Parameter      | Type     | Description  |
| -------------- | -------- | ------------ |
| `access_token` | `String` | Access token |

### Response

| Parameter | Type     | Description           |
| --------- | -------- | --------------------- |
| `code`    | `String` | OTP verification code |

## `/verify_account`

### Request

| Parameter      | Type     | Description       |
| -------------- | -------- | ----------------- |
| `access_token` | `String` | Access token      |
| `token`        | `String` | GRAB access token |
| `level_id`     | `String` | GRAB level ID     |

> Either `token` or `level_id` are required, not both.

### Response

| Parameter | Type     | Description         |
| --------- | -------- | ------------------- |
| `grab_id` | `String` | Linked GRAB user ID |

## `/add_hardest_level`

### Request

| Parameter      | Type     | Description        |
| -------------- | -------- | ------------------ |
| `access_token` | `String` | Access token       |
| `position`     | `Number` | Position to set to |
| `level_id`     | `String` | GRAB level ID      |

### Response

'Success'

## `/remove_hardest_level`

### Request

| Parameter      | Type     | Description   |
| -------------- | -------- | ------------- |
| `access_token` | `String` | Access token  |
| `level_id`     | `String` | GRAB level ID |

### Response

'Success'

## `/get_hardest_levels`

### Request

N/A

### Response

List of:

| Parameter  | Type     | Description              |
| ---------- | -------- | ------------------------ |
| `position` | `Number` | Position on list         |
| `level_id` | `String` | GRAB level ID            |
| `title`    | `String` | Level title              |
| `creators` | `String` | Comma separated creators |

## `/set_allow_downloads`

### Request

| Parameter      | Type      | Description     |
| -------------- | --------- | --------------- |
| `access_token` | `String`  | Access token    |
| `level_id`     | `String`  | GRAB level ID   |
| `user_id`      | `String`  | GRAB user ID    |
| `allow`        | `Boolean` | Allow downloads |

> Either `level_id` or `userid` are required, not both.

### Response

'Success'

## `/can_download_level`

### Request

| Parameter  | Type     | Description   |
| ---------- | -------- | ------------- |
| `level_id` | `String` | GRAB level ID |

### Response

| Parameter | Type      | Description     |
| --------- | --------- | --------------- |
| `allow`   | `Boolean` | Allow downloads |
