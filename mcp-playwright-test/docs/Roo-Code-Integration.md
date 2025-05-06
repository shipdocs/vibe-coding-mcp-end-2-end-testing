# Roo-Code Integration Guide

This guide provides detailed instructions specifically for integrating the MCP Playwright Test tool with Roo-Code.

## Prerequisites

- VSCode with the Roo-Code extension installed
- MCP Playwright Test tool installed (either via npm or from repository)

## Setting Up MCP Connection in Roo-Code

Roo-Code can connect to the MCP Playwright Test tool in two ways:

### Method 1: STDIO Transport (Recommended)

This method runs the MCP server on-demand as a child process:

1. Open VSCode with Roo-Code installed
2. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
3. Type and select "Roo-Code: Configure MCP Servers"
4. Click "Add Server"
5. Configure the server:
   - **Server Name**: "MCP Playwright Test"
   - **Transport Type**: "stdio"
   - **Command**: one of the following:
     - If installed via npm: `mcp-playwright-test start`
     - If installed from repository: `node /path/to/vibe-coding-mcp-end-2-end-testing/mcp-playwright-test/index.js`
   - **Auto-approve**: Enabled (recommended)
6. Click "Save"

Diagram of STDIO transport:
```
+----------------+        STDIO        +-------------------------+
|                | <----------------> |                         |
|    Roo-Code    |    Child Process   | MCP Playwright Test Tool |
|                | <----------------> |                         |
+----------------+                    +-------------------------+
```

### Method 2: SSE Transport

This method connects to an already running MCP server:

1. Start the MCP server first:
   ```bash
   # If installed via npm
   mcp-playwright-test start
   
   # If installed from repository
   node /path/to/vibe-coding-mcp-end-2-end-testing/mcp-playwright-test/index.js
   ```

2. Open VSCode with Roo-Code installed
3. Open the Command Palette (Ctrl+Shift+P or Cmd+Shift+P)
4. Type and select "Roo-Code: Configure MCP Servers"
5. Click "Add Server"
6. Configure the server:
   - **Server Name**: "MCP Playwright Test"
   - **Transport Type**: "sse"
   - **URL**: `http://localhost:8080` (or your configured port)
   - **Auto-approve**: Enabled (recommended)
7. Click "Save"

Diagram of SSE transport:
```
+----------------+        HTTP/SSE      +-------------------------+
|                | <----------------> |                         |
|    Roo-Code    |    Network Request  | MCP Playwright Test Tool |
|                | <----------------> |                         |
+----------------+                    +-------------------------+
```

## Using the Tool from Roo-Code

Once the MCP server is configured, you can use it in your Roo-Code sessions.

### Starting Tests

You can start a test run by sending the `startTest` command:

```javascript
// Request to start a test with default settings
const result = await roocode.mcp.tool("MCP Playwright Test", {
  command: "startTest"
});

console.log("Test started:", result);

// OR with custom parameters
const resultWithOptions = await roocode.mcp.tool("MCP Playwright Test", {
  command: "startTest",
  args: { 
    headless: false, // Show browser UI
    recordVideo: true // Record test video
  }
});
```

### Accessing Test Results

You can access test results and other resources:

```javascript
// List all available resources
const resources = await roocode.mcp.resource("MCP Playwright Test", "resources");
console.log("Available resources:", resources);

// Get test results
const testResult = await roocode.mcp.resource("MCP Playwright Test", "resources/test-result");
console.log("Test results:", testResult);

// Get login status
const loginStatus = await roocode.mcp.resource("MCP Playwright Test", "resources/login-status");
console.log("Login status:", loginStatus);
```

### Working with Screenshots

You can access screenshots taken during testing:

```javascript
// Get login screenshot path
const loginScreenshot = await roocode.mcp.resource("MCP Playwright Test", "resources/login-screenshot");
console.log("Login screenshot:", loginScreenshot.path);

// Get screenshot after login
const afterLoginScreenshot = await roocode.mcp.resource("MCP Playwright Test", "resources/after-login-screenshot");
console.log("After login screenshot:", afterLoginScreenshot.path);
```

## Complete Example

Here's a complete example of using the MCP Playwright Test tool from Roo-Code:

```javascript
// Start a headless test
async function runTest() {
  try {
    // Start the test
    const startResult = await roocode.mcp.tool("MCP Playwright Test", {
      command: "startTest",
      args: { headless: true }
    });
    
    console.log("Test started:", startResult);
    
    // Wait a moment for the test to complete
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Check if the test is still running
    const status = await roocode.mcp.tool("MCP Playwright Test", {
      command: "getStatus"
    });
    
    console.log("Test status:", status);
    
    // Get the test results
    const testResult = await roocode.mcp.resource("MCP Playwright Test", "resources/test-result");
    console.log("Test results:", testResult);
    
    // Get any screenshots
    const resources = await roocode.mcp.resource("MCP Playwright Test", "resources");
    
    // Find and log screenshot resources
    const screenshotResources = resources.filter(r => r.id.includes('screenshot'));
    
    for (const resourceId of screenshotResources) {
      const screenshot = await roocode.mcp.resource("MCP Playwright Test", `resources/${resourceId.id}`);
      console.log(`Screenshot ${resourceId.id}:`, screenshot.path);
    }
    
    return testResult;
  } catch (error) {
    console.error("Error running test:", error);
    return { success: false, error: error.message };
  }
}

// Run the test
runTest().then(result => {
  console.log("Test complete:", result);
});
```

## Troubleshooting

### Common Issues

1. **Cannot connect to MCP server**:
   - Check if the server is running
   - Verify the port is correct and not in use by another application
   - Try restarting the MCP server

2. **Command not found**:
   - If using npm installation, make sure the package is installed correctly
   - If using repository installation, verify the path to index.js

3. **Resources not available**:
   - Make sure to wait for the test to complete before trying to access resources
   - Check resource IDs match exactly what's available

### Logs

For detailed troubleshooting, check the logs:

- **MCP Server logs**: Located in `reports/logs/mcp-server.log`
- **Roo-Code logs**: Check the Roo-Code output panel in VSCode

## Advanced Integration

### Custom Test Steps

You can create custom test workflows by chaining commands:

```javascript
// Example: Log in, navigate, and run a specific set of checks
async function customTestFlow() {
  // Start login
  await roocode.mcp.tool("MCP Playwright Test", {
    command: "startTest",
    args: { headless: false }
  });
  
  // Wait for login to complete
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Check login result
  const loginStatus = await roocode.mcp.resource("MCP Playwright Test", "resources/login-status");
  
  if (loginStatus.success) {
    // Navigate to a specific page
    // (This would require custom commands in your MCP server implementation)
    await roocode.mcp.tool("MCP Playwright Test", {
      command: "navigate",
      args: { url: "https://example.com/dashboard/reports" }
    });
    
    // Run specific checks
    await roocode.mcp.tool("MCP Playwright Test", {
      command: "checkElement",
      args: { selector: ".report-summary" }
    });
  } else {
    console.error("Login failed:", loginStatus.reason);
  }
}
```

### AI-Assisted Testing

Roo-Code can analyze test results and suggest fixes:

```javascript
// Example: AI analysis of test failures
async function analyzeTestResults() {
  const testResult = await roocode.mcp.resource("MCP Playwright Test", "resources/test-result");
  
  if (!testResult.success) {
    // Get related resources for context
    const loginStatus = await roocode.mcp.resource("MCP Playwright Test", "resources/login-status");
    const errorDetails = await roocode.mcp.resource("MCP Playwright Test", "resources/test-error");
    
    // Ask Roo-Code to analyze the issue
    const analysis = await roocode.ask(`
      I'm seeing an error in my web test. Here are the details:
      
      Test result: ${JSON.stringify(testResult)}
      Login status: ${JSON.stringify(loginStatus)}
      Error details: ${JSON.stringify(errorDetails)}
      
      What could be causing this issue and how can I fix it?
    `);
    
    console.log("AI Analysis:", analysis);
  }
}
```