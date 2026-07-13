---
mode: agent
description: Connect the Work Order API to the Copilot Studio agent (generate the OpenAPI connector)
---

Connect our Work Order API to the Copilot Studio agent so it can **check warranty** and
**create work orders**.

Look at the `checkWarranty` and `createWorkOrder` routes in `workorder-system/server.js`
and the data shapes returned by `getWarranty` and `createWorkOrder` in
`workorder-system/lib/store.js`. Then generate `workorder-system/openapi.json` — an
**OpenAPI 2.0 (Swagger)** file describing those two operations that imports cleanly as a
Power Apps custom connector for Copilot Studio.

Follow the OpenAPI conventions in `.github/copilot-instructions.md`:

- host `app-contosowo-yzfxfgch3lcyu.azurewebsites.net`, basePath `/api`, https
- operationIds `checkWarranty` and `createWorkOrder`, each with a clear summary/description
- **no authentication**
- strict typing: `int32` for integers, `date-time` / `date` formats, `x-nullable` for nullable fields
- include example responses for both operations

A verified reference is at `workorder-system/openapi.reference.json` — match it, and copy it
verbatim to `workorder-system/openapi.json` if you're unsure.

When you're done, briefly confirm the two operations, their inputs, and their outputs so I
can show the audience.
