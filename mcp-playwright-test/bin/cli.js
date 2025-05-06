#!/usr/bin/env node

const { program } = require('commander');
const path = require('path');
const fs = require('fs');
const packageJson = require('../package.json');

// Define the CLI
program
  .name('mcp-playwright-test')
  .description('MCP-enabled Playwright testing tool for automated web testing with AI extensions')
  .version(packageJson.version);

// Start command
program
  .command('start')
  .description('Start the MCP server and wait for test commands')
  .option('-c, --config <path>', 'Path to config file', 'config.json')
  .option('-p, --port <port>', 'Override MCP server port')
  .action((options) => {
    // Set environment variables for configuration
    if (options.config) {
      process.env.MCP_CONFIG_PATH = options.config;
    }
    if (options.port) {
      process.env.MCP_SERVER_PORT = options.port;
    }
    
    // Run the main program
    require('../index.js');
  });

// Run test command
program
  .command('run')
  .description('Run a test immediately')
  .option('-c, --config <path>', 'Path to config file', 'config.json')
  .option('-H, --headless', 'Run in headless mode', true)
  .option('-v, --video', 'Record video', true)
  .action(async (options) => {
    // Set environment variables for configuration
    if (options.config) {
      process.env.MCP_CONFIG_PATH = options.config;
    }
    
    process.env.MCP_RUN_IMMEDIATE = 'true';
    process.env.MCP_HEADLESS = options.headless ? 'true' : 'false';
    process.env.MCP_RECORD_VIDEO = options.video ? 'true' : 'false';
    
    // Run the main program
    require('../index.js');
  });

// Init command
program
  .command('init')
  .description('Initialize a new configuration file')
  .option('-o, --output <path>', 'Output path for config file', 'config.json')
  .action((options) => {
    const configTemplate = {
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
    };
    
    const outputPath = path.resolve(process.cwd(), options.output);
    
    if (fs.existsSync(outputPath)) {
      console.error(`Configuration file already exists at ${outputPath}`);
      console.error('Use --output to specify a different location or delete the existing file.');
      process.exit(1);
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(configTemplate, null, 2));
    console.log(`Configuration template created at ${outputPath}`);
    console.log('Edit this file with your actual login details and selectors.');
  });

program.parse(process.argv);

// Show help if no arguments provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}