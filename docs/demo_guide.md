# Demo Guide (Run of Show)

## AI Solution Accelerator — 10 Minute Demo

This guide is the presenter script for the demo described in [demo_proposal.md](./demo_proposal.md). It assumes the environment is already configured per [setup_guide.md](./setup_guide.md): equipment documents split across **SharePoint** (Word) and **Azure AI Search** (PDF) and connected to a **Copilot Studio** agent, and the **Work Order & Warranty System** ([../workorder-system](../workorder-system)) already deployed to Azure App Service.

---

## Pre-demo checklist

- [ ] Copilot Studio agent (**Contoso Maintenance Assistant**) is published and responding.
- [ ] SharePoint knowledge source returns results (Word documents indexed).
- [ ] Azure AI Search index (`equipment-index`) indexer status is **Success** (PDF documents indexed).
- [ ] **Work Order & Warranty System is deployed** and the dashboard (`webAppUrl`) loads; `GET {apiBaseUrl}/health` returns `ok`.
- [ ] Web search is disabled on the agent so answers come from the documents.
- [ ] VS Code open with the repo and GitHub Copilot enabled (for the "extend with code" step).
- [ ] Azure subscription signed in for deploying the Azure Function.
- [ ] Work order dashboard open in a browser tab to show live updates.
- [ ] **Copilot Cowork plugin (Contoso Equipment Insights) installed and enabled** (for the deck-generation finale). See [setup_guide.md](./setup_guide.md) Part E.
- [ ] Test pane pre-loaded with one warm-up question.

---

## Run of show

### 1. Business challenge (1 min)
Set the scene: a maintenance manager at Contoso Electronics needs an assistant that can both **answer equipment questions** and **take action** (warranty checks, work orders).

### 2. Build the agent — knowledge Q&A (2 min)
- Open the agent in Copilot Studio; show the two connected knowledge sources.
- Ask a question answered by **SharePoint** (Word docs) and one answered by **Azure AI Search** (PDF docs) to prove both are working.

### 3. Extend the agent with code (3 min)
- Switch to VS Code (this repo is open) and open **GitHub Copilot Chat** in **Agent mode**.
- Run the saved prompt **`/connect-workorder-agent`** — or just say, in plain English: *"Connect our Work Order API to the agent so it can check warranty and create work orders."*
- Copilot reads the repo and generates `workorder-system/openapi.json`, the connector the agent needs. All the technical precision lives in `.github/copilot-instructions.md`, so what you say on stage stays simple.
- **Full run-of-show and the one-time setup are in [Extending the agent with GitHub Copilot](#extending-the-agent-with-github-copilot) below.**

### 4. Connect the new capability (2 min)
- The custom connector is **pre-imported** before the demo (a do-once step), so this is just: update it with the file Copilot generated, or show that the two tools (`checkWarranty` and `createWorkOrder`) are already on the agent.
- Show the agent picking them up immediately.

### 5. End-to-end experience (2 min)
- Ask a question that needs **both** knowledge and the new action (e.g., look up an equipment issue and create a work order).
- The agent reasons over the documents, calls the tool (which writes to the deployed system), and returns an actionable answer.
- Switch to the **work order dashboard** to show the new work order appear live.

### 6. (Optional finale) Generate a deck with Copilot Cowork (1 min)
- Switch to **Copilot Cowork** and prompt it to build an equipment status PowerPoint.
- The **Contoso Equipment Insights** plugin pulls live data from the same system and produces a deck — see [Generating a PowerPoint with Copilot Cowork](#generating-a-powerpoint-with-copilot-cowork).

---

## Extending the agent with GitHub Copilot

This is the detailed script for demo steps 3 and 4. Instead of hand-writing and deploying
separate Azure Functions on stage, the presenter asks **GitHub Copilot** — in plain English —
to wire our already-deployed Work Order & Warranty System into the agent. The two capabilities
are plain routes on the existing App Service (no separate Function App, no function keys):

| Operation | Route | Purpose |
|-----------|-------|---------|
| `checkWarranty` | `GET /api/checkWarranty?assetId=...` | Check an asset's warranty status. |
| `createWorkOrder` | `POST /api/createWorkOrder` | Create a work order for an asset. |

Both are already implemented in `workorder-system/server.js`. The only thing generated live is
the **OpenAPI connector** that lets Copilot Studio call them.

### Why this is reliable

The determinism lives in the repo, so the spoken prompt can stay simple:

- **`.github/copilot-instructions.md`** — tells Copilot the exact host, base path, typing rules
  (`int32`, `date-time`, `x-nullable`), no-auth, and operation names. Copilot reads it automatically.
- **`.github/prompts/connect-workorder-agent.prompt.md`** — a saved prompt, so you run one command:
  `/connect-workorder-agent`.
- **`workorder-system/openapi.reference.json`** — a verified, known-good copy of the connector.
  If anything looks off on stage, use this file directly; Copilot is instructed to match it.

### Do once (before the demo)

1. **Confirm the two named routes are live** — they're already deployed (they ship in
   `workorder-system/server.js`). Smoke-test:
   ```bash
   curl "https://app-contosowo-yzfxfgch3lcyu.azurewebsites.net/api/checkWarranty?assetId=CE-OSC-1200"
   ```
   You should get warranty JSON. Only if you instead get `Cannot GET /api/checkWarranty`, redeploy
   from the `workorder-system/` folder — the app runs **Node 22**, so don't downgrade the runtime:
   ```bash
   az webapp up --name app-contosowo-yzfxfgch3lcyu --resource-group AIAcceleratorDemo --runtime "NODE:22-lts"
   ```
2. **Pre-import the custom connector** in Copilot Studio so nothing fragile happens live:
   - In [Copilot Studio](https://copilotstudio.microsoft.com) open the **Contoso Maintenance
     Assistant** agent → **Tools** → **Add a tool** → **New tool** → **Custom connector** (opens
     Power Apps custom connectors).
   - **New custom connector → Import an OpenAPI file** and upload
     `workorder-system/openapi.reference.json`.
   - **Security:** No authentication. **Create connector**, then **Test**.
   - Back on the agent, **Add a tool** and add both `checkWarranty` and `createWorkOrder`. Give
     each a clear description (the orchestrator uses it to decide when to call the tool):
     - `checkWarranty`: "Checks the warranty status of a piece of equipment by its asset ID
       (e.g., CE-OSC-1200). Returns whether it is under warranty and days remaining."
     - `createWorkOrder`: "Creates a maintenance work order for a piece of equipment. Requires the
       asset ID and a short title; accepts priority and description."
   - **Save** and **Publish**.

After this, the tools already work. The live moment is about **showing how Copilot builds the
connector**, with a safe, pre-wired fallback already in place.

### On stage — Step 3: generate the connector with Copilot (natural language)

1. In VS Code, open **GitHub Copilot Chat** and switch to **Agent** mode.
2. Run the saved prompt: type **`/connect-workorder-agent`** and send. (Or just say, in your own
   words: *"Connect our Work Order API to the agent so it can check warranty and create work
   orders."*)
3. Copilot reads `server.js`, `lib/store.js`, and `.github/copilot-instructions.md`, then writes
   **`workorder-system/openapi.json`** and summarizes the two operations.
4. (Optional, high-impact) Ask Copilot to prove it works before touching the cloud:
   > "Run the API locally and test both operations with curl."

   Copilot runs `npm start` in `workorder-system/` and calls
   `curl "http://localhost:3000/api/checkWarranty?assetId=CE-OSC-1200"` plus a `POST` to
   `/api/createWorkOrder`, showing real JSON in the terminal.

> Safety net: if Copilot's file ever looks wrong, say *"Use
> `workorder-system/openapi.reference.json` as the source of truth"* and it will copy the verified spec.

### On stage — Step 4: connect it to the agent

Because the connector is pre-imported, you have two clean options:

- **Fast path (recommended):** switch to Copilot Studio and show the agent already has
  `checkWarranty` and `createWorkOrder` under **Tools** — the file Copilot just generated matches
  what's wired up.
- **Show the update:** in the Power Apps custom connector, **Edit → Swagger editor → Update from
  file** with the freshly generated `workorder-system/openapi.json`, **Update connector**, and
  confirm both operations. Then return to the agent.

Either way, the agent can now take action.

### Verify end to end

In the agent's **Test** pane, run the Section D questions below (e.g., "Is CE-OSC-1200 under
warranty?" and "Create a work order for the laser cutter"). Confirm the agent calls the tools and
that new work orders appear on the **work order dashboard**.

---

## Generating a PowerPoint with Copilot Cowork

This is the optional finale (run-of-show step 6). It shows the **same** Work Order & Warranty System data being turned into a polished artifact by **Copilot Cowork** using the **Contoso Equipment Insights** plugin ([../cowork-plugin](../cowork-plugin)).

**Prerequisite:** the plugin is installed and enabled per [setup_guide.md](./setup_guide.md) Part E, and its connector points at your deployed system's `/mcp` endpoint.

### Steps

1. Open **Copilot Cowork**.
2. Go to **Sources & Skills → Plugins** and confirm **Contoso Equipment Insights** is enabled.
3. Enter one of the prompts below. Cowork triggers the `generate-equipment-deck` skill, calls the connector tools (`get_summary`, `list_equipment`, `list_work_orders`, ...) to pull **live** data, and builds the deck.
4. Show the generated PowerPoint \u2014 point out that the asset IDs, warranty statuses, and work orders match the dashboard and the agent's answers (single source of truth).

### Prompts to use

| Prompt | Result |
|--------|--------|
| "Create a PowerPoint deck summarizing our equipment warranty status and open work orders." | Full-fleet status deck (title, executive summary, inventory, warranty, attention-needed, work orders, recommendations). |
| "Generate an equipment status presentation and highlight anything out of warranty." | Deck emphasizing expired/expiring assets (e.g., CE-LAS-3300, CE-WAV-2600, CE-SOL-0450). |
| "Build a slide deck of all open and critical work orders by equipment." | Work-order-focused deck grouped by priority. |
| "Make a warranty summary deck for our test & measurement equipment." | Category-scoped deck (oscilloscope, function generator, multimeter, power supply). |

### Presenter tips

- Keep the **work order dashboard** visible alongside the generated deck so the audience sees the data match.
- If you created a new work order during step 5, ask Cowork to regenerate the deck to show it now includes that work order \u2014 reinforcing "one system, many surfaces".
- If the deck lacks real data, verify the plugin connector `mcpServerUrl` and that the system's `/mcp` endpoint is reachable.

---

## Sample questions

Ask these in the Test pane or published channel. Each maps to a document so you get grounded, high-quality answers. The **Source** column shows which knowledge source answers it.

### A. Answered by SharePoint (Word documents)

| Question | Expected answer highlights | Source |
|----------|----------------------------|--------|
| What is the temperature range of the soldering station? | 100 °C – 450 °C, ±2 °C stability (CE-SOL-0450) | SharePoint |
| The soldering station shows error E-04. What does it mean? | Heating element open circuit — replace the cartridge | SharePoint |
| How many heating zones does the reflow oven have? | 8 top + 8 bottom zones (CE-RFO-2100) | SharePoint |
| What causes cold solder joints on the reflow oven? | Verify profile peak temperature and time-above-liquidus | SharePoint |
| What temperature and humidity range does the environmental test chamber support? | −70 °C to +180 °C; 10%–98% RH (CE-ETC-3100) | SharePoint |
| How do I fix a humidity error on the environmental chamber? | Refill water reservoir, clean wick, verify sensor | SharePoint |
| What coating types does the conformal coating machine support? | Acrylic, silicone, urethane (CE-CCM-2800) | SharePoint |
| What is the alignment accuracy of the solder paste stencil printer? | ±12.5 µm @ 6σ (CE-SPP-2000) | SharePoint |
| What are the outputs of the programmable DC power supply? | Triple output: 2× 0–30 V/5 A and 1× 0–6 V/3 A (CE-PSU-1400) | SharePoint |
| How do I reduce false calls on the AOI system? | Retune thresholds, clean optics, verify lighting calibration | SharePoint |

### B. Answered by Azure AI Search (PDF documents)

| Question | Expected answer highlights | Source |
|----------|----------------------------|--------|
| What is the bandwidth of the digital oscilloscope? | 1 GHz, 4 channels, 5 GSa/s sample rate (CE-OSC-1200) | Azure AI Search |
| The oscilloscope self-calibration fails. What should I do? | 20-minute warm-up, disconnect all inputs, retry calibration | Azure AI Search |
| What materials must never be cut on the laser cutter? | Never cut PVC or chlorinated plastics; only approved materials | Azure AI Search |
| What is the laser cutter's work area and power? | 1300 × 900 mm, 150 W sealed CO2 (CE-LAS-3300) | Azure AI Search |
| What is the placement accuracy of the pick and place machine? | ±25 µm @ 3σ; up to 45,000 CPH (CE-PNP-2200) | Azure AI Search |
| Why is the wave soldering machine producing excessive dross? | Reduce wave turbulence; verify nitrogen if equipped | Azure AI Search |
| What modulation types does the function generator support? | AM, FM, PM, FSK, PWM, sweep, burst (CE-FGN-1300) | Azure AI Search |
| The bench multimeter shows no current reading. What's wrong? | Check the current-input fuse and that the lead is in the correct jack | Azure AI Search |
| What safety rules apply to the X-ray inspection system? | Ionizing radiation — never bypass interlocks; trained operators only; wear dosimeter | Azure AI Search |
| How do I clear an ESD wrist strap monitor alarm? | Check strap fit and cord; replace worn strap or cord (CE-ESD-0100) | Azure AI Search |

### C. Cross-source / reasoning questions (hit both sources)

| Question | Why it's a good demo question |
|----------|-------------------------------|
| List the safety precautions for all our soldering-related equipment. | Combines soldering station (SharePoint) + wave soldering (Azure AI Search). |
| Which pieces of test & measurement equipment do we have and what are their key specs? | Pulls oscilloscope, function generator, multimeter (Azure AI Search) + power supply (SharePoint). |
| Compare the reflow oven and the wave soldering machine — when do we use each? | Reflow (SharePoint) vs wave (Azure AI Search). |
| What maintenance is due monthly across our SMT line equipment? | Aggregates stencil printer, AOI (SharePoint) + pick-and-place (Azure AI Search). |

### D. Action questions (backed by the deployed Work Order & Warranty System)

Use these after the Azure Function tool is connected. The agent's Function calls the deployed system, so warranty answers and work orders are **real** and visible on the dashboard.

> Given the current date, some assets are intentionally **out of warranty** — great for showing the "expired → create work order" flow: CO2 Laser Cutter (CE-LAS-3300), Wave Soldering Machine (CE-WAV-2600), and Soldering Station (CE-SOL-0450). Assets like the Oscilloscope (CE-OSC-1200) and X-Ray System (CE-XRI-3400) are still **under warranty**.

| Question | Capability demonstrated |
|----------|-------------------------|
| Is the digital oscilloscope (CE-OSC-1200) still under warranty? | Warranty check — returns **Active** with days remaining. |
| Is the CO2 laser cutter (CE-LAS-3300) under warranty? | Warranty check — returns **Expired**. |
| The laser cutter (CE-LAS-3300) needs service — create a work order. | Work order creation; appears on the dashboard. |
| The soldering station keeps throwing error E-04. Look up the fix and open a maintenance work order for it. | End-to-end: knowledge retrieval + work order creation. |
| Check the warranty on the wave soldering machine (CE-WAV-2600) and, if expired, create a work order to renew the service contract. | Reasoning + conditional action against the live system. |
| Show me the open work orders for the laser cutter. | Work order lookup (`GET /workorders?assetId=CE-LAS-3300`). |

---

## Presenter tips

- Start with one **SharePoint** and one **Azure AI Search** question back-to-back to prove both sources work.
- Keep questions specific (include the equipment name or asset ID) for the cleanest, grounded answers.
- If an answer looks generic, confirm web search is disabled and the knowledge sources are healthy.
- Keep the **work order dashboard** visible so the audience sees work orders appear live when the agent creates them.
- Save the **action questions** for the finale so the payoff (knowledge + custom capability) lands last.
