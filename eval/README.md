# Copilot Studio Evaluation Set

This folder contains a test set for evaluating the **Contoso Maintenance Assistant** agent in Microsoft Copilot Studio.

## File

| File | Description |
|------|-------------|
| `contoso-maintenance-agent-eval.csv` | 30 test cases covering all agent capabilities. |

## Test case coverage

| Category | Count | Description |
|----------|-------|-------------|
| SharePoint knowledge (Word docs) | 10 | Equipment specs, troubleshooting, error codes |
| Azure AI Search knowledge (PDFs) | 10 | Specs, safety, troubleshooting for PDF-indexed equipment |
| Cross-source reasoning | 4 | Questions requiring answers from both knowledge sources |
| Action — warranty check | 2 | `checkWarranty` function invocation (active + expired) |
| Action — work order creation | 2 | `createWorkOrder` function invocation |
| Action — end-to-end (knowledge + action) | 2 | Knowledge retrieval combined with tool use |

## How to import

1. Open your **Contoso Maintenance Assistant** agent in [Copilot Studio](https://copilotstudio.microsoft.com).
2. Go to the **Evaluation** tab.
3. Select **New evaluation** → **Single response**.
4. Drag and drop `contoso-maintenance-agent-eval.csv` into the import area (or click **Browse**).
5. Add test methods (recommended: **General quality**, **Compare meaning**, **Tool use** for action questions).
6. Select **Evaluate** to run.

## Recommended test methods

| Method | Use for | Notes |
|--------|---------|-------|
| **General quality** | All 30 test cases | Scores response quality out of 100% |
| **Compare meaning** | Knowledge questions (rows 1–24) | Set pass score ≥ 70% |
| **Tool use** | Action questions (rows 25–30) | Verify `checkWarranty` / `createWorkOrder` are invoked |
| **Keyword match** | All | Add asset IDs (e.g., `CE-OSC-1200`) as expected keywords |

## Notes

- Expected responses are **reference answers**, not exact matches. Use *Compare meaning* or *General quality* rather than *Exact match*.
- Action test cases (rows 25–30) require the Azure Functions to be deployed and connected as tools before running.
- Some warranties are intentionally expired relative to the demo date (CE-LAS-3300, CE-WAV-2600, CE-SOL-0450).
