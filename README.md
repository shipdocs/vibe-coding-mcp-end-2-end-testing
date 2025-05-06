# MCP End-to-End Testing for Roo-Code Integration

This repository contains tools for automated web testing with Model Context Protocol (MCP) integration, designed to work seamlessly with VSCode AI extensions like Roo-Code.

## Projects

### MCP Playwright Test ([@shipdocs/mcp-playwright-test](https://www.npmjs.com/package/@shipdocs/mcp-playwright-test))

A comprehensive end-to-end testing tool that implements the Model Context Protocol (MCP) for integration with AI assistants like Roo-Code and Augment.

**Key Features:**
- Full MCP server implementation with resource and command endpoints
- Playwright-powered browser automation for Chrome, Firefox, and WebKit
- Automated login, navigation, and web exploration
- Error detection and logging for AI-assisted debugging
- Screenshot capture and accessibility analysis
- Easy integration with Roo-Code via MCP

**[View MCP Playwright Test Documentation](./mcp-playwright-test/README.md)**

## Getting Started

The easiest way to get started is to install the published npm package:

```bash
# Install globally
npm install -g @shipdocs/mcp-playwright-test

# Create a configuration file
mcp-playwright-test init

# Start the MCP server
mcp-playwright-test start
```

Alternatively, clone this repository:

```bash
# Clone repository and navigate to the MCP Playwright Test directory
git clone https://github.com/shipdocs/vibe-coding-mcp-end-2-end-testing.git
cd vibe-coding-mcp-end-2-end-testing/mcp-playwright-test

# Install dependencies
npm install

# Run the program
node index.js
```

On first run, you'll be prompted to configure login details for your target website.

## Roo-Code Integration

This repository is designed to work with the Roo-Code VSCode extension through the Model Context Protocol. To configure Roo-Code to use this tool:

1. In VSCode with Roo-Code installed, access the MCP settings
2. Add a new MCP server using either:
   - **STDIO Transport**: Run the tool as a child process
   - **SSE Transport**: Connect to an already running server

For detailed instructions, see:
- [MCP Playwright Test User Guide](./mcp-playwright-test/docs/UserGuide.md#roo-code-integration)
- [Detailed Roo-Code Integration Guide](./mcp-playwright-test/docs/Roo-Code-Integration.md)

## Documentation

- [MCP Playwright Test README](./mcp-playwright-test/README.md)
- [Detailed User Guide](./mcp-playwright-test/docs/UserGuide.md)
- [Roo-Code Integration Guide](./mcp-playwright-test/docs/Roo-Code-Integration.md)

## License

MIT License