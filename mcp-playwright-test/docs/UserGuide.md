# MCP Playwright Test Tool - User Guide

This guide provides detailed instructions for setting up, configuring, and using the MCP Playwright Test Tool, including integration with Roo-Code and other MCP-compatible tools.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [MCP Server](#mcp-server)
- [Roo-Code Integration](#roo-code-integration)
- [Customizing Tests](#customizing-tests)
- [Troubleshooting](#troubleshooting)

## Installation

### Prerequisites

- Node.js 16 or higher
- npm or yarn
- VSCode with Roo-Code extension (for Roo-Code integration)

### Installation Options

#### Option 1: Install as Standalone Tool (Recommended)

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

With this approach, you can use the tool with any project without git conflicts.

#### Option 2: Copy Files Without Git History (No Nesting Issues)

If you want to integrate this into your existing project without git nesting issues:

```bash
# Download without git history using degit
npx degit shipdocs/vibe-coding-mcp-end-2-end-testing/mcp-playwright-test ./testing/mcp-playwright

# Install dependencies
cd ./testing/mcp-playwright
npm install
```

This approach avoids git repository nesting problems by using `degit` to download only the files without git history.

#### Option 3: Direct Installation (Not Recommended for Existing Git Projects)

Only use this if you don't have an existing git repository or understand the implications of nested git repositories:

```bash
git clone https://github.com/shipdocs/vibe-coding-mcp-end-2-end-testing.git
cd vibe-coding-mcp-end-2-end-testing/mcp-playwright-test
npm install
```

> **Warning**: This approach creates a nested git repository if you clone inside an existing git project, which can lead to confusion and git management issues.

### Why Avoid Nested Git Repositories?

When you clone a git repository inside another git repository:

1. Git treats the inner repository as a subdirectory, not as a proper submodule
2. Changes in the inner repository won't be tracked properly by the outer repository
3. Git commands run in the parent directory won't correctly handle the nested repository
4. It creates confusion about which .git directory is being used for operations

Using Option 1 (standalone) or Option 2 (degit) avoids these problems.

## Configuration

### Interactive Configuration

When you run the tool for the first time without a `config.json` file, it will prompt you for:

1. Login URL
2. Username and password
3. CSS selectors for login form elements
4. Success element selector (element present after successful login)
5. Target URL to navigate after login
6. MCP server port

### Manual Configuration

Create or edit `config.json` in the project root:

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

### Configuration Fields

| Field | Description | Type | Required |
|-------|-------------|------|----------|
| `loginUrl` | URL of the login page | string | Yes |
| `credentials.username` | Username for login | string | Yes |
| `credentials.password` | Password for login | string | Yes |
| `loginSelector.username` | CSS selector for username field | string | Yes |
| `loginSelector.password` | CSS selector for password field | string | Yes |
| `loginSelector.submit` | CSS selector for submit button | string | Yes |
| `successSelector` | CSS selector indicating successful login | string | No |
| `targetUrl` | URL to navigate to after login | string | No |
| `mcpServerConfig.port` | Port for the MCP server | number | No (default: 8080) |

## Running Tests

### Start the MCP Server

```bash
node index.js
```

This will:
1. Load or create configuration
2. Start the MCP server
3. Wait for test commands

### Trigger Tests via API

Using curl:

```bash
# Start a test with default settings
curl -X POST http://localhost:8080/commands/startTest -H "Content-Type: application/json" -d '{}'

# Start a test with custom settings
curl -X POST http://localhost:8080/commands/startTest -H "Content-Type: application/json" -d '{"args":{"headless":false,"recordVideo":true}}'
```

### Test Arguments

When triggering tests, you can provide these arguments:

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `headless` | boolean | `true` | Run browser in headless mode |
| `recordVideo` | boolean | `true` | Record video of the test |

## MCP Server

### Server Architecture

The MCP server exposes two main endpoints:

1. `/resources` - Access test results and artifacts
2. `/commands` - Trigger actions and tests

### Resource Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/resources` | GET | List all available resources |
| `/resources/:id` | GET | Get a specific resource by ID |

### Command Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/commands/startTest` | POST | Start a new test |
| `/commands/getStatus` | POST | Get server status |

### Available Resources

After running tests, these resources become available:

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

## Roo-Code Integration

### Setting Up MCP in Roo-Code

1. Open VSCode with Roo-Code extension installed
2. Access Roo-Code MCP settings (through command palette or settings)
3. Add a new MCP server with one of these methods:

#### Method 1: STDIO Transport (Recommended)

This launches the MCP server as a child process:

- **Transport Type**: `stdio`
- **Command**: Path to `index.js`
  ```
  node /path/to/tools/vibe-coding-mcp-end-2-end-testing/mcp-playwright-test/index.js
  ```
- **Auto-approve**: Enable for smoother experience

When using the standalone installation (Option 1), make sure to use the absolute path to where you installed the tool.

#### Method 2: SSE Transport

This connects to an already running MCP server:

- **Transport Type**: `sse`
- **URL**: `http://localhost:8080` (or your configured port)
- **Auto-approve**: Enable for smoother experience

### Using with Roo-Code

#### Starting Tests

In your Roo-Code editor, use this code to start a test:

```javascript
// Request to start test with custom parameters
const result = await roocode.mcp.tool("MCP", {
  command: "startTest",
  args: { 
    headless: false, // Show browser UI
    recordVideo: true // Record test video
  }
});

console.log("Test started:", result);
```

#### Accessing Test Results

```javascript
// Get all available resources
const resources = await roocode.mcp.resource("MCP", "resources");
console.log("Available resources:", resources);

// Get test results
const testResult = await roocode.mcp.resource("MCP", "resources/test-result");
console.log("Test results:", testResult);

// Get login status
const loginStatus = await roocode.mcp.resource("MCP", "resources/login-status");
console.log("Login status:", loginStatus);
```

#### Working with Screenshots

```javascript
// Get screenshot path
const loginScreenshot = await roocode.mcp.resource("MCP", "resources/login-screenshot");
console.log("Login screenshot:", loginScreenshot.path);

// You can now display or analyze this screenshot
```

## Customizing Tests

### Adding Custom Test Logic

To add custom test steps beyond the basic login and navigation:

1. Create a new module in `src/test/` directory
2. Follow the pattern in `login.js`
3. Update `index.js` to use your new module

Example for a custom test step:

```javascript
// In a new file src/test/custom-check.js
const { registerResource } = require('../mcp/server');

async function performCustomCheck(page) {
  // Your custom check logic using Playwright page
  const result = await page.evaluate(() => {
    // Client-side checks in the browser context
    return {
      title: document.title,
      elementCount: document.querySelectorAll('.important-element').length
    };
  });
  
  // Register the result as a resource
  registerResource('custom-check-result', result);
  
  return result;
}

module.exports = performCustomCheck;

// Then in index.js, add:
const performCustomCheck = require('./src/test/custom-check');
// ...
if (loginResult.success) {
  // After login steps...
  await performCustomCheck(loginModule.browserManager.page);
}
```

## Troubleshooting

### Common Issues

#### Connection Refused

**Symptom**: `Error: connect ECONNREFUSED 127.0.0.1:8080`

**Solution**: 
- Ensure the MCP server is running
- Check if the port is already in use
- Verify firewall settings

#### Selector Not Found

**Symptom**: `Error: Login form issue: Username field not found: #username`

**Solution**:
- Update selectors in `config.json`
- Use browser DevTools to identify correct selectors
- Consider using more robust selectors like `[data-testid="username"]`

#### Authentication Failures

**Symptom**: `Login failed: Error message found: Invalid credentials`

**Solution**:
- Verify username and password
- Check if the site has CAPTCHA or 2FA
- Ensure you're navigating to the correct login URL

#### Timeout Errors

**Symptom**: `TimeoutError: Navigation timeout of 60000 ms exceeded`

**Solution**:
- Increase timeout in the code
- Check network connectivity
- Verify the site isn't blocking automation tools

#### Git Repository Issues

**Symptom**: Confusion with git commands, changes not being tracked properly

**Solution**:
- Use the recommended installation methods (Options 1 or 2)
- If you've already created nested git repositories, consider moving the tool outside your project directory or using `degit` instead

### Logs and Debugging

Logs are stored in `reports/logs/mcp-server.log`.

For additional debugging:
1. Run with headless mode disabled: `{"args":{"headless":false}}`
2. Check the screenshots in `reports/screenshots/`
3. Check video recordings in `reports/videos/`