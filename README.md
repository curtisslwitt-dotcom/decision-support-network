# Decision Support Network

**Find the right tool for the decision.**

🌐 **Live:** [decisionsupportnetwork.com](https://decisionsupportnetwork.com)

The Decision Support Network (DSN) is a WebMCP-enabled discovery and routing hub for 12 specialized AI decision-support tools. It demonstrates a **two-hop agent workflow**: an AI agent discovers the right decision-support capability via DSN's WebMCP tools, then routes into a second, specialized Decision Support App (DSA) to execute the actual analysis.

## Architecture: One Engine, Four Doors

Every tool in the network is accessible through four independent interfaces, all powered by a single canonical routing engine:

| Interface | Description |
|---|---|
| **Human UI** | Browse, search, and explore tools at [decisionsupportnetwork.com](https://decisionsupportnetwork.com) |
| **Browser WebMCP** | `document.modelContext.registerTool()` — AI agents in WebMCP-enabled browsers can discover and invoke tools directly |
| **REST API** | Versioned JSON endpoints with full OpenAPI 3.1 spec |
| **Remote MCP** | JSON-RPC 2.0 endpoint for any MCP-compatible AI agent or host |

## WebMCP Tools

DSN exposes three Browser WebMCP tools:

- **`find_decision_tools`** — Natural-language intent matching to find the right decision tool
- **`search_tools`** — Keyword search across all registered tools
- **`list_categories`** — Browse tools by category

## The 12 Decision Support Apps

| # | Domain | Tool | Category |
|---|---|---|---|
| 1 | [grantreadinesschecklist.com](https://grantreadinesschecklist.com) | Grant Readiness Assessment | Nonprofit |
| 2 | [soschecklist.net](https://soschecklist.net) | Student Safety Checklist | Education |
| 3 | [homemoneyfinder.com](https://homemoneyfinder.com) | Homebuyer Program Matcher | Housing |
| 4 | [anchoredhopeindex.com](https://anchoredhopeindex.com) | Wellbeing/Resilience Index | Wellness |
| 5 | [canairecommendmybusiness.com](https://canairecommendmybusiness.com) | AI Recommendation Readiness | Business |
| 6 | [assessmyhair.com](https://assessmyhair.com) | Hair Care Needs Assessment | Beauty |
| 7 | [okcsciaticacheck.com](https://okcsciaticacheck.com) | Sciatica Information Check | Health |
| 8 | [okcluxuryhomeplanner.com](https://okcluxuryhomeplanner.com) | Luxury Home Readiness Planner | Real Estate |
| 9 | [okchvaccalculator.com](https://okchvaccalculator.com) | HVAC Repair-or-Replace Analysis | Home Services |
| 10 | [solarquoteanalyzer.com](https://solarquoteanalyzer.com) | Solar Quote Analyzer | Energy |
| 11 | [caslipandfall.com](https://caslipandfall.com) | Slip & Fall Evidence Checker | Legal |
| 12 | [caldogbiteevidence.com](https://caldogbiteevidence.com) | Dog Bite Evidence Checker | Legal |

Each DSA is itself a full WebMCP site with its own Browser WebMCP tools, REST API, Remote MCP endpoint, and human UI.

## API & Discovery Endpoints

| Endpoint | URL |
|---|---|
| OpenAPI 3.1 Spec | [/openapi.json](https://decisionsupportnetwork.com/openapi.json) |
| Capability Manifest | [/capability-manifest.json](https://decisionsupportnetwork.com/capability-manifest.json) |
| MCP Discovery | [/.well-known/mcp.json](https://decisionsupportnetwork.com/.well-known/mcp.json) |
| Remote MCP (JSON-RPC) | `POST https://decisionsupportnetwork.com/api/mcp` |
| REST: Find Tool | `POST /api/v1/find-tool` |
| REST: Search | `GET /api/v1/search?q=...` |
| REST: List Tools | `GET /api/v1/tools` |
| REST: Categories | `GET /api/v1/categories` |

## Two-Hop Agent Workflow

```
Agent → DSN (discover) → "You need the Solar Quote Analyzer"
     → solarquoteanalyzer.com (execute) → structured analysis result
```

This is the core value proposition: agents don't need to know about all 12 specialized tools. They ask DSN, DSN routes them to the right one, and the agent calls the specialized tool directly.

## Tech Stack

- Next.js with TypeScript
- Prisma ORM with PostgreSQL
- NextAuth v5 (admin authentication)
- LLM-backed intent matching with keyword fallback
- Tailwind CSS with a premium dark infrastructure aesthetic

## Powered by CCA

Built and maintained by [CCA](https://decisionsupportnetwork.com/about).

## License

All rights reserved. © 2026 CCA.
