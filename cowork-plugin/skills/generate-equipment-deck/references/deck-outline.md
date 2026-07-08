# Deck Outline & Styling Reference

Detailed guidance for the `generate-equipment-deck` skill. Load this when you
need slide-by-slide content or styling specifics.

## Styling

- **Primary color:** `#004B8D` (Contoso blue) for slide titles and table headers.
- **Status colors:** Expired = red (`#B42318`); Expiring ≤ 90 days = amber (`#B45309`); Active = green (`#128A54`).
- Keep slides uncluttered: one idea per slide, concise bullet points, readable tables.
- Prefer charts for the warranty breakdown when a bar or donut chart communicates faster than a table.

## Slide-by-slide content

### 1. Title
- Title: "Contoso Electronics — Equipment Status".
- Subtitle: "Work Order & Warranty Summary — <current date>".

### 2. Executive Summary
Pull from `get_summary` → `stats`:
- Total equipment (`totalEquipment`)
- Under warranty (`underWarranty`) and % of total
- Warranty expired (`warrantyExpired`)
- Open work orders (`openWorkOrders`) and total work orders (`totalWorkOrders`)
- Call out the number of critical/high-priority open work orders.

### 3. Equipment Inventory
- One row per asset: Asset ID, Name, Category, Location.
- If more than ~12 assets, split across two slides or group by category.

### 4. Warranty Status
- Columns: Asset ID, Warranty Expiry, Status, Days Remaining.
- Sort so Expired and soon-to-expire assets appear first.
- Optionally add a donut chart: Active vs. Expiring soon vs. Expired.

### 5. Attention Needed
- Bulleted list of assets that are Expired or Expiring ≤ 90 days.
- Include assets with open Critical or High priority work orders.
- Note the recommended action per item (e.g., "Renew warranty", "Expedite repair").

### 6. Open Work Orders
- Columns: Work Order ID, Equipment, Title, Priority, Status, Requested By.
- Sort by priority (Critical → High → Medium → Low), then by creation date.

### 7. Recommendations
- 3–5 concise, data-driven actions, for example:
  - Renew or replace warranties for the N expired assets.
  - Prioritize the N critical/high work orders.
  - Schedule preventive maintenance for assets nearing warranty expiry.

## Data mapping quick reference

| Deck element | Tool | Fields |
|--------------|------|--------|
| Executive summary counts | `get_summary` | `stats.*` |
| Inventory table | `list_equipment` or `get_summary` | `assetId`, `name`, `category`, `location` |
| Warranty table | `get_summary` | `warrantyExpiry`, `warrantyStatus`, `daysRemaining` |
| Work orders table | `list_work_orders` or `get_summary` | `id`, `equipmentName`, `title`, `priority`, `status`, `requestedBy` |
| Single-asset detail | `get_equipment` / `check_warranty` | full record / warranty object |
