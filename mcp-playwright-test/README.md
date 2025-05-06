# MCP Playwright Test with Roo-Code Integration

This project is a Node.js program designed to automatically set up an MCP server and run Playwright-based browser automation tests on a target website. It supports dynamic websites including React apps, performs error detection, usability checks, and logs detailed notes for further analysis and repair using LLMs. The program integrates with VSCode AI extensions like Roo-Code via the Model Context Protocol (MCP).

## Features

- **Full MCP Server Implementation**: Exposes resources and accepts commands via MCP protocol
- **Playwright Automation**: Modern browser automation with Chrome, Firefox, and WebKit support
- **Comprehensive Testing**: Login verification, navigation, accessibility analysis
- **Error Detection**: Console error capture, screenshot on failures, detailed logs
- **Bidirectional Communication**: Seamless integration with Roo-Code for AI-guided testing
- **Easy Configuration**: Configure via `config.json` or interactive prompt on first run
- **Structured Output**: Resources formatted for LLM consumption and AI extension integration

## Installation

### Option 1: NPM Installation (Recommended)

Install the tool globally to use it from anywhere:

```bash
# Install globally
npm install -g @shipdocs/mcp-playwright-test

# Create a configuration file
mcp-playwright-test init

# Start the MCP server
mcp-playwright-test start
```

Or install locally in your project:

```bash
# Install in your project
npm install --save-dev @shipdocs/mcp-playwright-test

# Use with npx
npx mcp-playwright-test init
npx mcp-playwright-test start
```

### Option 2: Install as Standalone Tool

Install the tool in a dedicated directory, separate from your main project:

```bash
# Create a dedicated directory for testing tools
mkdir -p ~/tools
cd ~/tools

# Clone the repository
git clone https://github.com/shipdocs/vibe-coding-mcp-end-2-end-testing.git
cd vibe-coding-mcp-end-2-end-testing/mcp-playwright-test

# Install dependencies
npm install
```

### Option 3: Copy Files Without Git (No Nesting Issues)

If you want to integrate this into your existing project without git nesting issues:

```bash
# Download without git history
npx degit shipdocs/vibe-coding-mcp-end-2-end-testing/mcp-playwright-test ./testing/mcp-playwright

# Install dependencies
cd ./testing/mcp-playwright
npm install
```

### Option 4: Direct Install (Not Recommended for Existing Git Projects)

Only use this if you don't have an existing git repository or understand the implications of nested git repositories:

```bash
git clone https://github.com/shipdocs/vibe-coding-mcp-end-2-end-testing.git
cd vibe-coding-mcp-end-2-end-testing/mcp-playwright-test
npm install
```

## Setup

After installation:

1. **Configure the tool**:
   - Create a configuration file: `mcp-playwright-test init` (NPM install)
   - Or edit `config.json` directly
   - Or run the tool for the first time to be prompted for configuration

2. **Run the program**:

```bash
# If installed via NPM
mcp-playwright-test start

# OR if installed from repository
node index.js
```

- On first run, if `config.json` is not found, the program will prompt you to enter the login URL, credentials, selectors, target URL, and MCP server port.
- The configuration will be saved to `config.json` for future runs.

## CLI Commands

When installed via NPM, the tool provides the following commands:

```bash
# Show help
mcp-playwright-test --help

# Initialize a new configuration file
mcp-playwright-test init [--output config.json]

# Start the MCP server and wait for commands
mcp-playwright-test start [--config config.json] [--port 8080]

# Run a test immediately
mcp-playwright-test run [--config config.json] [--headless] [--video]
```

## Configuration File

The `config.json` file contains all settings needed for testing:

```json
{
  "loginUrl": "https://example.com/login",
  "credentials": {
    "username": "your-username",
    "password": "your-password"
  },
  "loginSelector": {
    "username": "#username",
    "password": "#password",
    "submit": "button[type='submit']"
  },
  "successSelector": ".dashboard-header",
  "targetUrl": "https://example.com/dashboard",
  "mcpServerConfig": {
    "port": 8080
  }
}
```

- `loginUrl`: The URL of the login page
- `credentials`: Username and password
- `loginSelector`: CSS selectors for login form elements
- `successSelector`: Optional CSS selector present after successful login
- `targetUrl`: Optional URL to navigate to after login
- `mcpServerConfig`: MCP server configuration (port, etc.)

## Usage

### Standalone Usage

The program starts an MCP server that listens for commands and can be used independently:

```bash
# Start the server
mcp-playwright-test start

# In another terminal, trigger tests with curl
curl -X POST http://localhost:8080/commands/startTest -H "Content-Type: application/json" -d '{}'

# Get a list of available resources
curl http://localhost:8080/resources

# Retrieve a specific resource
curl http://localhost:8080/resources/test-result
```

### Roo-Code Integration

This tool is designed to work seamlessly with Roo-Code through the Model Context Protocol (MCP). For detailed integration instructions, see our [Roo-Code Integration Guide](./docs/Roo-Code-Integration.md).

Quick setup:

1. **Configure in Roo-Code**:
   - Open Roo-Code settings and add an MCP server
   - Use `stdio` transport with command: `mcp-playwright-test start`

2. **Run tests from Roo-Code**:

   ```javascript
   // Start a test
   const result = await roocode.mcp.tool("MCP Playwright Test", {
     command: "startTest",
     args: { headless: true }
   });
   
   // Get test results
   const testResult = await roocode.mcp.resource("MCP Playwright Test", "resources/test-result");
   ```

## MCP Resources

The following resources are available via the MCP server:

| Resource ID | Description |
|-------------|-------------|
| `server-status` | Current status of the MCP server |
| `login-process` | Information about the login attempt |
| `login-screenshot` | Screenshot of the login page |
| `login-status` | Result of the login attempt |
| `after-login-screenshot` | Screenshot after login |
| `target-screenshot` | Screenshot of the target page |
| `accessibility-data` | Accessibility audit results |
| `performance-metrics` | Browser performance metrics |
| `test-result` | Overall test results |
| `test-completed` | Test completion status |

## MCP Commands

The following commands can be sent to the MCP server:

| Command | Description |
|---------|-------------|
| `startTest` | Start a new test run |
| `getStatus` | Get the current status of the MCP server |

## Troubleshooting

- **Connection Issues**: Ensure the MCP server port (default 8080) is available
- **Selector Problems**: Verify selectors in config.json match your target website
- **Authentication Failures**: Check credentials and whether login form structure has changed
- **Timeout Errors**: Increase timeouts for slow websites or increase `waitUntil` periods

## Documentation

- [Main README](./README.md) - Overview and basic usage
- [Roo-Code Integration Guide](./docs/Roo-Code-Integration.md) - Detailed instructions for Roo-Code users
- [User Guide](./docs/UserGuide.md) - Comprehensive user documentation

## Development

### Project Structure

```
mcp-playwright-test/
├── index.js               # Main entry point
├── package.json           # Project dependencies
├── config.json            # Configuration file
├── bin/
│   └── cli.js             # Command-line interface
├── src/
│   ├── mcp/
│   │   └── server.js      # MCP server implementation
│   ├── test/
│   │   └── login.js       # Login functionality
│   └── utils/
│       └── browser.js     # Browser management
└── reports/               # Test reports and artifacts
    ├── screenshots/       # Test screenshots
    ├── videos/            # Test videos
    └── logs/              # Test logs
```

## License

MIT License