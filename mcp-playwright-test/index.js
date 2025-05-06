const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { format } = require('date-fns');
const LoginModule = require('./src/test/login');
const { registerResource, startServer } = require('./src/mcp/server');

// Config path
const configPath = path.resolve(__dirname, 'config.json');
let config = {};

// Prompt for user input
async function promptUserInput(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans);
  }));
}

// Load or create configuration
async function loadConfig() {
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    console.log('Configuration loaded from config.json');
  } else {
    console.log('Config file not found. Please enter the following details:');
    config.loginUrl = await promptUserInput('Login URL: ');
    config.credentials = {};
    config.credentials.username = await promptUserInput('Username: ');
    config.credentials.password = await promptUserInput('Password: ');
    config.loginSelector = {};
    config.loginSelector.username = await promptUserInput('Username input selector (e.g. #username): ');
    config.loginSelector.password = await promptUserInput('Password input selector (e.g. #password): ');
    config.loginSelector.submit = await promptUserInput('Login button selector (e.g. #login-button): ');
    config.successSelector = await promptUserInput('Success element selector (optional): ');
    config.targetUrl = await promptUserInput('Target URL after login (optional): ');
    config.mcpServerConfig = {};
    config.mcpServerConfig.port = await promptUserInput('MCP server port (default 8080): ') || 8080;

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log('Configuration saved to config.json');
  }
  
  return config;
}

// Run tests
async function runTests(options = {}) {
  // Register test start
  const testId = registerResource('test-run', { 
    status: 'started',
    timestamp: new Date().toISOString(),
    options
  });
  
  const loginModule = new LoginModule(config);
  let testResult = { success: false };
  
  try {
    // Perform login
    console.log('Starting login process...');
    const loginResult = await loginModule.login({
      headless: options.headless !== false,
      recordVideo: options.recordVideo !== false
    });
    
    if (loginResult.success) {
      console.log('Login successful, continuing with tests...');
      
      // Navigate to target URL if specified
      if (config.targetUrl) {
        await loginModule.navigateToTarget();
      }
      
      // Get accessibility data
      const accessibilityData = await loginModule.browserManager.getAccessibilityReport();
      registerResource('accessibility-data', accessibilityData);
      
      try {
        // Try to get performance metrics
        const performanceMetrics = await loginModule.browserManager.getPerformanceMetrics();
        registerResource('performance-metrics', performanceMetrics);
      } catch (error) {
        console.log('Could not get performance metrics:', error.message);
      }
      
      // Take final screenshot
      const finalScreenshot = await loginModule.browserManager.screenshot('test-complete');
      registerResource('final-screenshot', { 
        path: finalScreenshot,
        url: loginModule.browserManager.page.url()
      });
      
      testResult = { 
        success: true,
        timestamp: new Date().toISOString()
      };
    } else {
      console.log('Login failed, test cannot continue.');
      testResult = { 
        success: false,
        reason: loginResult.reason || loginResult.error || 'Login failed',
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Test error:', error);
    testResult = { 
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    registerResource('test-error', testResult);
  } finally {
    // Clean up
    await loginModule.close();
  }
  
  // Update test status
  registerResource('test-result', testResult);
  registerResource('test-completed', {
    testId,
    completedAt: new Date().toISOString(),
    ...testResult
  });
  
  return testResult;
}

// Register MCP command handlers
process.on('mcp:startTest', async (args = {}) => {
  console.log('Received command to start test with args:', args);
  await runTests(args);
});

// Main function
async function main() {
  try {
    // Load configuration
    console.log('Loading configuration...');
    await loadConfig();
    
    // Start MCP server
    console.log('Starting MCP server...');
    startServer();
    
    // Register startup resource
    registerResource('server-status', { 
      status: 'running',
      port: config.mcpServerConfig?.port || 8080,
      startTime: new Date().toISOString(),
      config: {
        // Omit credentials
        loginUrl: config.loginUrl,
        targetUrl: config.targetUrl,
        mcpServerConfig: config.mcpServerConfig
      }
    });
    
    console.log('Setup complete. MCP server is running and ready to accept commands.');
    console.log(`Send 'startTest' command to /commands/startTest to begin testing.`);
    
    // Test command examples
    console.log('\nExample curl command to start a test:');
    console.log(`curl -X POST http://localhost:${config.mcpServerConfig?.port || 8080}/commands/startTest -H "Content-Type: application/json" -d '{"args":{"headless":true}}'`);
    
    console.log('\nExample curl command to list resources:');
    console.log(`curl http://localhost:${config.mcpServerConfig?.port || 8080}/resources`);
    
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Run the application
main();