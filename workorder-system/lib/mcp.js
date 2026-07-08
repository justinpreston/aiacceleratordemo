'use strict';

/**
 * Model Context Protocol (MCP) server for the Contoso Work Order & Warranty
 * System. Exposed at POST /mcp using the Streamable HTTP transport in stateless
 * mode (JSON-RPC 2.0). This is the connector consumed by the Copilot Cowork
 * plugin so Cowork can gather equipment, warranty, and work order data when
 * generating artifacts such as PowerPoint decks.
 */

const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StreamableHTTPServerTransport } = require('@modelcontextprotocol/sdk/server/streamableHttp.js');
const { z } = require('zod');
const store = require('./store');

function asText(obj) {
  return { content: [{ type: 'text', text: JSON.stringify(obj, null, 2) }] };
}

function buildServer() {
  const server = new McpServer({
    name: 'contoso-workorder-system',
    version: '1.0.0',
  });

  server.registerTool(
    'list_equipment',
    {
      title: 'List equipment',
      description:
        'Returns all Contoso Electronics equipment with details and computed warranty status.',
      inputSchema: {},
    },
    async () => asText(store.listEquipment())
  );

  server.registerTool(
    'get_equipment',
    {
      title: 'Get equipment',
      description:
        'Returns details and warranty status for a single asset by its asset ID (e.g., CE-OSC-1200).',
      inputSchema: {
        assetId: z.string().describe('Equipment asset ID, e.g., CE-OSC-1200'),
      },
    },
    async ({ assetId }) => {
      const item = store.getEquipment(assetId);
      return item ? asText(item) : asText({ error: `Equipment '${assetId}' not found.` });
    }
  );

  server.registerTool(
    'check_warranty',
    {
      title: 'Check warranty',
      description:
        'Checks warranty status (Active or Expired, plus days remaining) for an asset by its asset ID.',
      inputSchema: {
        assetId: z.string().describe('Equipment asset ID, e.g., CE-LAS-3300'),
      },
    },
    async ({ assetId }) => {
      const warranty = store.getWarranty(assetId);
      return warranty ? asText(warranty) : asText({ error: `Equipment '${assetId}' not found.` });
    }
  );

  server.registerTool(
    'list_work_orders',
    {
      title: 'List work orders',
      description:
        'Lists work orders, optionally filtered by assetId or status (Open, In Progress, On Hold, Completed, Cancelled).',
      inputSchema: {
        assetId: z.string().optional().describe('Filter by asset ID'),
        status: z.string().optional().describe('Filter by work order status'),
      },
    },
    async ({ assetId, status }) => asText(store.listWorkOrders({ assetId, status }))
  );

  server.registerTool(
    'get_summary',
    {
      title: 'Get fleet summary',
      description:
        'Returns aggregate statistics plus a per-asset warranty breakdown across all equipment. Ideal source data for building a status deck or report.',
      inputSchema: {},
    },
    async () => {
      const stats = store.stats();
      const equipment = store.listEquipment().map((e) => ({
        assetId: e.assetId,
        name: e.name,
        category: e.category,
        location: e.location,
        warrantyExpiry: e.warrantyExpiry,
        warrantyStatus: e.warranty.status,
        daysRemaining: e.warranty.daysRemaining,
      }));
      const openWorkOrders = store.listWorkOrders({}).filter(
        (w) => !['Completed', 'Cancelled'].includes(w.status)
      );
      return asText({ stats, equipment, openWorkOrders });
    }
  );

  return server;
}

/**
 * Express handler for POST /mcp. Creates a fresh server + transport per request
 * (stateless mode) so no session state is retained between calls.
 */
async function handleMcpRequest(req, res) {
  const server = buildServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on('close', () => {
    transport.close();
    server.close();
  });
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    console.error('MCP request error:', err);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal server error' },
        id: null,
      });
    }
  }
}

module.exports = { handleMcpRequest };
