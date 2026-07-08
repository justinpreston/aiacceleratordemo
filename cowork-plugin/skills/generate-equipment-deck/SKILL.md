---
name: generate-equipment-deck
description: |
  Generates PowerPoint decks and status reports about Contoso Electronics
  factory equipment using live data from the Work Order & Warranty System.
  Use when the user asks to "create a PowerPoint about our equipment",
  "generate an equipment status deck", "build a warranty summary presentation",
  "make slides on equipment maintenance", "create a work order report deck",
  or "summarize equipment warranty and work orders in a presentation".
license: MIT
metadata:
  author: Contoso Electronics
  version: "1.0"
---

# Generate Equipment Deck

## What This Skill Does

Creates a polished PowerPoint deck (or written report) summarizing the Contoso
Electronics equipment fleet using **live data** from the Work Order & Warranty
System connector. It covers inventory, warranty status, and open work orders,
and highlights equipment that needs attention.

## Data Source

Use the **Contoso Work Order & Warranty System** connector tools to gather data.
Do not invent equipment, asset IDs, warranty dates, or work orders — always call
the tools and use the returned values.

Available connector tools:

- **`get_summary`** — aggregate stats + per-asset warranty breakdown + open work orders. Call this first; it provides most of what the deck needs.
- **`list_equipment`** — full equipment list with details and warranty status.
- **`check_warranty`** — warranty status for a single asset ID (e.g., `CE-OSC-1200`).
- **`list_work_orders`** — work orders, optionally filtered by `assetId` or `status`.
- **`get_equipment`** — full details for a single asset.

## Workflow

1. **Gather data.** Call `get_summary` first. If the user asks about a specific
   asset, category, or work order state, also call `list_equipment`,
   `list_work_orders`, or `check_warranty` as needed.
2. **Confirm scope (only if ambiguous).** If the user did not specify, default to
   a full-fleet deck covering all equipment. Otherwise honor their filter
   (a category, a single asset, or only expired-warranty items).
3. **Analyze.** Identify: total equipment, count under warranty vs. expired,
   assets expiring within 90 days, and open/critical work orders.
4. **Build the deck** following the slide structure below. Use the Contoso
   accent color (dark blue, `#004B8D`) for titles and table headers.
5. **Summarize** the key takeaways and offer to adjust scope or styling.

## Deck Structure (default)

Produce a PowerPoint with these slides:

1. **Title** — "Contoso Electronics — Equipment Status" with the current date.
2. **Executive Summary** — total equipment, % under warranty, # expired,
   # open work orders, # critical/high-priority work orders.
3. **Equipment Inventory** — table of all equipment: Asset ID, Name, Category,
   Location.
4. **Warranty Status** — table (or chart) of Asset ID, Warranty Expiry, Status
   (Active/Expired), Days Remaining. Highlight **Expired** in red and
   **expiring within 90 days** in amber.
5. **Attention Needed** — bulleted list of assets that are out of warranty or
   expiring soon, plus any assets with open critical/high work orders.
6. **Open Work Orders** — table of ID, Equipment, Title, Priority, Status,
   Requested By.
7. **Recommendations** — 3–5 concise, data-driven next steps (e.g., renew
   warranty on expired assets, prioritize critical work orders).

If the user asks for a report instead of slides, produce the same sections as a
structured document.

## Output Format

For the warranty and work order tables, use this column layout:

| Asset ID | Equipment | Category | Warranty Expiry | Status | Days Remaining |
|----------|-----------|----------|-----------------|--------|----------------|

| Work Order | Equipment | Title | Priority | Status | Requested By |
|------------|-----------|-------|----------|--------|--------------|

## Additional Resources

- **`references/deck-outline.md`** — detailed slide-by-slide content guidance and styling notes.
