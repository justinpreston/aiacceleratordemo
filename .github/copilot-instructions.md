# Copilot instructions — AI Solution Accelerator demo

This repo powers a live demo (see `docs/demo_guide.md`). The on-stage moment is a
presenter asking GitHub Copilot, **in plain English**, to connect our Work Order API
to the Copilot Studio agent. Your job is to make that reliable and boring to run.

## The Work Order & Warranty System API

- Deployed at: `https://app-contosowo-yzfxfgch3lcyu.azurewebsites.net` (base path `/api`).
- Source of truth: `workorder-system/server.js` (routes) and `workorder-system/lib/store.js` (data shapes). Read them; do not invent fields.

Two operations the agent calls as tools:

| operationId | Route | Notes |
|-------------|-------|-------|
| `checkWarranty` | `GET /api/checkWarranty?assetId=CE-OSC-1200` | 400 if `assetId` missing, 404 if unknown. Returns a `WarrantyStatus`. |
| `createWorkOrder` | `POST /api/createWorkOrder` | Body `{ assetId, title, priority?, description?, requestedBy? }`. 201 on success; 400 if `assetId`/`title` missing, asset unknown, or invalid priority. Returns a `WorkOrder`. |

`priority` is one of `Low`, `Medium`, `High`, `Critical` (defaults to `Medium`). The API needs **no authentication** for the demo.

## When asked to "connect the API to the agent" / "generate the OpenAPI"

Produce `workorder-system/openapi.json` as an **OpenAPI 2.0 (Swagger)** custom-connector
file that imports cleanly into Power Apps / Copilot Studio. Requirements:

- `host: app-contosowo-yzfxfgch3lcyu.azurewebsites.net`, `basePath: /api`, `schemes: [https]`.
- Exactly two operations with `operationId` **`checkWarranty`** and **`createWorkOrder`**, each with a clear `summary` and `description` (the agent's orchestrator uses these to decide when to call them).
- Security: **No authentication** (do not add API-key or OAuth security).
- Strict typing so Power Apps imports without type-mismatch errors:
  - every integer → `"format": "int32"` (e.g. `daysRemaining`)
  - ISO timestamps → `"format": "date-time"` (`checkedAt`, `createdAt`, `updatedAt`)
  - date-only strings → `"format": "date"` (`installDate`, `warrantyExpiry`)
  - nullable fields → `"x-nullable": true` (e.g. `assignedTo`)
- Include example responses for both operations.

**A verified copy already exists at `workorder-system/openapi.reference.json`.** Match its
structure. If you are unsure about anything, copy that file to `workorder-system/openapi.json`
verbatim rather than guessing.

## House rules

- Keep routes thin and consistent with `server.js`; reuse helpers in `lib/store.js`.
- Do **not** add authentication, new npm dependencies, or a separate Azure Function App — these operations are plain routes on the existing App Service.
- Real deployed host is `app-contosowo-yzfxfgch3lcyu.azurewebsites.net`. Never use placeholder hosts from older docs.
